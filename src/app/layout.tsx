import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://dailydeveloperinsights.tech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Daily Developer Insights — AI & IT Technology Blog",
    template: "%s | Daily Developer Insights",
  },
  description:
    "Cutting-edge insights on Artificial Intelligence, Machine Learning, and emerging IT technologies.",
  keywords: [
    "AI",
    "machine learning",
    "technology",
    "IT",
    "blog",
    "deep learning",
    "software engineering",
    "cloud computing",
    "DevOps",
    "web development",
  ],
  authors: [{ name: "Daily Developer Insights" }],
  creator: "Daily Developer Insights",
  publisher: "Daily Developer Insights",
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Daily Developer Insights",
    title: "Daily Developer Insights — AI & IT Technology Blog",
    description:
      "Cutting-edge insights on Artificial Intelligence, Machine Learning, and emerging IT technologies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Developer Insights — AI & IT Technology Blog",
    description:
      "Cutting-edge insights on Artificial Intelligence, Machine Learning, and emerging IT technologies.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
