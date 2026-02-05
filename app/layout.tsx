import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mobility Tracker",
  description: "Playful mobility habit tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header style={{ background: "linear-gradient(135deg, rgba(10,15,27,0.8) 0%, rgba(15,24,36,0.8) 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", backdropFilter: "blur(10px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, maxWidth: 1400, margin: "0 auto" }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>🏃‍♀️ Mobility</h1>
            <nav style={{ display: "flex", gap: 20, marginLeft: "auto", fontSize: 14 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                Home
              </Link>
              <Link href="/history" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                History
              </Link>
              <Link href="/content" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                Content
              </Link>
              <Link href="/login" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
