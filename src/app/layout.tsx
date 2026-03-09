import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdSenseScript } from "@/components/AdSenseScript";
import { CookieConsent } from "@/components/CookieConsent";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Verification - Insert your verification code below */}
        {/* <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Navbar />
          <AnalyticsTracker />
          {/* Google AdSense - Replace with your publisher ID */}
          <AdSenseScript publisherId="ca-pub-XXXXXXXXXXXXXXXX" />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* GDPR-compliant cookie consent for AdSense */}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
