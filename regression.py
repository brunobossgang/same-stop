#!/usr/bin/env python3
"""Run logistic regressions on traffic stop data, one state at a time."""

import json, gc, os, warnings, sys
import numpy as np
import pandas as pd
warnings.filterwarnings("ignore")

DATA_DIR = "data"
OUT_FILE = "data/regression_results.json"

STATE_ABBREVS = {
    "AZ": "Arizona", "CA": "California", "CO": "Colorado", "CT": "Connecticut",
    "FL": "Florida", "GA": "Georgia", "IA": "Iowa", "IL": "Illinois",
    "MA": "Massachusetts", "MD": "Maryland", "MI": "Michigan", "MO": "Missouri",
    "MS": "Mississippi", "MT": "Montana", "NC": "North Carolina", "ND": "North Dakota",
    "NE": "Nebraska", "NH": "New Hampshire", "NJ": "New Jersey", "NV": "Nevada",
    "NY": "New York", "OH": "Ohio", "OR": "Oregon", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee",
}

def load_state(abbrev):
    path = os.path.join(DATA_DIR, f"{abbrev}_slim.csv")
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path, low_memory=False)
    # Normalize column names
    if "state" in df.columns:
        df = df.drop(columns=["state"], errors="ignore")
    if "county_name" in df.columns:
        df = df.drop(columns=["county_name"], errors="ignore")
    return df

def prep_data(df):
    """Prepare common features."""
    # Filter to main races
    df = df[df["subject_race"].isin(["white", "black", "hispanic"])].copy()
    if len(df) < 1000:
        return None
    
    # Race dummies (white = reference)
    df["race_black"] = (df["subject_race"] == "black").astype(int)
    df["race_hispanic"] = (df["subject_race"] == "hispanic").astype(int)
    
    # Sex
    if "subject_sex" in df.columns:
        df["is_male"] = (df["subject_sex"] == "male").astype(float)
        df["is_male"] = df["is_male"].fillna(0.5)
    
    # Age
    if "subject_age" in df.columns:
        df["age"] = pd.to_numeric(df["subject_age"], errors="coerce")
        median_age = df["age"].median()
        if pd.notna(median_age):
            df["age"] = df["age"].fillna(median_age)
        else:
            df["age"] = 30.0
    
    # Year
    if "date" in df.columns:
        df["year"] = pd.to_datetime(df["date"], errors="coerce").dt.year
        df = df.dropna(subset=["year"])
        df["year"] = df["year"].astype(int)
    
    # Type dummies
    if "type" in df.columns and df["type"].nunique() > 1:
        type_dummies = pd.get_dummies(df["type"], prefix="type", drop_first=True)
        df = pd.concat([df, type_dummies], axis=1)
    
    return df

def build_formula(df, dv):
    """Build IV list based on available columns."""
    ivs = ["race_black", "race_hispanic"]
    if "is_male" in df.columns:
        ivs.append("is_male")
    if "age" in df.columns and df["age"].notna().sum() > 100:
        ivs.append("age")
    if "year" in df.columns:
        years = sorted(df["year"].unique())
        if len(years) > 1:
            # Add year dummies (drop first)
            for y in years[1:]:
                col = f"yr_{y}"
                df[col] = (df["year"] == y).astype(int)
                ivs.append(col)
    # Type dummies
    type_cols = [c for c in df.columns if c.startswith("type_")]
    ivs.extend(type_cols)
    return ivs

def run_logistic(df, dv, ivs, max_n=100000):
    """Run logistic regression, return results dict or None."""
    import statsmodels.api as sm
    
    subset = df[[dv] + ivs].dropna()
    if len(subset) < 500:
        return None
    
    # Check variation in DV
    if subset[dv].nunique() < 2:
        return None
    
    # Check each IV has variation
    ivs_clean = [c for c in ivs if subset[c].nunique() > 1]
    if "race_black" not in ivs_clean or "race_hispanic" not in ivs_clean:
        return None
    ivs = ivs_clean
    
    # Subsample if too large
    if len(subset) > max_n:
        subset = subset.sample(max_n, random_state=42)
    
    y = subset[dv].astype(float)
    X = subset[ivs].astype(float)
    X = sm.add_constant(X)
    
    try:
        model = sm.Logit(y, X)
        result = model.fit(disp=0, maxiter=35, method="lbfgs")
    except Exception:
        try:
            result = model.fit(disp=0, maxiter=25)
        except Exception:
            return None
    
    out = {"n": len(subset), "pseudo_r2": round(result.prsquared, 4)}
    
    for race in ["race_black", "race_hispanic"]:
        if race in result.params.index:
            prefix = "black" if "black" in race else "hispanic"
            coef = result.params[race]
            ci = result.conf_int().loc[race]
            out[f"{prefix}_or"] = round(np.exp(coef), 3)
            out[f"{prefix}_ci"] = [round(np.exp(ci[0]), 3), round(np.exp(ci[1]), 3)]
            out[f"{prefix}_p"] = round(float(result.pvalues[race]), 6)
    
    return out

