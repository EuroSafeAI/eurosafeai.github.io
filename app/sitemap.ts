import type { MetadataRoute } from 'next'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'

export const dynamic = 'force-static'

const BASE_URL = 'https://eurosafe.ai.toronto.edu'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/research`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/democracy-defense`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/multi-agent-safety`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const blogSlugs = getAllSlugs()
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => {
    const post = getPostBySlug(slug)
    return {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: post?.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...blogPages]
}
