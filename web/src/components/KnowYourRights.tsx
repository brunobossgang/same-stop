"use client";

import { motion } from "framer-motion";
import Section from "./Section";

const rights = [
  {
    icon: "🤐",
    title: "Right to Remain Silent",
    desc: "You must provide your license, registration, and insurance. Beyond that, you have the right to remain silent. You can say: \"I choose to remain silent.\"",
  },
  {
    icon: "🚫",
    title: "Right to Refuse a Search",
    desc: "If an officer asks to search your car, you can refuse. Say clearly: \"I do not consent to a search.\" They may search anyway if they have probable cause, but your refusal protects you legally.",
  },
  {
    icon: "📱",
    title: "Right to Record",
    desc: "You have the right to record police interactions in all 50 states. Keep your phone visible and don't interfere with the officer's duties.",
  },
  {
    icon: "🚗",
    title: "Stay Calm, Stay Safe",
    desc: "Keep your hands visible. Don't reach for anything until asked. Turn on your interior light at night. Your safety comes first — assert your rights calmly.",
  },
  {
    icon: "📝",
    title: "Document Everything",
    desc: "Note the officer's name, badge number, patrol car number, and agency. Write down what happened as soon as possible. File a complaint if your rights were violated.",
  },
  {
    icon: "⚖️",
    title: "Right to a Lawyer",
    desc: "If arrested, say: \"I want to speak to a lawyer.\" Do not sign anything or make decisions without legal counsel.",
  },
];

export default function KnowYourRights() {
  return (
    <Section id="rights">
      <h2 className="text-3xl font-bold md:text-4xl">Know Your Rights</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Knowledge is protection. Here&apos;s what every driver should know when
        pulled over.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rights.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 hover:border-rose-500/20 transition-colors"
          >
            <div className="text-2xl mb-3">{r.icon}</div>
            <h3 className="text-base font-bold text-white/90">{r.title}</h3>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="https://www.aclu.org/know-your-rights/stopped-by-police"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-sm text-white/80 hover:text-white transition-colors"
        >
          Full Guide from the ACLU →
        </a>
      </div>
    </Section>
  );
}
