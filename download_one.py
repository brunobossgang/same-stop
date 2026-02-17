#!/usr/bin/env python3
"""Download and slim one state at a time."""
import subprocess, zipfile, os, csv, random, sys, glob

DATA_DIR = "data"
MAX_ROWS = 500000

URLS = {
    "VT": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_vt_statewide_2020_04_01.csv.zip",
    "WY": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wy_statewide_2020_04_01.csv.zip",
    "VA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_va_statewide_2020_04_01.csv.zip",
    "WI": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wi_statewide_2020_04_01.csv.zip",
    "WA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wa_statewide_2020_04_01.csv.zip",
    "TX": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_tx_statewide_2020_04_01.csv.zip",
}

KEEP_COLS = {'date','subject_race','subject_sex','search_conducted','contraband_found',
             'arrest_made','citation_issued','warning_issued','outcome','type','violation'}

state = sys.argv[1] if len(sys.argv) > 1 else None
if not state or state not in URLS:
    print(f"Usage: {sys.argv[0]} <STATE>")
    print(f"Available: {', '.join(sorted(URLS))}")
    sys.exit(1)

slim_path = os.path.join(DATA_DIR, f"{state}_slim.csv")
if os.path.exists(slim_path):
    print(f"{state}: already exists")
    sys.exit(0)

url = URLS[state]
zip_path = os.path.join(DATA_DIR, f"{state}_raw.csv.zip")

print(f"{state}: downloading from {url}...")
subprocess.run(["curl", "-sL", "-o", zip_path, url], timeout=1200)

if not os.path.exists(zip_path) or os.path.getsize(zip_path) < 1000:
    print(f"{state}: download failed")
    sys.exit(1)

print(f"{state}: zip is {os.path.getsize(zip_path)/1024/1024:.1f}MB")

print(f"{state}: extracting...")
with zipfile.ZipFile(zip_path) as z:
    csvfiles = [f for f in z.namelist() if f.endswith('.csv')]
    print(f"  Files in zip: {csvfiles}")
    csvname = csvfiles[0]
    z.extract(csvname, DATA_DIR)

csv_path = os.path.join(DATA_DIR, csvname)
print(f"{state}: extracted {csv_path}")

# Count lines
total = sum(1 for _ in open(csv_path)) - 1
print(f"{state}: {total} data rows")

# Determine sample indices if needed
sample_set = None
if total > MAX_ROWS:
    sample_set = set(sorted(random.sample(range(total), MAX_ROWS)))
    print(f"{state}: sampling {MAX_ROWS} of {total}")

# Stream through and slim
with open(csv_path, 'r') as fin, open(slim_path, 'w', newline='') as fout:
    reader = csv.reader(fin)
    header = next(reader)
    indices = [i for i, h in enumerate(header) if h.strip() in KEEP_COLS]
    kept = [header[i].strip() for i in indices]
    
    writer = csv.writer(fout)
    writer.writerow(kept)
    
    written = 0
    for i, row in enumerate(reader):
        if sample_set is None or i in sample_set:
            writer.writerow([row[j] if j < len(row) else '' for j in indices])
            written += 1

print(f"{state}: wrote {written} rows to {slim_path}")
print(f"{state}: header = {','.join(kept)}")

# Cleanup
os.remove(csv_path)
os.remove(zip_path)
print(f"{state}: cleaned up")
