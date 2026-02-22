import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSubscribers } from "../actions";
import { SubscriberManagerClient } from "@/components/admin/SubscriberManager";

export const metadata: Metadata = {
  title: "Subscribers",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function SubscribersPage({ searchParams }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const data = await getSubscribers(currentPage, 20);

  return <SubscriberManagerClient data={data} />;
}
