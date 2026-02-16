#!/usr/bin/env python3
"""Download and process all statewide Stanford Open Policing datasets."""
import subprocess, zipfile, os, json, sys
import pandas as pd
import numpy as np

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# All statewide datasets (excluding CA, FL, IL, NC which we already have)
EXISTING = {"CA", "FL", "IL", "NC"}

URLS = {
    "AZ": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_az_statewide_2020_04_01.csv.zip",
    "CO": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_co_statewide_2020_04_01.csv.zip",
    "CT": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ct_statewide_2020_04_01.csv.zip",
    "GA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ga_statewide_2020_04_01.csv.zip",
    "IA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ia_statewide_2020_04_01.csv.zip",
    "MA": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ma_statewide_2020_04_01.csv.zip",
    "MD": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_md_statewide_2020_04_01.csv.zip",
    "MI": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_mi_statewide_2020_04_01.csv.zip",
    "MO": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_mo_statewide_2020_04_01.csv.zip",
    "MS": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ms_statewide_2020_04_01.csv.zip",
    "MT": "https://stacks.stanford.edu/file/druid:wb225bk3255/wb225bk3255_mt_statewide_2023_01_26.csv.zip",
    "NC": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_nc_statewide_2020_04_01.csv.zip",
    "ND": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_nd_statewide_2020_04_01.csv.zip",
    "NE": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_ne_statewide_2020_04_01.csv.zip",
    "NH": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_nh_statewide_2020_04_01.csv.zip",
    "NJ": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_nj_statewide_2020_04_01.csv.zip",
    "NV": "https://stacks.stanford.edu/file/druid:yg821jf8611/yg821jf8611_nv_statewide_2020_04_01.csv.zip",
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
    # Updated CA with newer version
    "CA": "https://stacks.stanford.edu/file/druid:wb225bk3255/wb225bk3255_ca_statewide_2023_01_26.csv.zip",
}

STATE_NAMES = {
    "AZ": "Arizona", "CA": "California", "CO": "Colorado", "CT": "Connecticut",
    "FL": "Florida", "GA": "Georgia", "IA": "Iowa", "IL": "Illinois",
    "MA": "Massachusetts", "MD": "Maryland", "MI": "Michigan", "MO": "Missouri",
    "MS": "Mississippi", "MT": "Montana", "NC": "North Carolina", "ND": "North Dakota",
    "NE": "Nebraska", "NH": "New Hampshire", "NJ": "New Jersey", "NV": "Nevada",
    "NY": "New York", "OH": "Ohio", "OR": "Oregon", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas",
    "VA": "Virginia", "VT": "Vermont", "WA": "Washington", "WI": "Wisconsin",
    "WY": "Wyoming",
}

KEEP_COLS = ['date','subject_race','subject_sex','subject_age','search_conducted',
             'contraband_found','arrest_made','citation_issued','warning_issued',
             'outcome','type','violation']

RACE_MAP = {
    'white': 'white', 'black': 'black', 'hispanic': 'hispanic',
    'asian/pacific islander': 'asian/pacific islander', 'other': 'other',
    'unknown': 'unknown', 'other/unknown': 'other',
}

