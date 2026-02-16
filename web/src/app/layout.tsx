import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Same Stop. Different Outcome. | Racial Disparities in Traffic Stops",
  description:
    "72 million traffic stops expose stark racial disparities in police searches. Black drivers are searched 2× more often — but contraband is found less frequently.",
  openGraph: {
    title: "Same Stop. Different Outcome.",
    description:
      "Black drivers are searched 2× more often than White drivers, yet contraband is found less frequently. 72M stops. 4 states. The data speaks.",
    url: "https://samestopdifferentoutcome.org",
    type: "website",
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
