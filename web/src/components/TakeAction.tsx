"use client";

import { useState } from "react";
import Section from "./Section";

const SHARE_URL = "https://samestopdifferentoutcome.org";
const SHARE_TEXT = "Black drivers are searched 2× more often than White drivers — but contraband is found LESS often. The data is clear.";

const orgs = [
  { name: "ACLU", url: "https://www.aclu.org/issues/racial-justice" },
  { name: "NAACP Legal Defense Fund", url: "https://www.naacpldf.org" },
  { name: "Vera Institute", url: "https://www.vera.org" },
  { name: "Campaign Zero", url: "https://campaignzero.org" },
];

export default function TakeAction() {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    { name: "𝕏", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}` },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}` },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}` },
    { name: "TikTok", url: "https://www.tiktok.com" },
    { name: "Instagram", url: "https://www.instagram.com" },
    { name: "Snapchat", url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(SHARE_URL)}` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="act" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">Take Action</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Data alone doesn&apos;t create change. Share this evidence, contact your representatives,
        and support organizations fighting for reform.
      </p>

      {/* Share */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Share This</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
          >
            {copied ? "Copied! ✓" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Contact Senator */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Contact Your Senator</h3>
        <a
          href="https://www.senate.gov/senators/senators-contact.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block px-6 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-white font-semibold transition-colors"
        >
          Find Your Senator →
        </a>
      </div>

      {/* Organizations */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Support These Organizations</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {orgs.map((org) => (
            <a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:border-rose-500/30 transition-colors"
            >
              <span className="text-white/90 font-medium">{org.name}</span>
              <span className="text-white/30 ml-auto">→</span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
