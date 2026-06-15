export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image_url: string | null
  category: string
  tech_stack: string[]
  live_url: string | null
  repo_url: string | null
  is_featured: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar_url: string | null
  message: string
  rating: number
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  tags: string[]
  published_at: string | null
  created_at: string
}
