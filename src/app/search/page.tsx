import type { Metadata } from "next";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search Articles",
  description: "Search through our collection of AI and technology articles.",
};

export default function SearchPage() {
  return <SearchClient />;
}
