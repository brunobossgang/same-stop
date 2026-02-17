"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import data from "@/data/precomputed";

function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>{value.toFixed(1)}{suffix}</span>;
}

// Average minority/White search rate ratios across states
const { avgBlackRatio, avgHispanicRatio } = (() => {
  const states = data.summary.states;
  let bSum = 0, hSum = 0, bCount = 0, hCount = 0;
  for (const state of states) {
    const b = data.search_rates.black.find(s => s.state === state)?.rate ?? 0;
    const h = data.search_rates.hispanic.find(s => s.state === state)?.rate ?? 0;
    const w = data.search_rates.white.find(s => s.state === state)?.rate ?? 0;
    if (w > 0 && b > 0) { bSum += b / w; bCount++; }
    if (w > 0 && h > 0) { hSum += h / w; hCount++; }
  }
  return {
    avgBlackRatio: bCount > 0 ? bSum / bCount : 0,
    avgHispanicRatio: hCount > 0 ? hSum / hCount : 0,
  };
})();

const worstGroup = avgHispanicRatio > avgBlackRatio ? "Hispanic" : "Black";
const worstRatio = Math.max(avgBlackRatio, avgHispanicRatio);

function LiveTicker() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // ~72M stops over ~10 years avg = ~228 stops/second
  const stopsPerSecond = 228;
  const totalStops = seconds * stopsPerSecond;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
      </span>
      <span>
        Since you opened this page, approximately{" "}
        <span className="text-rose-400 font-semibold">{totalStops.toLocaleString()}</span> traffic stops would have occurred in these states.
      </span>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-rose-400/80">
          {(data.summary.total_stops / 1_000_000).toFixed(1)} Million Traffic Stops · {data.summary.num_states} States
        </p>

        <h1 className="text-5xl font-extrabold leading-tight md:text-7xl lg:text-8xl">
          Same Stop.
          <br />
          <span className="text-rose-500">Different Outcome.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-white/60 md:text-xl">
          Black and Hispanic drivers are searched at up to
        </p>

        <div className="mt-6 text-6xl font-black text-rose-500 md:text-8xl">
          <AnimatedCounter target={worstRatio} suffix="×" />
        </div>

        <p className="mt-4 text-lg text-white/50">
          the rate of White drivers — yet contraband is found <em>less</em> often
        </p>

        <div className="mt-4 flex justify-center gap-6 text-sm text-white/40">
          <span>Black: <span className="text-rose-400 font-semibold">{avgBlackRatio.toFixed(1)}×</span></span>
          <span>Hispanic: <span className="text-amber-400 font-semibold">{avgHispanicRatio.toFixed(1)}×</span></span>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <div>
            <span className="block text-2xl font-bold text-white/80">
              {(data.summary.total_stops / 1_000_000).toFixed(1)}M
            </span>
            stops analyzed
          </div>
          <div>
            <span className="block text-2xl font-bold text-white/80">
              {data.summary.num_states}
            </span>
            states
          </div>
          <div>
            <span className="block text-2xl font-bold text-white/80">
              2000–2020
            </span>
            time span
          </div>
        </div>

        <LiveTicker />

        <div className="mt-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Black drivers are searched up to 5× more often — but contraband is found less. 8.6M traffic stops exposed. samestopdifferentoutcome.org via @Justice_Index")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-medium text-white transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X
          </a>
        </div>

        <motion.div
          className="mt-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#search" className="text-white/30 text-3xl">↓</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
