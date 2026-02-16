"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Section from "./Section";
import data from "@/data/precomputed";

const HIT_RATE_STATES = ["California", "Illinois", "North Carolina"] as const;

const RACE_COLORS: Record<string, string> = {
  White: "#94a3b8",
  Black: "#f43f5e",
  Hispanic: "#f59e0b",
};

export default function SmokingGun() {
  const chartData = HIT_RATE_STATES.map((state) => {
    const st = data.by_state[state];
    return {
      state,
      "Search: White": st.search_rates.white,
      "Search: Black": st.search_rates.black,
      "Search: Hispanic": st.search_rates.hispanic,
      "Hit: White": st.hit_rates!.white,
      "Hit: Black": st.hit_rates!.black,
      "Hit: Hispanic": st.hit_rates!.hispanic,
    };
  });

  return (
    <Section id="evidence">
      <h2 className="text-3xl font-bold md:text-4xl">The Smoking Gun: Hit Rates</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        The &ldquo;outcome test&rdquo; is powerful evidence: if police search Black and Hispanic
        drivers more often but find contraband <em>less</em> often, the excess searches
        can&apos;t be justified by higher criminality. It suggests a lower bar for searching
        minority drivers.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Search rates */}
        <div>
          <h3 className="text-lg font-semibold text-white/80 mb-4">Search Rate (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="state" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }} />
                <Bar dataKey="Search: White" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Search: Black" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Search: Hispanic" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hit rates */}
        <div>
          <h3 className="text-lg font-semibold text-white/80 mb-4">Hit Rate (% searches finding contraband)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="state" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }} />
                <Bar dataKey="Hit: White" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hit: Black" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hit: Hispanic" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-rose-500/10 border border-rose-500/20 rounded-xl p-6">
        <p className="text-rose-400 font-semibold">Key Insight</p>
        <p className="mt-2 text-white/70">
          In every state, Black and Hispanic drivers are searched at higher rates, but contraband
          is found at <span className="text-white font-semibold">equal or lower rates</span> compared
          to White drivers. This pattern — higher search rates with lower hit rates — is strong
          evidence of racial bias in search decisions.
        </p>
      </div>
    </Section>
  );
}
