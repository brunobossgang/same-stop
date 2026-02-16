"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import data from "@/data/precomputed";

// Simplified US state paths (approximate bounding boxes positioned on a grid)
// Using a grid-based cartogram for clarity
const STATE_POSITIONS: Record<string, { row: number; col: number }> = {
  "Washington": { row: 0, col: 0 }, "Montana": { row: 0, col: 2 }, "North Dakota": { row: 0, col: 4 },
  "Minnesota": { row: 0, col: 5 }, "Michigan": { row: 0, col: 7 }, "New York": { row: 0, col: 9 },
  "Vermont": { row: 0, col: 10 }, "New Hampshire": { row: 0, col: 11 }, "Massachusetts": { row: 1, col: 10 },
  "Oregon": { row: 1, col: 0 }, "Idaho": { row: 1, col: 1 }, "Wyoming": { row: 1, col: 2 },
  "South Dakota": { row: 1, col: 4 }, "Iowa": { row: 1, col: 5 }, "Wisconsin": { row: 1, col: 6 },
  "Ohio": { row: 1, col: 8 }, "Connecticut": { row: 1, col: 9 }, "Rhode Island": { row: 1, col: 11 },
  "Nevada": { row: 2, col: 0 }, "Colorado": { row: 2, col: 2 }, "Nebraska": { row: 2, col: 3 },
  "Missouri": { row: 2, col: 5 }, "Illinois": { row: 2, col: 6 }, "Indiana": { row: 2, col: 7 },
  "New Jersey": { row: 2, col: 9 }, "Maryland": { row: 2, col: 10 },
  "California": { row: 3, col: 0 }, "Arizona": { row: 3, col: 1 }, "New Mexico": { row: 3, col: 2 },
  "Kansas": { row: 3, col: 3 }, "Tennessee": { row: 3, col: 6 }, "Virginia": { row: 3, col: 8 },
  "North Carolina": { row: 3, col: 9 }, "South Carolina": { row: 4, col: 9 },
  "Texas": { row: 4, col: 3 }, "Oklahoma": { row: 4, col: 4 }, "Arkansas": { row: 4, col: 5 },
  "Mississippi": { row: 4, col: 6 }, "Georgia": { row: 4, col: 8 }, "Florida": { row: 5, col: 9 },
  "Louisiana": { row: 5, col: 5 }, "Alabama": { row: 5, col: 7 },
};

function getRatio(stateName: string): number | null {
  const st = data.by_state[stateName as keyof typeof data.by_state];
  if (!st) return null;
  const b = st.search_rates?.black;
  const w = st.search_rates?.white;
  if (!b || !w || Number(w) === 0) return null;
  return b / w;
}

function getColor(ratio: number | null): string {
  if (ratio === null) return "#1e293b"; // no data: dark gray
  if (ratio < 1.3) return "#4ade80"; // green — low disparity
  if (ratio < 1.7) return "#facc15"; // yellow
  if (ratio < 2.0) return "#fb923c"; // orange
  if (ratio < 2.5) return "#f43f5e"; // rose
  return "#dc2626"; // red — high disparity
}

export default function USMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const cellW = 60;
  const cellH = 50;
  const padding = 4;
  const rectW = cellW - padding * 2;
  const rectH = cellH - padding * 2;

  const allStates = Object.keys(STATE_POSITIONS);
  const hoveredData = hovered ? data.by_state[hovered as keyof typeof data.by_state] : null;
  const hoveredRatio = hovered ? getRatio(hovered) : null;

  return (
    <Section id="map" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">The National Picture</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Racial disparities in traffic stops aren&apos;t limited to a few bad departments.
        They&apos;re everywhere. Hover over a state to see its data.
      </p>

      <div className="mt-8 flex flex-col items-center">
        <svg
          viewBox={`0 0 ${12 * cellW} ${6 * cellH + 20}`}
          className="w-full max-w-3xl"
        >
          {allStates.map((state) => {
            const pos = STATE_POSITIONS[state];
            const ratio = getRatio(state);
            const hasData = data.by_state[state as keyof typeof data.by_state] !== undefined;
            const x = pos.col * cellW + padding;
            const y = pos.row * cellH + padding;

            return (
              <g
                key={state}
                onMouseEnter={() => setHovered(state)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: hasData ? "pointer" : "default" }}
              >
                <rect
                  x={x}
                  y={y}
                  width={rectW}
                  height={rectH}
                  rx={6}
                  fill={getColor(ratio)}
                  opacity={hasData ? (hovered === state ? 1 : 0.8) : 0.2}
                  stroke={hovered === state ? "#fff" : "transparent"}
                  strokeWidth={2}
                />
                <text
                  x={x + rectW / 2}
                  y={y + rectH / 2 - 4}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hasData ? "#fff" : "#475569"}
                  fontSize={11}
                  fontWeight="bold"
                >
                  {state.length <= 4 ? state : state.split(" ").map(w => w[0]).join("")}
                </text>
                {ratio && (
                  <text
                    x={x + rectW / 2}
                    y={y + rectH / 2 + 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={9}
                    opacity={0.7}
                  >
                    {ratio.toFixed(1)}×
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#1e293b" }} /> No data</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#4ade80" }} /> &lt;1.3×</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#facc15" }} /> 1.3–1.7×</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#fb923c" }} /> 1.7–2.0×</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#f43f5e" }} /> 2.0–2.5×</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#dc2626" }} /> &gt;2.5×</span>
          <span className="ml-2 text-white/40">Black/White search rate ratio</span>
        </div>

        {/* Hover tooltip */}
        {hovered && hoveredData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-slate-800 border border-white/10 rounded-xl p-4 text-center min-w-[200px]"
          >
            <h3 className="text-lg font-bold">{hovered}</h3>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white/90 font-bold">
                  {hoveredData.total_stops >= 1_000_000
                    ? (hoveredData.total_stops / 1_000_000).toFixed(1) + "M"
                    : (hoveredData.total_stops / 1_000).toFixed(0) + "K"}
                </div>
                <div className="text-white/40 text-xs">Stops</div>
              </div>
              <div>
                <div className="text-rose-500 font-bold">{hoveredRatio?.toFixed(1)}×</div>
                <div className="text-white/40 text-xs">B/W Ratio</div>
              </div>
              <div>
                <div className="text-white/90 font-bold">{hoveredData.date_min?.slice(0, 4)}–{hoveredData.date_max?.slice(0, 4)}</div>
                <div className="text-white/40 text-xs">Period</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