def process_state(abbrev):
    name = STATE_ABBREVS.get(abbrev, abbrev)
    print(f"\n{'='*50}")
    print(f"Processing {name} ({abbrev})")
    print(f"{'='*50}")
    
    df = load_state(abbrev)
    if df is None:
        print(f"  No data file found")
        return None
    
    print(f"  Loaded {len(df)} rows, columns: {list(df.columns)}")
    
    df = prep_data(df)
    if df is None:
        print(f"  Insufficient data after filtering")
        return None
    
    print(f"  After prep: {len(df)} rows")
    results = {}
    
    # Model 1: Search
    if "search_conducted" in df.columns:
        df["searched"] = df["search_conducted"].map({True: 1, False: 0, "True": 1, "False": 0})
        df["searched"] = pd.to_numeric(df["searched"], errors="coerce")
        valid = df["searched"].notna().sum()
        if valid > 1000 and df["searched"].sum() > 50:
            ivs = build_formula(df, "searched")
            res = run_logistic(df, "searched", ivs)
            if res:
                results["search_model"] = res
                print(f"  Search model: n={res['n']}, Black OR={res.get('black_or','N/A')}, Hispanic OR={res.get('hispanic_or','N/A')}")
    
    # Model 2: Arrest
    if "arrest_made" in df.columns:
        df["arrested"] = df["arrest_made"].map({True: 1, False: 0, "True": 1, "False": 0})
        df["arrested"] = pd.to_numeric(df["arrested"], errors="coerce")
    elif "outcome" in df.columns:
        df["arrested"] = (df["outcome"].str.lower() == "arrest").astype(int)
    
    if "arrested" in df.columns:
        valid = df["arrested"].notna().sum()
        if valid > 1000 and df["arrested"].sum() > 50:
            ivs = build_formula(df, "arrested")
            res = run_logistic(df, "arrested", ivs)
            if res:
                results["arrest_model"] = res
                print(f"  Arrest model: n={res['n']}, Black OR={res.get('black_or','N/A')}, Hispanic OR={res.get('hispanic_or','N/A')}")
    
    # Model 3: Hit rate (among searched only)
    if "contraband_found" in df.columns and "searched" in df.columns:
        searched_df = df[df["searched"] == 1].copy()
        searched_df["found"] = searched_df["contraband_found"].map({True: 1, False: 0, "True": 1, "False": 0})
        searched_df["found"] = pd.to_numeric(searched_df["found"], errors="coerce")
        valid = searched_df["found"].notna().sum()
        if valid > 200 and searched_df["found"].sum() > 20:
            # Simple model: just race dummies
            ivs = ["race_black", "race_hispanic"]
            res = run_logistic(searched_df, "found", ivs)
            if res:
                results["hit_rate_model"] = res
                print(f"  Hit rate model: n={res['n']}, Black OR={res.get('black_or','N/A')}, Hispanic OR={res.get('hispanic_or','N/A')}")
        del searched_df
    
    del df
    gc.collect()
    
    if not results:
        return None
    return results

def main():
    all_results = {}
    
    for abbrev in sorted(STATE_ABBREVS.keys()):
        try:
            res = process_state(abbrev)
            if res:
                name = STATE_ABBREVS[abbrev]
                all_results[name] = res
        except Exception as e:
            print(f"  ERROR: {e}")
        gc.collect()
    
    print(f"\n\nResults for {len(all_results)} states")
    with open(OUT_FILE, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"Saved to {OUT_FILE}")

if __name__ == "__main__":
    main()
