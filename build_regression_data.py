#!/usr/bin/env python3
"""Inject regression results into precomputed.ts"""

import json, re

REGRESSION_FILE = "data/regression_results.json"
TS_FILE = "web/src/data/precomputed.ts"

with open(REGRESSION_FILE) as f:
    regression = json.load(f)

with open(TS_FILE) as f:
    ts_content = f.read()

# Parse existing data object
match = re.search(r'const data = ({.*?}) as const;', ts_content, re.DOTALL)
if not match:
    raise ValueError("Could not find data object in precomputed.ts")

data = json.loads(match.group(1))

# Add regression key to each state in by_state
for state_name, reg_data in regression.items():
    if state_name in data["by_state"]:
        data["by_state"][state_name]["regression"] = reg_data

# Also add top-level regression summary
data["regression"] = regression

# Write back
new_ts = f"const data = {json.dumps(data)} as const;\n\nexport default data;\n"

with open(TS_FILE, "w") as f:
    f.write(new_ts)

print(f"Updated {TS_FILE} with regression data for {len(regression)} states")
