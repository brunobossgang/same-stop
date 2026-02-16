#!/usr/bin/env python3
"""Download and process state-level traffic stop data from Stanford Open Policing Project."""
import pandas as pd
import numpy as np
import os
import json
import gc
import subprocess
import sys

DATA_DIR = "data"
BASE_URL = "https://stacks.stanford.edu/file/druid:yg821jf8611"

NEEDED_COLS = ['date', 'subject_race', 'subject_sex', 'subject_age', 
               'search_conducted', 'contraband_found', 'arrest_made',
               'citation_issued', 'warning_issued', 'outcome', 'stop_type', 'violation']

STATE_NAMES = {
    'CA': 'California', 'FL': 'Florida', 'IL': 'Illinois', 'NC': 'North Carolina',
    'TX': 'Texas', 'OH': 'Ohio', 'CT': 'Connecticut', 'CO': 'Colorado',
    'SC': 'South Carolina', 'WI': 'Wisconsin', 'WA': 'Washington', 'MT': 'Montana',
    'RI': 'Rhode Island', 'VT': 'Vermont', 'AZ': 'Arizona', 'NJ': 'New Jersey',
    'SD': 'South Dakota', 'WY': 'Wyoming', 'ND': 'North Dakota', 'MS': 'Mississippi',
    'MD': 'Maryland', 'MA': 'Massachusetts', 'TN': 'Tennessee'
}

SAMPLE_SIZE = 500_000
CHUNK_SIZE = 500_000

