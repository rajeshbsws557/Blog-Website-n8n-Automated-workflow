import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search Articles",
  description: "Search through our collection of AI and technology articles.",
  alternates: {
    canonical: "https://dailydeveloperinsights.tech/search",
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /></div>}>
      <SearchClient />
    </Suspense>
  );
}
