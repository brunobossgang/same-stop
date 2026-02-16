"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import data from "@/data/precomputed";

type RegModel = {
  n: number;
  pseudo_r2: number;
  black_or?: number;
  black_ci?: [number, number];
  black_p?: number;
  hispanic_or?: number;
  hispanic_ci?: [number, number];
  hispanic_p?: number;
};

type StateRegression = {
  search_model?: RegModel;
  arrest_model?: RegModel;
  hit_rate_model?: RegModel;
};

const regression = (data as any).regression as Record<string, StateRegression>;

const states = Object.keys(regression).sort();

function sig(p?: number) {
  if (p === undefined) return "";
  if (p < 0.001) return "★★★";
  if (p < 0.01) return "★★";
  if (p < 0.05) return "★";
  return "n.s.";
}

function ORCard({
  label,
  or_val,
  ci,
  p,
  color,
  invertNote,
}: {
  label: string;
  or_val?: number;
  ci?: [number, number];
  p?: number;
  color: string;
  invertNote?: boolean;
}) {
  if (!or_val) return null;
  const isSignificant = p !== undefined && p < 0.05;
  const displayOR = or_val;
  const direction = invertNote
    ? displayOR < 1
      ? "lower"
      : "higher"
    : displayOR > 1
    ? "more likely"
    : "less likely";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-800/50 border border-white/5 rounded-xl p-5"
    >
      <p className="text-xs uppercase tracking-wider text-white/40 mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {displayOR.toFixed(2)}×
      </p>
      {ci && (
        <p className="text-xs text-white/30 mt-1">
          95% CI: [{ci[0].toFixed(2)}, {ci[1].toFixed(2)}]
        </p>
      )}
      <p className="text-sm text-white/50 mt-2">
        {direction}{" "}
        <span className={`text-xs ${isSignificant ? "text-emerald-400" : "text-white/30"}`}>
          {sig(p)} {isSignificant ? "p < 0.05" : "not significant"}
        </span>
      </p>
    </motion.div>
  );
}

function BarRow({
  state,
  blackOR,
  hispanicOR,
  isSelected,
  onClick,
}: {
  state: string;
  blackOR: number;
  hispanicOR: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const maxOR = 6;
  const bw = Math.min((blackOR / maxOR) * 100, 100);
  const hw = Math.min((hispanicOR / maxOR) * 100, 100);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
        isSelected ? "bg-slate-700/50" : "hover:bg-slate-800/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/50 w-28 shrink-0 truncate">{state}</span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="h-3 rounded-sm bg-rose-500/80"
              style={{ width: `${bw}%` }}
            />
            <span className="text-[10px] text-white/40">{blackOR.toFixed(1)}×</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 rounded-sm bg-amber-500/80"
              style={{ width: `${hw}%` }}
            />
            <span className="text-[10px] text-white/40">{hispanicOR.toFixed(1)}×</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Regression() {
  const [selected, setSelected] = useState(states[0]);

  const stateData = regression[selected];

  const searchStates = useMemo(
    () =>
      states.filter(
        (s) => regression[s].search_model?.black_or && regression[s].search_model?.hispanic_or
      ),
    []
  );

  return (
    <Section id="controlled">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold md:text-4xl">
          After Controlling for{" "}
          <span className="text-rose-400">Everything Else</span>
        </h2>
        <p className="mt-4 text-white/50 max-w-2xl">
          Raw search rates could be explained by age, sex, stop type, or location.
          Logistic regression controls for all of these — and the disparity{" "}
          <span className="text-white/80 font-medium">persists</span>. Odds ratios
          above 1.0 mean higher likelihood compared to white drivers.
        </p>
      </motion.div>

      {/* State selector */}
      <div className="mt-8 flex flex-wrap gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-rose-500/50"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* OR Cards for selected state */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stateData?.search_model && (
          <>
            <ORCard
              label="Black drivers — search likelihood"
              or_val={stateData.search_model.black_or}
              ci={stateData.search_model.black_ci}
              p={stateData.search_model.black_p}
              color="text-rose-400"
            />
            <ORCard
              label="Hispanic drivers — search likelihood"
              or_val={stateData.search_model.hispanic_or}
              ci={stateData.search_model.hispanic_ci}
              p={stateData.search_model.hispanic_p}
              color="text-amber-400"
            />
          </>
        )}
        {stateData?.hit_rate_model && (
          <ORCard
            label="Contraband found (among searched)"
            or_val={stateData.hit_rate_model.black_or}
            ci={stateData.hit_rate_model.black_ci}
            p={stateData.hit_rate_model.black_p}
            color="text-slate-300"
            invertNote
          />
        )}
      </div>

      {/* Arrest model if available */}
      {stateData?.arrest_model && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ORCard
            label="Black drivers — arrest likelihood"
            or_val={stateData.arrest_model.black_or}
            ci={stateData.arrest_model.black_ci}
            p={stateData.arrest_model.black_p}
            color="text-rose-400"
          />
          <ORCard
            label="Hispanic drivers — arrest likelihood"
            or_val={stateData.arrest_model.hispanic_or}
            ci={stateData.arrest_model.hispanic_ci}
            p={stateData.arrest_model.hispanic_p}
            color="text-amber-400"
          />
        </div>
      )}

      {/* Sample size & R² */}
      {stateData?.search_model && (
        <p className="mt-3 text-xs text-white/30">
          Search model: n = {stateData.search_model.n.toLocaleString()} · pseudo R² ={" "}
          {stateData.search_model.pseudo_r2.toFixed(3)}
          {stateData.arrest_model && (
            <>
              {" "}| Arrest model: n = {stateData.arrest_model.n.toLocaleString()} · pseudo R² ={" "}
              {stateData.arrest_model.pseudo_r2.toFixed(3)}
            </>
          )}
          {stateData.hit_rate_model && (
            <>
              {" "}| Hit rate model: n = {stateData.hit_rate_model.n.toLocaleString()}
            </>
          )}
        </p>
      )}

      {/* Bar chart of search ORs across all states */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h3 className="text-lg font-semibold text-white/70 mb-1">
          Search Odds Ratios Across States
        </h3>
        <p className="text-xs text-white/30 mb-4">
          <span className="inline-block w-3 h-3 bg-rose-500/80 rounded-sm mr-1 align-middle" /> Black vs White{" "}
          <span className="inline-block w-3 h-3 bg-amber-500/80 rounded-sm mr-1 ml-3 align-middle" /> Hispanic vs White
          {" "}· Dashed line = 1.0 (equal odds)
        </p>
        <div className="space-y-1 relative">
          {/* Reference line at 1.0 */}
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-white/20"
            style={{ left: `calc(7rem + ${(1 / 6) * 100}% * 0.7)` }}
          />
          {searchStates.map((s) => (
            <BarRow
              key={s}
              state={s}
              blackOR={regression[s].search_model!.black_or!}
              hispanicOR={regression[s].search_model!.hispanic_or!}
              isSelected={s === selected}
              onClick={() => setSelected(s)}
            />
          ))}
        </div>
      </motion.div>

      {/* Interpretation */}
      <div className="mt-8 bg-slate-800/30 border border-white/5 rounded-xl p-5">
        <p className="text-sm text-white/50">
          <span className="text-white/80 font-medium">How to read:</span> An odds ratio of 2.0× means
          that group is twice as likely to be searched, even after controlling for age, sex, year,
          stop type, and violation. Values below 1.0 for hit rates suggest the higher search rate
          is not justified by contraband discovery — consistent with bias.
        </p>
      </div>
    </Section>
  );
}
