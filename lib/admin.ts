"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Project, BlogPost } from "@/lib/types"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) throw new Error("Unauthorized")

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) throw new Error("Forbidden")

  return supabase
}

export async function createProject(formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await checkAdmin()

    const payload: Partial<Project> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      image_url: formData.get("image_url") as string || null,
      category: formData.get("category") as string,
      tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
      live_url: formData.get("live_url") as string || null,
      repo_url: formData.get("repo_url") as string || null,
      is_featured: formData.get("is_featured") === "on",
    }

    const { error } = await supabase.from("projects").insert(payload)
    if (error) return { error: error.message }

    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function updateProject(id: string, formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await checkAdmin()

    const payload: Partial<Project> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      image_url: formData.get("image_url") as string || null,
      category: formData.get("category") as string,
      tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
      live_url: formData.get("live_url") as string || null,
      repo_url: formData.get("repo_url") as string || null,
      is_featured: formData.get("is_featured") === "on",
    }

    const { error } = await supabase.from("projects").update(payload).eq("id", id)
    if (error) return { error: error.message }

    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await checkAdmin()
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) return { error: error.message }

    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function createBlogPost(formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await checkAdmin()

    const payload: Partial<BlogPost> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string || null,
      image_url: formData.get("image_url") as string || null,
      tags: JSON.parse((formData.get("tags") as string) || "[]"),
      published_at: formData.get("published_at") as string || null,
    }

    const { error } = await supabase.from("blog_posts").insert(payload)
    if (error) return { error: error.message }

    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<{ error?: string }> {
  try {
    const supabase = await checkAdmin()

    const payload: Partial<BlogPost> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string || null,
      image_url: formData.get("image_url") as string || null,
      tags: JSON.parse((formData.get("tags") as string) || "[]"),
      published_at: formData.get("published_at") as string || null,
    }

    const { error } = await supabase.from("blog_posts").update(payload).eq("id", id)
    if (error) return { error: error.message }

    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function deleteBlogPost(id: string): Promise<{ error?: string }> {
  try {
    const supabase = await checkAdmin()
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)
    if (error) return { error: error.message }

    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await checkAdmin()

    const file = formData.get("file") as File
    if (!file) return { error: "No file provided" }

    const ext = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file)

    if (uploadError) return { error: uploadError.message }

    const { data: { publicUrl } } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" }
  }
}
