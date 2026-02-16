#!/usr/bin/env python3
"""Analyze each state CSV using chunked reading to manage memory."""
import pandas as pd
import sys
import os
import json
import gc

DATA_DIR = "data"
KEY_COLS = ['subject_race', 'subject_sex', 'subject_age', 'search_conducted', 
            'arrest_made', 'contraband_found', 'outcome', 'violation', 'date']
SLIM_COLS = ['date', 'subject_race', 'subject_sex', 'subject_age',
             'search_conducted', 'arrest_made', 'contraband_found', 'outcome', 
             'violation', 'county_name']
CHUNK_SIZE = 500_000

results = {}
states = sys.argv[1:] if len(sys.argv) > 1 else ['CA', 'FL', 'IL', 'NC', 'TX']

for state in states:
    path = os.path.join(DATA_DIR, f"{state}.csv")
    if not os.path.exists(path):
        print(f"SKIP {state} - file not found", flush=True)
        continue
    
    print(f"\n{'='*60}", flush=True)
    print(f"ANALYZING {state} ({os.path.getsize(path)/1e9:.1f} GB)", flush=True)
    print(f"{'='*60}", flush=True)
    
    # First pass: get columns
    sample = pd.read_csv(path, nrows=5)
    all_columns = list(sample.columns)
    print(f"Columns ({len(all_columns)}): {all_columns}", flush=True)
    
    # Determine which columns to read (only what we need)
    need_cols = [c for c in KEY_COLS + ['county_name'] if c in all_columns]
    
    # Chunked analysis
    total_rows = 0
    race_counts = {}
    search_by_race = {}  # {race: [searches, total]}
    arrest_by_race = {}  # {race: [arrests, total]}
    hit_by_race = {}     # {race: [hits, searched]}
    coverage_nonnull = {c: 0 for c in KEY_COLS}
    date_min = None
    date_max = None
    
    # Also write slim CSV chunks
    slim_path = os.path.join(DATA_DIR, f"{state}_slim.csv")
    slim_header_written = False
    
    print(f"Reading in chunks of {CHUNK_SIZE:,}...", flush=True)
    
    for i, chunk in enumerate(pd.read_csv(path, usecols=need_cols, chunksize=CHUNK_SIZE, low_memory=False)):
        n = len(chunk)
        total_rows += n
        
        if (i+1) % 5 == 0:
            print(f"  Chunk {i+1}: {total_rows:,} rows so far...", flush=True)
        
        # Convert booleans
        for bcol in ['search_conducted', 'arrest_made', 'contraband_found']:
            if bcol in chunk.columns:
                chunk[bcol] = chunk[bcol].map({True: True, False: False, 'True': True, 'FALSE': False, 'False': False, 'TRUE': True})
        
        # Coverage
        for col in KEY_COLS:
            if col in chunk.columns:
                coverage_nonnull[col] += chunk[col].notna().sum()
        
        # Date range
        if 'date' in chunk.columns:
            dates = pd.to_datetime(chunk['date'], errors='coerce')
            cmin, cmax = dates.min(), dates.max()
            if date_min is None or cmin < date_min:
                date_min = cmin
            if date_max is None or cmax > date_max:
                date_max = cmax
        
        # Race counts
        if 'subject_race' in chunk.columns:
            vc = chunk['subject_race'].value_counts(dropna=False)
            for race, count in vc.items():
                race_key = str(race) if pd.notna(race) else 'NaN'
                race_counts[race_key] = race_counts.get(race_key, 0) + count
            
            # Search rate
            if 'search_conducted' in chunk.columns:
                grp = chunk.groupby('subject_race')['search_conducted']
                for race, sub in grp:
                    rk = str(race)
                    if rk not in search_by_race:
                        search_by_race[rk] = [0, 0]
                    search_by_race[rk][0] += sub.sum()
                    search_by_race[rk][1] += sub.notna().sum()
            
            # Arrest rate
            if 'arrest_made' in chunk.columns:
                grp = chunk.groupby('subject_race')['arrest_made']
                for race, sub in grp:
                    rk = str(race)
                    if rk not in arrest_by_race:
                        arrest_by_race[rk] = [0, 0]
                    arrest_by_race[rk][0] += sub.sum()
                    arrest_by_race[rk][1] += sub.notna().sum()
            
            # Hit rate
            if 'contraband_found' in chunk.columns and 'search_conducted' in chunk.columns:
                searched = chunk[chunk['search_conducted'] == True]
                if len(searched) > 0:
                    grp = searched.groupby('subject_race')['contraband_found']
                    for race, sub in grp:
                        rk = str(race)
                        if rk not in hit_by_race:
                            hit_by_race[rk] = [0, 0]
                        hit_by_race[rk][0] += sub.sum()
                        hit_by_race[rk][1] += sub.notna().sum()
        
        # Write slim
        slim_avail = [c for c in SLIM_COLS if c in chunk.columns]
        slim_chunk = chunk[slim_avail].copy()
        slim_chunk.insert(0, 'state', state)
        slim_chunk.to_csv(slim_path, mode='a', header=not slim_header_written, index=False)
        slim_header_written = True
        
        del chunk, slim_chunk
    
    gc.collect()
    
    print(f"\nTotal rows: {total_rows:,}", flush=True)
    
    # Coverage
    coverage = {}
    print(f"\n--- Coverage ---", flush=True)
    for col in KEY_COLS:
        if col in need_cols:
            pct = round(coverage_nonnull[col] / total_rows * 100, 1)
            coverage[col] = pct
            print(f"  {col}: {pct}%", flush=True)
        else:
            coverage[col] = None
            print(f"  {col}: NOT PRESENT", flush=True)
    
    # Date range
    date_range = f"{date_min} to {date_max}" if date_min else "N/A"
    print(f"\nDate range: {date_range}", flush=True)
    
    # Race distribution
    print(f"\n--- Race distribution ---", flush=True)
    race_pct = {}
    for race, count in sorted(race_counts.items(), key=lambda x: -x[1]):
        pct = round(count / total_rows * 100, 1)
        race_pct[race] = pct
        print(f"  {race}: {count:,} ({pct}%)", flush=True)
    
    # Search rate
    print(f"\n--- Search rate by race ---", flush=True)
    search_rate = {}
    for race in sorted(search_by_race.keys()):
        s, t = search_by_race[race]
        rate = round(s / t * 100, 2) if t > 0 else 0
        search_rate[race] = rate
        print(f"  {race}: {rate}%", flush=True)
    
    # Arrest rate
    print(f"\n--- Arrest rate by race ---", flush=True)
    arrest_rate = {}
    for race in sorted(arrest_by_race.keys()):
        a, t = arrest_by_race[race]
        rate = round(a / t * 100, 2) if t > 0 else 0
        arrest_rate[race] = rate
        print(f"  {race}: {rate}%", flush=True)
    
    # Hit rate
    print(f"\n--- Hit rate by race (contraband | searched) ---", flush=True)
    hit_rate = {}
    for race in sorted(hit_by_race.keys()):
        h, s = hit_by_race[race]
        rate = round(h / s * 100, 2) if s > 0 else 0
        hit_rate[race] = rate
        n_searched = search_by_race.get(race, [0,0])[0]
        print(f"  {race}: {rate}% (n={int(s):,} searched)", flush=True)
    
    results[state] = {
        'rows': total_rows,
        'columns': all_columns,
        'coverage': coverage,
        'date_range': date_range,
        'race_counts': race_counts,
        'race_pct': race_pct,
        'search_rate': search_rate,
        'arrest_rate': arrest_rate,
        'hit_rate': hit_rate,
    }
    
    print(f"\nSlim file: {slim_path} ({os.path.getsize(slim_path)/1e6:.1f} MB)", flush=True)
    
    # Delete the full CSV
    os.remove(path)
    print(f"Deleted {path}", flush=True)

# Save results
with open('analysis_results.json', 'w') as f:
    json.dump(results, f, indent=2, default=str)
print(f"\nSaved analysis_results.json", flush=True)
print("DONE", flush=True)
