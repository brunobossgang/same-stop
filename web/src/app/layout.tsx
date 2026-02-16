import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Justice Index | Same Stop, Different Outcome — Racial Disparities in Traffic Stops",
  description:
    "72 million traffic stops expose stark racial disparities in police searches. Black and Hispanic drivers are searched up to 2× more often — but contraband is found less frequently.",
  openGraph: {
    title: "Justice Index | Same Stop, Different Outcome",
    description:
      "Black and Hispanic drivers are searched up to 2× more often than White drivers, yet contraband is found less frequently. 72M+ stops. The data speaks.",
    url: "https://samestopdifferentoutcome.org",
    type: "website",
    images: [
      {
        url: "https://samestopdifferentoutcome.org/og.png",
        width: 1200,
        height: 630,
        alt: "Same Stop, Different Outcome — 5.1× higher search rate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Same Stop, Different Outcome | Justice Index",
    description:
      "Black drivers searched at up to 5.1× the rate of White drivers. 7.9M stops, 16 states, Stanford Open Policing data.",
    images: ["https://samestopdifferentoutcome.org/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
