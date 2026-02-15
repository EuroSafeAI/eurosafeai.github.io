import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  authors: string[]
  venue?: string
  category?: string
  paperUrl?: string
  featured?: boolean
  summary?: string
  content: string
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    authors: data.authors ?? [],
    venue: data.venue,
    category: data.category,
    paperUrl: data.paperUrl,
    featured: data.featured ?? false,
    summary: data.summary,
    content,
  }
}

export function getAllPosts(): BlogPost[] {
  return getAllSlugs()
    .map(getPostBySlug)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}
