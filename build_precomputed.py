#!/usr/bin/env python3
"""Build precomputed.ts from all available slim CSVs."""
import os, json, gc
import pandas as pd
import numpy as np

DATA_DIR = "data"

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

def compute_stats(df):
    if 'subject_race' in df.columns:
        df['subject_race'] = df['subject_race'].str.lower().str.strip()
    
    df = df[df['subject_race'].isin(['white','black','hispanic','asian/pacific islander','other','unknown'])].copy()
    
    race_dist = {r: round(v, 1) for r, v in (df['subject_race'].value_counts(normalize=True) * 100).items()}
    
    search_rates = {}
    if 'search_conducted' in df.columns:
        # Handle mixed types
        df['search_conducted'] = df['search_conducted'].map(
            {True: True, False: False, 'TRUE': True, 'FALSE': False, 'True': True, 'False': False, 1: True, 0: False}
        )
        for race in ['white','black','hispanic','asian/pacific islander']:
            mask = df['subject_race'] == race
            if mask.sum() > 100:
                rate = df.loc[mask, 'search_conducted'].astype(float).mean() * 100
                if not np.isnan(rate) and rate > 0:
                    search_rates[race] = round(rate, 2)
    
    hit_rates = {}
    if 'contraband_found' in df.columns and 'search_conducted' in df.columns:
        df['contraband_found'] = df['contraband_found'].map(
            {True: True, False: False, 'TRUE': True, 'FALSE': False, 'True': True, 'False': False, 1: True, 0: False}
        )
        searched = df[df['search_conducted'] == True]
        for race in ['white','black','hispanic','asian/pacific islander']:
            mask = searched['subject_race'] == race
            if mask.sum() > 50:
                rate = searched.loc[mask, 'contraband_found'].astype(float).mean() * 100
                if not np.isnan(rate):
                    hit_rates[race] = round(rate, 1)
    
    arrest_rates = {}
    if 'arrest_made' in df.columns:
        df['arrest_made'] = df['arrest_made'].map(
            {True: True, False: False, 'TRUE': True, 'FALSE': False, 'True': True, 'False': False, 1: True, 0: False}
        )
        for race in ['white','black','hispanic','asian/pacific islander']:
            mask = df['subject_race'] == race
            if mask.sum() > 100:
                rate = df.loc[mask, 'arrest_made'].astype(float).mean() * 100
                if not np.isnan(rate):
                    arrest_rates[race] = round(rate, 2)
    
    outcome_by_race = {}
    if 'outcome' in df.columns:
        for race in ['white','black','hispanic']:
            sub = df.loc[df['subject_race'] == race, 'outcome'].dropna()
            if len(sub) > 100:
                counts = sub.value_counts(normalize=True) * 100
                outcome_by_race[race] = {k: round(v, 1) for k, v in counts.items()}
    
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
                    rate = yd.loc[mask, 'search_conducted'].astype(float).mean() * 100
                    if not np.isnan(rate):
                        row[race] = round(rate, 2)
            if 'white' in row and 'black' in row:
                yearly_trends.append(row)
    
    dates = pd.to_datetime(df['date'], errors='coerce').dropna()
    
    return {
        "total_stops": len(df),
        "sample_size": len(df),
        "date_min": str(dates.min().date()) if len(dates) > 0 else "",
        "date_max": str(dates.max().date()) if len(dates) > 0 else "",
        "race_distribution": race_dist,
        "search_rates": search_rates,
        "arrest_rates": arrest_rates,
        "hit_rates": hit_rates,
        "yearly_trends": yearly_trends,
        "outcome_by_race": outcome_by_race,
    }

all_stats = {}
for f in sorted(os.listdir(DATA_DIR)):
    if not f.endswith('_slim.csv'): continue
    sc = f.replace('_slim.csv', '')
    name = STATE_NAMES.get(sc, sc)
    path = os.path.join(DATA_DIR, f)
    
    print(f"Processing {sc} ({name})...")
    df = pd.read_csv(path, low_memory=False)
    if 'subject_race' not in df.columns:
        print(f"  ✗ {name}: skipped (no subject_race column)")
        del df; gc.collect()
        continue
    stats = compute_stats(df)
    del df; gc.collect()
    
    if stats.get('search_rates') and len(stats['search_rates']) >= 2:
        all_stats[name] = stats
        sr = stats['search_rates']
        bw = f"{sr.get('black',0)/sr.get('white',1):.1f}x" if sr.get('white',0) > 0 and sr.get('black',0) > 0 else "N/A"
        print(f"  ✓ {name}: {stats['sample_size']:,} rows, B/W: {bw}")
    else:
        print(f"  ✗ {name}: skipped (insufficient search data)")

# Build output
total_stops = sum(s['total_stops'] for s in all_stats.values())
states_list = sorted(all_stats.keys())

agg_search = {"white": [], "black": [], "hispanic": []}
agg_hit = {"white": [], "black": [], "hispanic": []}
for name, stats in sorted(all_stats.items()):
    for race in ["white", "black", "hispanic"]:
        if race in stats["search_rates"]:
            agg_search[race].append({"state": name, "rate": stats["search_rates"][race]})
        if race in stats.get("hit_rates", {}):
            agg_hit[race].append({"state": name, "rate": stats["hit_rates"][race]})

precomputed = {
    "summary": {"total_stops": total_stops, "num_states": len(states_list), "states": states_list},
    "search_rates": agg_search,
    "arrest_rates": {},
    "hit_rates": agg_hit,
    "race_distribution": {},
    "by_state": all_stats,
    "yearly_trends": {},
}

with open(os.path.join(DATA_DIR, "precomputed.json"), "w") as f:
    json.dump(precomputed, f, indent=2)

ts_path = os.path.join("web", "src", "data", "precomputed.ts")
with open(ts_path, "w") as f:
    f.write("const data = ")
    json.dump(precomputed, f)
    f.write(" as const;\n\nexport default data;\n")

print(f"\n=== {len(all_stats)} states, {total_stops:,} total stops ===")
print(f"precomputed.ts: {os.path.getsize(ts_path)/1024:.0f}KB")
