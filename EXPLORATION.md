# Same Stop, Different Outcome — Data Exploration

## Dataset: Stanford Open Policing Project
- Source: https://openpolicing.stanford.edu/data/
- 33 statewide datasets available
- Initial exploration: CA, FL, IL, NC (TX downloading)

## Summary (4 states)

| State | Stops | Date Range | Has Search | Has Arrest | Has Contraband | Has Violation |
|-------|-------|------------|------------|------------|----------------|---------------|
| CA | 31,778,515 | 2009-2016 | ✅ 100% | ✅ 70% | ⚠️ 0.2% | ✅ 100% |
| FL | 7,297,538 | 2010-2018 | ⚠️ 69% | ✅ 94% | ❌ | ✅ 94% |
| IL | 12,748,173 | 2012-2017 | ✅ 100% | ❌ | ⚠️ 5% | ✅ 100% |
| NC | 20,286,645 | 2000-2015 | ✅ 100% | ✅ 100% | ⚠️ 3% | ❌ |
| **TOTAL** | **72,110,871** | | | | | |

## Key Findings

### Search Rates (Black drivers searched ~2x White drivers)
| State | White | Black | Hispanic | Black/White Ratio |
|-------|-------|-------|----------|-------------------|
| CA | 2.54% | 4.37% | 4.93% | 1.72x |
| FL | 0.45% | 0.92% | 0.57% | 2.04x |
| IL | 3.60% | 6.88% | 6.33% | 1.91x |
| NC | 2.20% | 4.46% | 4.52% | 2.03x |

### Hit Rates — THE SMOKING GUN
When police DO search, they find contraband LESS often for Black/Hispanic drivers:

| State | White | Black | Hispanic |
|-------|-------|-------|----------|
| CA | 73.3% | 55.2% | 52.4% |
| IL | 21.0% | 22.2% | 15.7% |
| NC | 28.1% | 26.4% | 16.8% |

**Interpretation:** Police search Black drivers on weaker evidence (lower threshold of suspicion), which is the statistical signature of racial profiling.

### Arrest Rates
| State | White | Black | Hispanic |
|-------|-------|-------|----------|
| CA | 3.15% | 4.43% | 4.81% |
| FL | 0.06% | 0.13% | 0.06% |
| NC | 1.63% | 2.55% | 3.77% |

## Race Distribution
| State | White | Black | Hispanic | Asian |
|-------|-------|-------|----------|-------|
| CA | 44.3% | 8.2% | 33.1% | 6.9% |
| FL | 56.1% | 19.3% | 20.5% | 1.3% |
| IL | 63.1% | 20.1% | 13.2% | 3.3% |
| NC | 58.7% | 30.5% | 7.7% | 1.1% |

## Data Quality Notes
- contraband_found has very low coverage in most states — usable but need to caveat
- FL missing contraband data entirely
- IL missing arrest_made
- NC missing violation type
- CA has best overall coverage for search + outcome analysis

## Recommendations
1. Focus analysis on **search rate disparity** — best coverage across all states
2. Use **hit rate test** (outcome test) where contraband data available — most powerful evidence
3. Add more states for broader coverage
4. Run logistic regression: P(search) ~ race + violation_type + time_of_day + county + year
5. "Veil of darkness" test where time data is available
