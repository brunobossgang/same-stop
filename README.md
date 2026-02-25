# 🚔 Same Stop, Different Outcome

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live](https://img.shields.io/badge/Live-samestopdifferentoutcome.org-blue)](https://samestopdifferentoutcome.org)

**Are traffic stops truly race-neutral? An analysis of 8.6 million stops across 18 states reveals persistent disparities in who gets searched — and challenges the justification for those searches.**

🔗 **Live:** [samestopdifferentoutcome.org](https://samestopdifferentoutcome.org)

---

## Key Findings

- **Search rate disparities:** Black and Hispanic drivers are searched at significantly higher rates than white drivers during traffic stops
- **Hit rate paradox:** Despite being searched more often, Black and Hispanic drivers are found with contraband at *equal or lower* rates — suggesting a lower threshold of suspicion is applied
- Patterns are consistent across the **18 states** analyzed

## Data

- **Source:** [Stanford Open Policing Project](https://openpolicing.stanford.edu/)
- **Scope:** 8.6 million traffic stops with search data across 18 states
- **Unit of analysis:** Individual traffic stop

## Methodology

Analysis of search rates and hit rates (contraband found given search) by race/ethnicity, controlling for stop location and context. The hit rate test — also known as the outcome test — follows the framework established by Knowles, Persico & Todd (2001) and applied at scale by Pierson et al. (2020) in the Stanford Open Policing Project.

**Limitations:** Data availability and reporting standards vary by state. Not all stops include search or outcome data. Results reflect patterns in reported data, which may itself be subject to reporting bias.

## Tech Stack

- **Frontend:** React / Next.js + Tailwind CSS, deployed on Vercel
- **Analysis:** Python (pandas, statsmodels)

## Part of the Justice Index Project

**[Justice Index](https://justice-index.org)** analyzes racial bias across American institutions. This is one of three live investigations:

| Investigation | Focus | Data |
|---|---|---|
| **[Same Crime, Different Time](https://samecrimedifferenttime.org)** | Federal sentencing | 1.3M cases |
| **[Same Stop, Different Outcome](https://samestopdifferentoutcome.org)** | Traffic policing | 8.6M stops |
| **[Same Loan, Different Rate](https://sameloandifferentrate.org)** | Mortgage lending | 1.9M applications |

## License

MIT — see [LICENSE](LICENSE).

## Author

**Bruno Beckman** · [justice-index.org](https://justice-index.org)
