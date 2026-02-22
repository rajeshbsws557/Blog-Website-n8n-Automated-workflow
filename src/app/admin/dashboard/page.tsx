import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getDashboardData } from "../actions";
import { AnalyticsDashboardClient } from "@/components/admin/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
};

export default async function AnalyticsDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const data = await getDashboardData();

  return <AnalyticsDashboardClient data={data} />;
}
