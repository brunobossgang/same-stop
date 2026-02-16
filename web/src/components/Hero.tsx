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

// Average Black/White search rate ratio across states
const avgRatio = (() => {
  const states = data.summary.states;
  let sum = 0;
  for (const state of states) {
    const b = data.search_rates.black.find(s => s.state === state)?.rate ?? 0;
    const w = data.search_rates.white.find(s => s.state === state)?.rate ?? 0;
    if (w > 0) sum += b / w;
  }
  return sum / states.length;
})();

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
          72 Million Traffic Stops Exposed
        </p>

        <h1 className="text-5xl font-extrabold leading-tight md:text-7xl lg:text-8xl">
          Same Stop.
          <br />
          <span className="text-rose-500">Different Outcome.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-white/60 md:text-xl">
          Black drivers are searched at
        </p>

        <div className="mt-6 text-6xl font-black text-rose-500 md:text-8xl">
          <AnimatedCounter target={avgRatio} suffix="×" />
        </div>

        <p className="mt-4 text-lg text-white/50">
          the rate of White drivers — yet contraband is found less often
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <div>
            <span className="block text-2xl font-bold text-white/80">
              {(data.summary.total_stops / 1_000_000).toFixed(0)}M
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
              2000–2018
            </span>
            time span
          </div>
        </div>

        <LiveTicker />

        <motion.div
          className="mt-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#search" className="text-white/30 text-3xl">↓</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
