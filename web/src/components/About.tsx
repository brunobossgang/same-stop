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
            4 states with the most complete data: California, Florida, Illinois, and North Carolina.
            Search rates measure how often stopped drivers are searched. Hit rates measure how often
            those searches find contraband. The outcome test — if a group is searched more but
            contraband is found less often — provides evidence of bias.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white/80">Limitations</h3>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Only 4 states with sufficiently complete data are included</li>
            <li>Data spans different time periods per state (2000–2018)</li>
            <li>Some states lack hit rate data (Florida)</li>
            <li>Observational data cannot prove causation, but patterns are consistent</li>
            <li>Definitions of &ldquo;search&rdquo; vary slightly across jurisdictions</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/30">
        <p>
          Part of the{" "}
          <a
            href="https://samecrimedifferenttime.org"
            className="text-rose-400/60 hover:text-rose-400 underline"
          >
            Same X, Different Y
          </a>{" "}
          project — data-driven investigations into systemic inequality.
        </p>
        <p className="mt-2">Built with public data. Open for scrutiny.</p>
      </div>
    </Section>
  );
}
