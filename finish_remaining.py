#!/usr/bin/env python3
"""Process remaining states one at a time with memory-efficient chunked reading."""
import subprocess, zipfile, os, json, gc
import pandas as pd
import numpy as np

DATA_DIR = "data"

REMAINING = {
    "NY": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ny_statewide_2020_04_01.csv.zip",
    "OH": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_oh_statewide_2020_04_01.csv.zip",
    "OR": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_or_statewide_2020_04_01.csv.zip",
    "RI": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ri_statewide_2020_04_01.csv.zip",
    "SC": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_sc_statewide_2020_04_01.csv.zip",
    "SD": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_sd_statewide_2020_04_01.csv.zip",
    "TN": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_tn_statewide_2020_04_01.csv.zip",
    "TX": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_tx_statewide_2020_04_01.csv.zip",
    "VA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_va_statewide_2020_04_01.csv.zip",
    "VT": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_vt_statewide_2020_04_01.csv.zip",
    "WA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wa_statewide_2020_04_01.csv.zip",
    "WI": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wi_statewide_2020_04_01.csv.zip",
    "WY": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_wy_statewide_2020_04_01.csv.zip",
}

KEEP_COLS = ['date','subject_race','subject_sex','subject_age','search_conducted',
             'contraband_found','arrest_made','citation_issued','warning_issued',
             'outcome','type','violation']

def process_state(sc, url):
    slim_path = os.path.join(DATA_DIR, f"{sc}_slim.csv")
    if os.path.exists(slim_path):
        print(f"  {sc}: already done, skipping")
        return True
    
    zip_path = os.path.join(DATA_DIR, f"{sc}_raw.csv.zip")
    
    # Download
    print(f"  {sc}: downloading...")
    subprocess.run(["curl", "-sL", "-o", zip_path, url], timeout=600)
    
    if not os.path.exists(zip_path) or os.path.getsize(zip_path) < 1000:
        print(f"  {sc}: download failed")
        if os.path.exists(zip_path): os.remove(zip_path)
        return False
    
    # Extract
    try:
        with zipfile.ZipFile(zip_path) as z:
            csvname = [f for f in z.namelist() if f.endswith('.csv')][0]
            z.extract(csvname, DATA_DIR)
            csv_path = os.path.join(DATA_DIR, csvname)
    except Exception as e:
        print(f"  {sc}: extract failed: {e}")
        os.remove(zip_path)
        return False
    
    # Read with chunked approach for big files - only keep needed cols
    print(f"  {sc}: reading and slimming...")
    try:
        # Read only needed columns to save memory
        all_cols = pd.read_csv(csv_path, nrows=0).columns.tolist()
        use_cols = [c for c in KEEP_COLS if c in all_cols]
        
        chunks = []
        total_rows = 0
        for chunk in pd.read_csv(csv_path, usecols=use_cols, chunksize=200000, low_memory=False):
            total_rows += len(chunk)
            chunks.append(chunk)
        
        df = pd.concat(chunks, ignore_index=True)
        del chunks
        gc.collect()
        
        print(f"  {sc}: {total_rows} total rows, {len(df.columns)} cols")
        
        # Normalize race
        if 'subject_race' in df.columns:
            df['subject_race'] = df['subject_race'].str.lower().str.strip()
        
        # Sample
        if len(df) > 500000:
            df = df.sample(500000, random_state=42)
        
        df.to_csv(slim_path, index=False)
        print(f"  {sc}: saved slim ({len(df)} rows)")
        
        del df
        gc.collect()
        
    except Exception as e:
        print(f"  {sc}: processing failed: {e}")
        os.remove(zip_path)
        if os.path.exists(csv_path): os.remove(csv_path)
        return False
    
    # Cleanup
    os.remove(zip_path)
    if os.path.exists(csv_path): os.remove(csv_path)
    gc.collect()
    return True

for sc, url in sorted(REMAINING.items()):
    print(f"\n--- {sc} ---")
    process_state(sc, url)

print("\n=== DONE ===")
print("Slim files:", sorted([f.replace('_slim.csv','') for f in os.listdir(DATA_DIR) if f.endswith('_slim.csv')]))
