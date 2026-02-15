import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/* ── Static params for export mode ────────────────────────────────── */

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
            <Link href="/research" className="text-blue-700 hover:underline">
              Back to Research
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-blue-700 py-14 lg:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="/research"
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Research
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                  {post.category}
                </span>
              )}
              {post.venue && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-blue-100">
                  {post.venue}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-blue-100 text-sm">
              {post.authors.length > 0 && <span>{post.authors.join(', ')}</span>}
              {post.date && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Quick links bar */}
        {post.paperUrl && (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
              <a
                href={post.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read the paper on arXiv
              </a>
            </div>
          </div>
        )}

        {/* Markdown body */}
        <article className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
          <div className="prose prose-base prose-gray prose-headings:text-gray-900 prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
