"use client";

import Section from "./Section";

export default function About() {
  return (
    <Section id="about">
      <h2 className="text-3xl font-bold md:text-4xl">About This Project</h2>

      <div className="mt-8 space-y-6 text-white/60">
        <div>
          <h3 className="text-lg font-semibold text-white/80">Data Source</h3>
          <p className="mt-2">
            This project uses data from the{" "}
            <a
              href="https://openpolicing.stanford.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 underline"
            >
              Stanford Open Policing Project
            </a>
            , which collected and standardized over 200 million traffic stop records from across
            the United States.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white/80">Citation</h3>
          <p className="mt-2 text-sm">
            E. Pierson, C. Simoiu, J. Overgoor, S. Corbett-Davies, D. Jenson, A. Shoemaker,
            V. Ramachandran, P. Barghouty, C. Phillips, R. Shroff, and S. Goel.{" "}
            <em>&ldquo;A large-scale analysis of racial disparities in police stops across the United States.&rdquo;</em>{" "}
            Nature Human Behaviour, Vol. 4, 2020.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white/80">Methodology</h3>
          <p className="mt-2">
            We analyze search rates, hit rates (the &ldquo;outcome test&rdquo;), and yearly trends across
            17 states with the most complete data, from coast to coast.
            Search rates measure how often stopped drivers are searched. Hit rates measure how often
            those searches find contraband. The outcome test — if a group is searched more but
            contraband is found less often — provides evidence of bias.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white/80">Regression Analysis</h3>
          <p className="mt-2">
            We run logistic regressions for each state to control for confounding variables.
            The search model predicts whether a stopped driver is searched, controlling for
            age, sex, year, stop type, and violation category — with race as the key
            independent variable (white drivers as reference). We report odds ratios: a value
            of 2.0× means that group is twice as likely to be searched after accounting for
            all other factors. The arrest model uses the same controls to predict arrest.
            The hit rate model tests the &ldquo;outcome test&rdquo; — among searched drivers only,
            whether contraband is found at different rates by race. Lower hit rates for
            groups searched more frequently suggests the higher search rate is not justified
            by contraband discovery.
          </p>
          <p className="mt-2">
            Models use up to 100,000 observations per state (randomly sampled where datasets
            are larger). Confidence intervals are 95%. Statistical significance is indicated
            by ★ markers (★★★ = p &lt; 0.001).
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white/80">Limitations</h3>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>18 of 33 available states had sufficiently complete search data</li>
            <li>Data spans different time periods per state (2000–2018)</li>
            <li>Some states lack hit rate data (Florida)</li>
            <li>Observational data cannot prove causation, but patterns are consistent</li>
            <li>Definitions of &ldquo;search&rdquo; vary slightly across jurisdictions</li>
          </ul>
        </div>
      </div>

      {/* Cross-link banner */}
      <div className="mt-12 bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 rounded-2xl p-6">
        <p className="text-sm font-medium uppercase tracking-wider text-rose-400/80 mb-2">
          Justice Index · Three Investigations
        </p>
        <p className="text-white/70">
          Bias doesn&apos;t stop at traffic stops. It follows people from the street
          to the courtroom to the bank.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://samecrimedifferenttime.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl text-rose-400 hover:text-rose-300 text-sm font-semibold transition-colors"
          >
            Same Crime, Different Time → Federal Sentencing
          </a>
          <a
            href="https://sameloandifferentrate.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl text-rose-400 hover:text-rose-300 text-sm font-semibold transition-colors"
          >
            Same Loan, Different Rate → Mortgage Lending
          </a>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/30">
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <a href="https://justice-index.org" className="hover:text-white/50 transition">Justice Index</a>
          <a href="https://samecrimedifferenttime.org" className="hover:text-white/50 transition">Same Crime</a>
          <a href="https://sameloandifferentrate.org" className="hover:text-white/50 transition">Same Loan</a>
          <a href="https://github.com/brunobossgang/same-stop" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition">GitHub</a>
          <a href="https://instagram.com/justiceindex" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition">Instagram</a>
        </div>
        <p>© 2026 Justice Index</p>
      </div>
    </Section>
  );
}
