"use client";

import Section from "./Section";
import data from "@/data/precomputed";

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

export default function StateCards() {
  const states = data.summary.states;

  return (
    <Section id="states" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">State by State</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Each state tells its own story. Explore the data behind the disparities.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {states.map((state) => {
          const st = data.by_state[state as keyof typeof data.by_state];
          const bRate = st.search_rates.black ?? 0;
          const wRate = st.search_rates.white ?? 0;
          const ratio = wRate > 0 ? (bRate / wRate).toFixed(1) : "N/A";

          return (
            <div
              key={state}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 hover:border-rose-500/30 transition-colors"
            >
              <h3 className="text-xl font-bold">{state}</h3>
              <p className="text-sm text-white/40 mt-1">
                {st.date_min} → {st.date_max}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white/90">{formatNum(st.total_stops)}</div>
                  <div className="text-xs text-white/40">Total Stops</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-500">{ratio}×</div>
                  <div className="text-xs text-white/40">B/W Search Ratio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/90">{formatNum(st.sample_size)}</div>
                  <div className="text-xs text-white/40">Sample Size</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {Object.entries(st.search_rates).map(([race, rate]) => (
                  <div key={race} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-white/50 capitalize">{race}</div>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min((rate as number) * 10, 100)}%`,
                          backgroundColor:
                            race === "black" ? "#f43f5e" :
                            race === "hispanic" ? "#f59e0b" :
                            race === "white" ? "#94a3b8" :
                            race.includes("asian") ? "#22d3ee" : "#a78bfa",
                        }}
                      />
                    </div>
                    <div className="w-12 text-xs text-white/60 text-right">{rate as number}%</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
