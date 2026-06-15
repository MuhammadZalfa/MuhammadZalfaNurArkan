import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogForm } from "../../blog-form"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Artikel: {post.title}</h1>
      <BlogForm post={post} />
    </div>
  )
}
