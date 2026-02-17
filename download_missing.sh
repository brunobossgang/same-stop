#!/bin/bash
# Download missing states one at a time, slim with awk, delete raw
cd /Users/brunobeckman/.openclaw/workspace/SameStop

declare -A URLS
URLS[TX]="https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_tx_statewide_2020_04_01.csv.zip"
URLS[VA]="https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_va_statewide_2020_04_01.csv.zip"
URLS[VT]="https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_vt_statewide_2020_04_01.csv.zip"
URLS[WA]="https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wa_statewide_2020_04_01.csv.zip"
URLS[WI]="https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wi_statewide_2020_04_01.csv.zip"
URLS[WY]="https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wy_statewide_2020_04_01.csv.zip"

KEEP_COLS="date,subject_race,subject_sex,search_conducted,contraband_found,arrest_made,citation_issued,warning_issued,outcome,type,violation"
MAX_ROWS=500000

for STATE in TX VA VT WA WI WY; do
    SLIM="data/${STATE}_slim.csv"
    if [ -f "$SLIM" ]; then
        echo "=== $STATE: already exists, skipping ==="
        continue
    fi
    
    URL="${URLS[$STATE]}"
    echo "=== $STATE: downloading ==="
    curl -sL -o "data/${STATE}_raw.csv.zip" "$URL"
    
    if [ ! -f "data/${STATE}_raw.csv.zip" ] || [ $(stat -f%z "data/${STATE}_raw.csv.zip") -lt 1000 ]; then
        echo "=== $STATE: download failed ==="
        rm -f "data/${STATE}_raw.csv.zip"
        continue
    fi
    
    echo "=== $STATE: extracting ==="
    cd data
    unzip -o "${STATE}_raw.csv.zip" "*.csv" 2>/dev/null
    CSV=$(ls *.csv 2>/dev/null | grep -v _slim | head -1)
    cd ..
    
    if [ -z "$CSV" ]; then
        echo "=== $STATE: no CSV found in zip ==="
        rm -f "data/${STATE}_raw.csv.zip"
        continue
    fi
    
    RAW="data/$CSV"
    echo "=== $STATE: raw file is $RAW ==="
    TOTAL=$(wc -l < "$RAW")
    echo "=== $STATE: $TOTAL lines ==="
    
    # Get header and find column indices for keep cols
    HEADER=$(head -1 "$RAW")
    echo "=== $STATE: header = $HEADER ==="
    
    # Use awk to extract only needed columns and sample to MAX_ROWS
    python3 -c "
import csv, random, sys

keep = set('$KEEP_COLS'.split(','))
max_rows = $MAX_ROWS

with open('$RAW', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)
    indices = [i for i, h in enumerate(header) if h.strip() in keep]
    kept_header = [header[i].strip() for i in indices]
    
    # Read all rows (just indices) - use reservoir sampling for memory efficiency
    # Actually, let's count first then decide
    total = $TOTAL - 1  # minus header
    
    if total <= max_rows:
        sample_indices = None  # keep all
    else:
        sample_indices = set(sorted(random.sample(range(total), max_rows)))
    
    with open('$SLIM', 'w', newline='') as out:
        writer = csv.writer(out)
        writer.writerow(kept_header)
        for i, row in enumerate(reader):
            if sample_indices is None or i in sample_indices:
                writer.writerow([row[j] if j < len(row) else '' for j in indices])

print(f'Done: wrote $SLIM')
" 2>&1
    
    # Cleanup
    rm -f "$RAW" "data/${STATE}_raw.csv.zip"
    echo "=== $STATE: cleaned up ==="
    
    ls -lh "$SLIM"
    echo ""
done

echo "=== All done ==="
