import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAMEFORGE — Learn. Strategize. Dominate.",
  description:
    "Discover gaming strategies, builds, counters and community guides for PC, mobile and console games.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
