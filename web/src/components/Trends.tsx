"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Section from "./Section";
import data from "@/data/precomputed";

export default function Trends() {
  const states = data.summary.states;
  const [selectedState, setSelectedState] = useState<string>(states[0]);

  const stateData = data.by_state[selectedState as keyof typeof data.by_state];
  const trends = stateData.yearly_trends.filter(
    (t: any) => !isNaN(t.white) && !isNaN(t.black)
  ) as any[];

  return (
    <Section id="trend">
      <h2 className="text-3xl font-bold md:text-4xl">Trends Over Time</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Are things getting better? Track how search rates have changed year by year.
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
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
            <Line type="monotone" dataKey="white" stroke="#94a3b8" name="White" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="black" stroke="#f43f5e" name="Black" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="hispanic" stroke="#f59e0b" name="Hispanic" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
}
