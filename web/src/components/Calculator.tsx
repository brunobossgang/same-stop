"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import data from "@/data/precomputed";

const RACE_COLORS: Record<string, string> = {
  white: "#94a3b8",
  black: "#f43f5e",
  hispanic: "#f59e0b",
};

const RACE_LABELS: Record<string, string> = {
  white: "White Driver",
  black: "Black Driver",
  hispanic: "Hispanic Driver",
};

const OUTCOME_LABELS: Record<string, string> = {
  arrest: "Arrested",
  citation: "Citation",
  warning: "Warning",
  summons: "Summons",
};

const OUTCOME_COLORS: Record<string, string> = {
  arrest: "#f43f5e",
  citation: "#f59e0b",
  warning: "#22c55e",
  summons: "#60a5fa",
};

export default function Calculator() {
  const statesWithOutcomes = data.summary.states.filter((s) => {
    const st = data.by_state[s as keyof typeof data.by_state];
    return st.outcome_by_race && Object.keys(st.outcome_by_race).length >= 3;
  });

  const [selectedState, setSelectedState] = useState<string>(statesWithOutcomes[0] || data.summary.states[0]);
  const stateData = data.by_state[selectedState as keyof typeof data.by_state];
  const outcomes = stateData.outcome_by_race || {};

  return (
    <Section id="calculator" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">Same Violation. Different Outcome.</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Same car. Same speed. Same road. The only difference? The driver&apos;s race.
        See how outcomes diverge for the exact same stop.
      </p>

      <div className="mt-6">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-800 text-white border border-white/10 rounded-lg px-4 py-2 text-sm"
        >
          {statesWithOutcomes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {(["white", "black", "hispanic"] as const).map((race) => {
          const raceOutcomes = outcomes[race as keyof typeof outcomes];
          if (!raceOutcomes) return null;

          return (
            <motion.div
              key={race}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-6"
              style={{ borderTopColor: RACE_COLORS[race], borderTopWidth: 3 }}
            >
              <h3 className="text-lg font-bold" style={{ color: RACE_COLORS[race] }}>
                {RACE_LABELS[race]}
              </h3>

              <div className="mt-4 space-y-3">
                {Object.entries(raceOutcomes)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([outcome, pct]) => (
                    <div key={outcome}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{OUTCOME_LABELS[outcome] || outcome}</span>
                        <span className="text-white/90 font-semibold">{pct as number}%</span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: OUTCOME_COLORS[outcome] || "#a78bfa" }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct as number}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {(() => {
        const b = outcomes["black" as keyof typeof outcomes] as Record<string, number> | undefined;
        const w = outcomes["white" as keyof typeof outcomes] as Record<string, number> | undefined;
        if (!b?.arrest || !w?.arrest) return null;
        const ratio = (b.arrest / Math.max(w.arrest, 0.1)).toFixed(1);
        return (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
            <p className="text-white/70">
              In {selectedState}, a Black driver is{" "}
              <span className="text-rose-400 font-bold">{ratio}×</span>{" "}
              more likely to be arrested during a traffic stop than a White driver.
            </p>
          </div>
        );
      })()}
    </Section>
  );
}
