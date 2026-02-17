import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Justice Index | Same Stop, Different Outcome — Racial Disparities in Traffic Stops",
  description:
    "Analysis of 8.6 million traffic stops across 18 states reveals Black drivers searched up to 5× more often with lower hit rates.",
  metadataBase: new URL("https://samestopdifferentoutcome.org"),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Bruno Beckman" }],
  openGraph: {
    title: "Same Stop, Different Outcome: Racial Profiling in Traffic Stops",
    description:
      "Analysis of 8.6 million traffic stops across 18 states reveals Black drivers searched up to 5× more often with lower hit rates.",
    url: "https://samestopdifferentoutcome.org",
    type: "article",
    publishedTime: "2026-02-16T00:00:00Z",
    authors: ["Bruno Beckman"],
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
      "Black drivers searched at up to 5.1× the rate of White drivers. 8.2M stops, 17 states, Stanford Open Policing data.",
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: "Same Stop, Different Outcome: Racial Profiling in Traffic Stops",
                description:
                  "Analysis of 8.6 million traffic stops across 18 states reveals Black drivers searched up to 5× more often with lower hit rates.",
                author: { "@type": "Person", name: "Bruno Beckman" },
                datePublished: "2026-02-16",
                publisher: { "@type": "Organization", name: "Justice Index", url: "https://justice-index.org" },
                mainEntityOfPage: "https://samestopdifferentoutcome.org",
                image: "https://samestopdifferentoutcome.org/og.png",
              },
              {
                "@context": "https://schema.org",
                "@type": "Dataset",
                name: "Traffic Stops from Stanford Open Policing Project",
                description: "8,634,798 traffic stops from the Stanford Open Policing Project across 18 states.",
                url: "https://samestopdifferentoutcome.org",
                creator: { "@type": "Person", name: "Bruno Beckman" },
              },
            ]),
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