def analyze_state(state_code, csv_path):
    """Analyze a state CSV and return stats dict."""
    print(f"\n{'='*60}", flush=True)
    print(f"ANALYZING {state_code} ({os.path.getsize(csv_path)/1e9:.2f} GB)", flush=True)
    
    # Check columns
    sample = pd.read_csv(csv_path, nrows=5)
    all_cols = list(sample.columns)
    use_cols = [c for c in NEEDED_COLS if c in all_cols]
    if 'date' not in use_cols:
        print(f"  WARNING: no 'date' column! Cols: {all_cols}", flush=True)
    
    print(f"  Available useful cols: {use_cols}", flush=True)
    
    # Count total rows first (fast)
    print(f"  Counting rows...", flush=True)
    total_rows = sum(1 for _ in open(csv_path)) - 1
    print(f"  Total rows: {total_rows:,}", flush=True)
    
    # If large, sample
    if total_rows > SAMPLE_SIZE:
        print(f"  Sampling {SAMPLE_SIZE:,} rows (seed=42)...", flush=True)
        np.random.seed(42)
        skip_idx = np.random.choice(range(1, total_rows + 1), size=total_rows - SAMPLE_SIZE, replace=False)
        skip_set = set(skip_idx)
        df = pd.read_csv(csv_path, usecols=use_cols, skiprows=lambda i: i > 0 and i in skip_set, low_memory=False)
    else:
        df = pd.read_csv(csv_path, usecols=use_cols, low_memory=False)
    
    sample_size = len(df)
    print(f"  Loaded {sample_size:,} rows", flush=True)
    
    # Convert booleans
    for bcol in ['search_conducted', 'arrest_made', 'contraband_found', 'citation_issued', 'warning_issued']:
        if bcol in df.columns:
            df[bcol] = df[bcol].map({True: True, False: False, 'True': True, 'FALSE': False, 
                                      'False': False, 'TRUE': True, 'true': True, 'false': False})
    
    # Date range
    date_min = date_max = None
    if 'date' in df.columns:
        dates = pd.to_datetime(df['date'], errors='coerce')
        date_min = str(dates.min().date()) if dates.notna().any() else None
        date_max = str(dates.max().date()) if dates.notna().any() else None
    
    # Race distribution
    race_dist = {}
    if 'subject_race' in df.columns:
        vc = df['subject_race'].value_counts(dropna=True)
        total_with_race = vc.sum()
        for race, count in vc.items():
            race_dist[str(race)] = round(count / total_with_race * 100, 1)
    
    # Search rates by race
    search_rates = {}
    if 'subject_race' in df.columns and 'search_conducted' in df.columns:
        grp = df.groupby('subject_race')['search_conducted']
        for race, sub in grp:
            n_valid = sub.notna().sum()
            if n_valid > 100:
                search_rates[str(race)] = round(sub.sum() / n_valid * 100, 2)
    
    # Arrest rates by race
    arrest_rates = {}
    if 'subject_race' in df.columns and 'arrest_made' in df.columns:
        grp = df.groupby('subject_race')['arrest_made']
        for race, sub in grp:
            n_valid = sub.notna().sum()
            if n_valid > 100:
                arrest_rates[str(race)] = round(sub.sum() / n_valid * 100, 2)
    
    # Hit rates by race
    hit_rates = {}
    if 'subject_race' in df.columns and 'search_conducted' in df.columns and 'contraband_found' in df.columns:
        searched = df[df['search_conducted'] == True]
        if len(searched) > 0:
            grp = searched.groupby('subject_race')['contraband_found']
            for race, sub in grp:
                n_valid = sub.notna().sum()
                if n_valid > 50:
                    hit_rates[str(race)] = round(sub.sum() / n_valid * 100, 1)
    
    # Yearly trends (search rates)
    yearly_trends = []
    if 'date' in df.columns and 'subject_race' in df.columns and 'search_conducted' in df.columns:
        df['_year'] = pd.to_datetime(df['date'], errors='coerce').dt.year
        main_races = ['white', 'black', 'hispanic']
        for year, ydf in df.groupby('_year'):
            if pd.isna(year) or ydf.shape[0] < 1000:
                continue
            entry = {'year': int(year)}
            for race in main_races:
                rdf = ydf[ydf['subject_race'] == race]
                if len(rdf) > 100 and 'search_conducted' in rdf.columns:
                    valid = rdf['search_conducted'].notna().sum()
                    if valid > 100:
                        entry[race] = round(rdf['search_conducted'].sum() / valid * 100, 2)
            if len(entry) > 1:
                yearly_trends.append(entry)
        df.drop(columns=['_year'], inplace=True, errors='ignore')
    
    # Outcome by race
    outcome_by_race = {}
    if 'subject_race' in df.columns and 'outcome' in df.columns:
        for race in ['white', 'black', 'hispanic']:
            rdf = df[df['subject_race'] == race]
            if len(rdf) > 100:
                oc = rdf['outcome'].value_counts(dropna=True)
                total_oc = oc.sum()
                if total_oc > 0:
                    outcome_by_race[race] = {}
                    for outcome_val, count in oc.items():
                        pct = round(count / total_oc * 100, 1)
                        if pct >= 0.1:
                            outcome_by_race[race][str(outcome_val)] = pct
    # Fallback: construct from boolean columns if outcome column empty/missing
    if not outcome_by_race and 'subject_race' in df.columns:
        bool_outcomes = ['arrest_made', 'citation_issued', 'warning_issued']
        avail = [c for c in bool_outcomes if c in df.columns]
        if avail:
            for race in ['white', 'black', 'hispanic']:
                rdf = df[df['subject_race'] == race]
                if len(rdf) > 100:
                    outcome_by_race[race] = {}
                    for col in avail:
                        n_valid = rdf[col].notna().sum()
                        if n_valid > 0:
                            key = col.replace('_made', '').replace('_issued', '')
                            outcome_by_race[race][key] = round(rdf[col].sum() / n_valid * 100, 1)
    
    result = {
        'total_stops': total_rows,
        'sample_size': sample_size,
        'date_min': date_min,
        'date_max': date_max,
        'race_distribution': race_dist,
        'search_rates': search_rates,
        'arrest_rates': arrest_rates,
        'hit_rates': hit_rates,
        'yearly_trends': yearly_trends,
        'outcome_by_race': outcome_by_race,
    }
    
    print(f"  Search rates: {search_rates}", flush=True)
    print(f"  Hit rates: {hit_rates}", flush=True)
    print(f"  Date range: {date_min} to {date_max}", flush=True)
    print(f"  Race dist: {race_dist}", flush=True)
    
    del df
    gc.collect()
    return result