def compute_stats(df, state_code):
    """Compute all stats for a state."""
    total_stops_estimate = len(df)  # will be adjusted if sampled
    
    # Filter to known races
    df = df[df['subject_race'].isin(['white','black','hispanic','asian/pacific islander','other','unknown'])].copy()
    
    # Race distribution
    race_counts = df['subject_race'].value_counts(normalize=True) * 100
    race_dist = {r: round(v, 1) for r, v in race_counts.items()}
    
    # Search rates by race
    search_rates = {}
    if 'search_conducted' in df.columns:
        for race in ['white','black','hispanic','asian/pacific islander']:
            mask = df['subject_race'] == race
            if mask.sum() > 100:
                rate = df.loc[mask, 'search_conducted'].mean() * 100
                if not np.isnan(rate):
                    search_rates[race] = round(rate, 2)
    
    # Hit rates (contraband found given search)
    hit_rates = {}
    if 'contraband_found' in df.columns and 'search_conducted' in df.columns:
        searched = df[df['search_conducted'] == True]
        for race in ['white','black','hispanic','asian/pacific islander']:
            mask = searched['subject_race'] == race
            if mask.sum() > 50:
                rate = searched.loc[mask, 'contraband_found'].mean() * 100
                if not np.isnan(rate):
                    hit_rates[race] = round(rate, 1)
    
    # Arrest rates
    arrest_rates = {}
    if 'arrest_made' in df.columns:
        for race in ['white','black','hispanic','asian/pacific islander']:
            mask = df['subject_race'] == race
            if mask.sum() > 100:
                rate = df.loc[mask, 'arrest_made'].mean() * 100
                if not np.isnan(rate):
                    arrest_rates[race] = round(rate, 2)
    
    # Outcome by race
    outcome_by_race = {}
    if 'outcome' in df.columns:
        for race in ['white','black','hispanic']:
            mask = df['subject_race'] == race
            sub = df.loc[mask, 'outcome'].dropna()
            if len(sub) > 100:
                counts = sub.value_counts(normalize=True) * 100
                outcome_by_race[race] = {k: round(v, 1) for k, v in counts.items()}
    
    # Yearly trends (search rates by race by year)
    yearly_trends = []
    if 'search_conducted' in df.columns and 'date' in df.columns:
        df['year'] = pd.to_datetime(df['date'], errors='coerce').dt.year
        for year in sorted(df['year'].dropna().unique()):
            yr = int(year)
            yd = df[df['year'] == yr]
            row = {"year": yr}
            for race in ['white','black','hispanic']:
                mask = yd['subject_race'] == race
                if mask.sum() > 100:
                    rate = yd.loc[mask, 'search_conducted'].mean() * 100
                    if not np.isnan(rate):
                        row[race] = round(rate, 2)
            if 'white' in row and 'black' in row:
                yearly_trends.append(row)
    
    # Date range
    dates = pd.to_datetime(df['date'], errors='coerce').dropna()
    date_min = str(dates.min().date()) if len(dates) > 0 else ""
    date_max = str(dates.max().date()) if len(dates) > 0 else ""
    
    result = {
        "total_stops": total_stops_estimate,
        "sample_size": len(df),
        "date_min": date_min,
        "date_max": date_max,
        "race_distribution": race_dist,
        "search_rates": search_rates,
        "arrest_rates": arrest_rates,
        "hit_rates": hit_rates,
        "yearly_trends": yearly_trends,
        "outcome_by_race": outcome_by_race,
    }
    return result

def process_state(state_code, url):
    """Download, extract, slim, compute stats, cleanup."""
    slim_path = os.path.join(DATA_DIR, f"{state_code}_slim.csv")
    zip_path = os.path.join(DATA_DIR, f"{state_code}_raw.csv.zip")
    
    # Skip if slim already exists
    if os.path.exists(slim_path) and state_code in EXISTING:
        print(f"  {state_code}: slim exists, computing stats from existing file")
        df = pd.read_csv(slim_path, low_memory=False)
        return compute_stats(df, state_code)
    
    # Download
    print(f"  {state_code}: downloading...")
    result = subprocess.run(
        ["curl", "-sL", "-o", zip_path, url],
        capture_output=True, timeout=600
    )
    
    if not os.path.exists(zip_path) or os.path.getsize(zip_path) < 1000:
        print(f"  {state_code}: download failed or too small, skipping")
        if os.path.exists(zip_path):
            os.remove(zip_path)
        return None
    
    # Extract
    print(f"  {state_code}: extracting...")
    try:
        with zipfile.ZipFile(zip_path) as z:
            csvname = [f for f in z.namelist() if f.endswith('.csv')][0]
            z.extract(csvname, DATA_DIR)
            csv_path = os.path.join(DATA_DIR, csvname)
    except Exception as e:
        print(f"  {state_code}: extract failed: {e}")
        os.remove(zip_path)
        return None
    
    # Read and slim
    print(f"  {state_code}: reading CSV...")
    try:
        df = pd.read_csv(csv_path, low_memory=False)
    except Exception as e:
        print(f"  {state_code}: read failed: {e}")
        os.remove(zip_path)
        if os.path.exists(csv_path):
            os.remove(csv_path)
        return None
    
    total_rows = len(df)
    print(f"  {state_code}: {total_rows} rows, columns: {len(df.columns)}")
    
    # Keep only needed columns
    keep = [c for c in KEEP_COLS if c in df.columns]
    df = df[keep].copy()
    
    # Normalize race values
    if 'subject_race' in df.columns:
        df['subject_race'] = df['subject_race'].str.lower().str.strip()
        df['subject_race'] = df['subject_race'].map(RACE_MAP).fillna('other')
    
    # Convert booleans
    for col in ['search_conducted','contraband_found','arrest_made','citation_issued','warning_issued']:
        if col in df.columns:
            df[col] = df[col].map({True: True, False: False, 'TRUE': True, 'FALSE': False, 1: True, 0: False})
    
    # Sample if needed
    if len(df) > 500000:
        df = df.sample(500000, random_state=42)
    
    # Save slim
    df.to_csv(slim_path, index=False)
    print(f"  {state_code}: saved slim ({len(df)} rows)")
    
    # Compute stats
    stats = compute_stats(df, state_code)
    stats["total_stops"] = total_rows  # Use full count, not sampled
    
    # Cleanup
    os.remove(zip_path)
    if os.path.exists(csv_path):
        os.remove(csv_path)
    print(f"  {state_code}: cleaned up raw files")
    
    return stats

