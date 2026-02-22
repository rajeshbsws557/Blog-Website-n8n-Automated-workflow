import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboardClient posts={posts || []} />;
}
