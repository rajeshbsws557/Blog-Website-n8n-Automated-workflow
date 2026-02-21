import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the API key
    const apiKey = request.headers.get("x-n8n-api-key");
    const expectedKey = process.env.N8N_API_SECRET;

    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing API key" },
        { status: 401 }
      );
    }

    // 2. Parse the request body
    const body = await request.json();
    const { title, slug, metaDescription, markdownContent, imageUrl } = body;

    // 3. Validate required fields
    if (!title || !slug || !markdownContent) {
      return NextResponse.json(
        {
          error: "Bad Request: title, slug, and markdownContent are required",
          received: { title: !!title, slug: !!slug, markdownContent: !!markdownContent },
        },
        { status: 400 }
      );
    }

    // 4. Initialize Supabase admin client (bypasses RLS)
    const supabase = createAdminClient();

    // 5. Handle duplicate slugs — check if slug exists, append nanoid if so
    let finalSlug = slug;
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingPost) {
      finalSlug = `${slug}-${nanoid(6)}`;
    }

    // 6. Insert the post
    const { data: newPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        title,
        slug: finalSlug,
        meta_description: metaDescription || null,
        content_markdown: markdownContent,
        image_url: imageUrl || null,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Database error", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        post: {
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          published_at: newPost.published_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Return method not allowed for non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
