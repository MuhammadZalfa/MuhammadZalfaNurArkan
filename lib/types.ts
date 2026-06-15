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

export interface Experience {
  id: string
  title: string
  company: string | null
  location: string | null
  start_date: string
  end_date: string | null
  current: boolean
  description: string | null
  tech_stack: string[]
  created_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_year: number
  end_year: number | null
  current: boolean
  description: string | null
  created_at: string
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
