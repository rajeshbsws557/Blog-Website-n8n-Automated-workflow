import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "New Post",
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <PostEditor mode="create" />
    </div>
  );
}
