import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getAllSlugs } from '@/lib/blog'

/* ── Research data ────────────────────────────────────────────────── */

interface ResearchItem {
  title: string
  description: string
  category: string
  categoryColor: string        // tailwind bg color for the badge
  categoryTextColor: string    // tailwind text color for the badge
  venue?: string
  date: string
  paperUrl?: string
  blogSlug?: string
  comingSoon?: boolean
}

const highlighted: ResearchItem[] = [
  {
    title: 'Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents',
    description:
      'We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs. We find that most models fail to achieve sustainable equilibrium, with the highest survival rate below 54%. Agents leveraging moral reasoning achieve significantly better sustainability.',
    category: 'Democracy Defense',
    categoryColor: 'bg-purple-100',
    categoryTextColor: 'text-purple-700',
    venue: 'NeurIPS 2024',
    date: '2024-04-25',
    paperUrl: 'https://arxiv.org/abs/2404.16698',
    blogSlug: 'cooperate-or-collapse',
  },
  {
    title: 'Accidental Misalignment: Fine-Tuning Language Models Induces Unexpected Vulnerability',
    description:
      'We investigate how characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability. Our findings motivate more rigorous dataset curation as a proactive safety measure.',
    category: 'Safety',
    categoryColor: 'bg-red-100',
    categoryTextColor: 'text-red-700',
    venue: 'IASEAI 2026',
    date: '2025-05-22',
    paperUrl: 'https://arxiv.org/abs/2505.16789',
    blogSlug: 'accidental-misalignment',
  },
]

const otherResearch: ResearchItem[] = [
  {
    title: 'Multi-Agent Safety in Autonomous Systems',
    description:
      'Investigating safety guarantees and failure modes when multiple AI agents interact in shared environments, with a focus on emergent risks that arise from agent-to-agent dynamics.',
    category: 'Multi-Agent Safety',
    categoryColor: 'bg-primary-100',
    categoryTextColor: 'text-primary-700',
    date: '2025',
    comingSoon: true,
  },
]

/* ── Components ───────────────────────────────────────────────────── */

const existingBlogSlugs = new Set(getAllSlugs())

function HighlightedCard({ item }: { item: ResearchItem }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Category stripe */}
      <div className="h-1.5 w-full bg-primary-700" />

      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Badge row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${item.categoryColor} ${item.categoryTextColor}`}
          >
            {item.category}
          </span>
          {item.venue && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {item.venue}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6 flex-1">{item.description}</p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          {item.paperUrl && (
            <a
              href={item.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Paper
            </a>
          )}
          {item.blogSlug && existingBlogSlugs.has(item.blogSlug) && (
            <Link
              href={`/blog/${item.blogSlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-primary-700 text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Blog post
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function OtherResearchRow({ item }: { item: ResearchItem }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Left content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${item.categoryColor} ${item.categoryTextColor}`}
          >
            {item.category}
          </span>
          {item.venue && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {item.venue}
            </span>
          )}
          {item.comingSoon && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              Coming Soon
            </span>
          )}
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {item.paperUrl && (
          <a
            href={item.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Paper
          </a>
        )}
        {item.blogSlug && existingBlogSlugs.has(item.blogSlug) && (
          <Link
            href={`/blog/${item.blogSlug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-primary-700 text-primary-700 hover:bg-primary-50 transition-colors"
          >
            Blog post
          </Link>
        )}
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function Research() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary-700 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Research
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl">
              Our technical research focuses on developing methods to ensure that
              AI systems act safely and cooperatively, even in multi-agent
              settings and under adversarial conditions.
            </p>
          </div>
        </section>

        {/* Highlighted Research */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Highlighted Research</h2>
            </div>
            {/* <p className="text-gray-600 mb-10 max-w-2xl">
              Our most impactful work on AI safety, multi-agent cooperation, and the defense of democratic institutions.
            </p> */}

            <div className="grid md:grid-cols-2 gap-8">
              {highlighted.map((item) => (
                <HighlightedCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Other Research */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Other Research</h2>
            </div>
            <p className="text-gray-600 mb-10 max-w-2xl">
              Ongoing and forthcoming work across our research directions.
            </p>

            <div className="space-y-4">
              {otherResearch.map((item) => (
                <OtherResearchRow key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-700 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Interested in Collaborating?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              We actively collaborate with academic and industry partners on AI
              safety research. Get in touch to explore opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:eurosafeai.zurich@gmail.com"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                Contact Us
                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
