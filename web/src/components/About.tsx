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
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-2">
          <a href="https://x.com/Justice_Index" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white/50 transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            @Justice_Index on Twitter
          </a>
          <a href="https://instagram.com/justiceindex" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white/50 transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            @justiceindex on Instagram
          </a>
        </div>
        <p>© 2026 Justice Index</p>
      </div>
    </Section>
  );
}