def process_tx():
    """Process TX.zip which is already downloaded."""
    zip_path = os.path.join(DATA_DIR, "TX.zip")
    if not os.path.exists(zip_path):
        print("TX.zip not found, skipping", flush=True)
        return None
    
    # Check if already processed
    slim_path = os.path.join(DATA_DIR, "TX_slim.csv")
    if os.path.exists(slim_path):
        print("TX_slim.csv already exists, skipping extraction", flush=True)
        return None
    
    print("Extracting TX.zip...", flush=True)
    subprocess.run(['unzip', '-o', zip_path, '-d', DATA_DIR], check=True)
    
    # Find the CSV
    for f in os.listdir(DATA_DIR):
        if f.startswith('TX') and f.endswith('.csv') and '_slim' not in f:
            csv_path = os.path.join(DATA_DIR, f)
            result = analyze_state('TX', csv_path)
            os.remove(csv_path)
            print(f"Deleted {csv_path}", flush=True)
            os.remove(zip_path)
            print(f"Deleted {zip_path}", flush=True)
            return result
    
    print("No TX CSV found in zip!", flush=True)
    return None


def download_and_process(state_code):
    """Download a state's data and process it."""
    gz_path = os.path.join(DATA_DIR, f"{state_code}_cleaned.csv.gz")
    csv_path = os.path.join(DATA_DIR, f"{state_code}_cleaned.csv")
    
    # Download
    url = f"{BASE_URL}/{state_code}_cleaned.csv.gz"
    print(f"\nDownloading {state_code} from {url}...", flush=True)
    ret = subprocess.run(['curl', '-fSL', '-o', gz_path, url], capture_output=True, text=True)
    if ret.returncode != 0:
        print(f"  FAILED to download {state_code}: {ret.stderr[:200]}", flush=True)
        if os.path.exists(gz_path):
            os.remove(gz_path)
        return None
    
    if not os.path.exists(gz_path) or os.path.getsize(gz_path) < 1000:
        print(f"  File too small or missing for {state_code}, skipping", flush=True)
        if os.path.exists(gz_path):
            os.remove(gz_path)
        return None
    
    print(f"  Downloaded {os.path.getsize(gz_path)/1e6:.1f} MB", flush=True)
    
    # Gunzip
    print(f"  Gunzipping...", flush=True)
    subprocess.run(['gunzip', '-f', gz_path], check=True)
    
    if not os.path.exists(csv_path):
        # Maybe different name
        for f in os.listdir(DATA_DIR):
            if f.startswith(state_code) and f.endswith('.csv') and '_slim' not in f:
                csv_path = os.path.join(DATA_DIR, f)
                break
    
    if not os.path.exists(csv_path):
        print(f"  No CSV found after gunzip for {state_code}", flush=True)
        return None
    
    result = analyze_state(state_code, csv_path)
    
    # Clean up
    os.remove(csv_path)
    print(f"  Deleted {csv_path}", flush=True)
    
    return result


def reanalyze_existing(state_code):
    """Re-analyze an existing slim CSV."""
    slim_path = os.path.join(DATA_DIR, f"{state_code}_slim.csv")
    if not os.path.exists(slim_path):
        return None
    print(f"\nRe-analyzing existing {state_code}_slim.csv...", flush=True)
    return analyze_state(state_code, slim_path)


if __name__ == '__main__':
    all_results = {}
    
    # Re-analyze existing states
    for sc in ['CA', 'FL', 'IL', 'NC']:
        r = reanalyze_existing(sc)
        if r:
            all_results[sc] = r
    
    # Process TX
    tx = process_tx()
    if tx:
        all_results['TX'] = tx
    
    # Download new states
    new_states = ['OH', 'CT', 'CO', 'SC', 'WI', 'WA', 'MT', 'RI', 'VT', 'AZ', 
                  'NJ', 'SD', 'WY', 'ND', 'MS', 'MD', 'MA', 'TN']
    
    for sc in new_states:
        try:
            r = download_and_process(sc)
            if r:
                all_results[sc] = r
        except Exception as e:
            print(f"ERROR processing {sc}: {e}", flush=True)
    
    # Save all results
    with open(os.path.join(DATA_DIR, 'all_results.json'), 'w') as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n\n{'='*60}", flush=True)
    print(f"SUMMARY: Processed {len(all_results)} states", flush=True)
    for sc, r in sorted(all_results.items()):
        print(f"  {sc} ({STATE_NAMES.get(sc, sc)}): {r['total_stops']:,} stops, {r['date_min']} to {r['date_max']}", flush=True)
    print(f"  Total stops: {sum(r['total_stops'] for r in all_results.values()):,}", flush=True)
