import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Edit Post",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <PostEditor mode="edit" initialData={post} />
    </div>
  );
}
