"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Section from "./Section";
import data from "@/data/precomputed";

const RACE_COLORS: Record<string, string> = {
  white: "#94a3b8",
  black: "#f43f5e",
  hispanic: "#f59e0b",
  "asian/pacific islander": "#22d3ee",
  other: "#a78bfa",
};

const RACE_LABELS: Record<string, string> = {
  white: "White",
  black: "Black",
  hispanic: "Hispanic",
  "asian/pacific islander": "Asian/PI",
  other: "Other",
};

export default function SearchRates() {
  const states = data.summary.states;
  const [selectedState, setSelectedState] = useState<string>(states[0]);

  const stateData = data.by_state[selectedState as keyof typeof data.by_state];
  const searchRates = stateData.search_rates;

  const chartData = Object.entries(searchRates).map(([race, rate]) => ({
    race: RACE_LABELS[race] || race,
    rate: rate as number,
    fill: RACE_COLORS[race] || "#a78bfa",
  }));

  const blackRate = searchRates.black ?? 0;
  const hispanicRate = searchRates.hispanic ?? 0;
  const whiteRate = searchRates.white ?? 0;
  const bwRatio = whiteRate > 0 ? (blackRate / whiteRate).toFixed(1) : "N/A";
  const hwRatio = whiteRate > 0 ? (hispanicRate / whiteRate).toFixed(1) : "N/A";
  const worstRace = Number(hwRatio) > Number(bwRatio) ? "Hispanic" : "Black";
  const worstRatio = Number(hwRatio) > Number(bwRatio) ? hwRatio : bwRatio;

  return (
    <Section id="search" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">Who Gets Searched?</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Not everyone pulled over faces the same scrutiny. Search rates reveal who police
        choose to investigate further — and the disparities are stark.
      </p>

      <div className="mt-6">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-800 text-white border border-white/10 rounded-lg px-4 py-2 text-sm"
        >
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
            <YAxis type="category" dataKey="race" tick={{ fill: "#94a3b8", fontSize: 12 }} width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`${value}%`, "Search Rate"]}
            />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
          <span className="text-3xl font-black text-rose-500">{bwRatio}×</span>
          <span className="text-white/70 text-sm">
            <span className="text-rose-400 font-semibold">Black</span> vs White search rate in {selectedState}
          </span>
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
          <span className="text-3xl font-black text-amber-500">{hwRatio}×</span>
          <span className="text-white/70 text-sm">
            <span className="text-amber-400 font-semibold">Hispanic</span> vs White search rate in {selectedState}
          </span>
        </div>
      </div>
    </Section>
  );
}
