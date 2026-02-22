import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Let the login page render without the shell
  // The shell only wraps authenticated pages
  if (!user) {
    return <>{children}</>;
  }

  return (
    <AdminShell userEmail={user.email || ""}>{children}</AdminShell>
  );
}