def main():
    # Process existing states first
    all_stats = {}
    
    print("=== Processing existing states ===")
    for sc in sorted(EXISTING):
        slim_path = os.path.join(DATA_DIR, f"{sc}_slim.csv")
        if os.path.exists(slim_path):
            print(f"  {sc}: loading existing slim...")
            df = pd.read_csv(slim_path, low_memory=False)
            if 'subject_race' in df.columns:
                df['subject_race'] = df['subject_race'].str.lower().str.strip()
            stats = compute_stats(df, sc)
            if stats and stats.get('search_rates'):
                all_stats[STATE_NAMES[sc]] = stats
                print(f"  {sc}: ✓ ({stats['sample_size']} rows, search rates: {len(stats['search_rates'])} races)")
    
    print(f"\n=== Downloading new states ===")
    for sc, url in sorted(URLS.items()):
        if sc in EXISTING:
            continue
        print(f"\n--- {sc} ({STATE_NAMES.get(sc, sc)}) ---")
        stats = process_state(sc, url)
        if stats and stats.get('search_rates') and len(stats['search_rates']) >= 2:
            all_stats[STATE_NAMES[sc]] = stats
            print(f"  {sc}: ✓ INCLUDED ({stats['sample_size']} rows)")
        else:
            reason = "no search data" if stats else "processing failed"
            print(f"  {sc}: ✗ SKIPPED ({reason})")
    
    # Build precomputed data
    print(f"\n=== Building precomputed.json ({len(all_stats)} states) ===")
    
    total_stops = sum(s.get('total_stops', s['sample_size']) for s in all_stats.values())
    states_list = sorted(all_stats.keys())
    
    # Build aggregate search/hit rates
    agg_search = {"white": [], "black": [], "hispanic": []}
    agg_hit = {"white": [], "black": [], "hispanic": []}
    
    for state_name, stats in sorted(all_stats.items()):
        for race in ["white", "black", "hispanic"]:
            if race in stats["search_rates"]:
                agg_search[race].append({"state": state_name, "rate": stats["search_rates"][race]})
            if race in stats.get("hit_rates", {}):
                agg_hit[race].append({"state": state_name, "rate": stats["hit_rates"][race]})
    
    precomputed = {
        "summary": {
            "total_stops": total_stops,
            "num_states": len(states_list),
            "states": states_list,
        },
        "search_rates": agg_search,
        "arrest_rates": {},
        "hit_rates": agg_hit,
        "race_distribution": {},
        "by_state": all_stats,
        "yearly_trends": {},
    }
    
    # Save JSON
    json_path = os.path.join(DATA_DIR, "precomputed.json")
    with open(json_path, "w") as f:
        json.dump(precomputed, f, indent=2)
    print(f"Saved {json_path} ({os.path.getsize(json_path) / 1024:.0f}KB)")
    
    # Save as TS module
    ts_path = os.path.join("web", "src", "data", "precomputed.ts")
    with open(ts_path, "w") as f:
        f.write("const data = ")
        json.dump(precomputed, f, indent=2)
        f.write(" as const;\n\nexport default data;\n")
    print(f"Saved {ts_path} ({os.path.getsize(ts_path) / 1024:.0f}KB)")
    
    print(f"\n=== DONE: {len(all_stats)} states, {total_stops:,} total stops ===")
    for name in states_list:
        s = all_stats[name]
        sr = s.get('search_rates', {})
        bw = f"{sr.get('black',0)/sr.get('white',1):.1f}x" if sr.get('white',0) > 0 and sr.get('black',0) > 0 else "N/A"
        print(f"  {name}: {s['sample_size']:,} rows, B/W ratio: {bw}")

if __name__ == "__main__":
    main()
