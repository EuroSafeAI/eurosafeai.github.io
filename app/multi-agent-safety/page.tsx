import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import MediaContact from '@/components/MediaContact'
import Link from 'next/link'
import { Metadata } from 'next'
import { getPapersByCategory } from '@/lib/papers'

export const metadata: Metadata = {
  title: 'Multi-Agent Safety | EuroSafeAI',
  description:
    'Research on testing LLM cooperation and safety in multi-agent simulation settings, including game-theoretic benchmarking and social dilemma experiments.',
}

export default function MultiAgentSafetyPage() {
  const papers = getPapersByCategory('multi-agent-safety')

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="from-primary-50 via-white to-slate-50 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p
              className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-4 font-jost motion-safe:animate-fade-in"
              style={{ animationDelay: '0ms' }}
            >
              Research Line
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '60ms' }}
            >
              Multi-Agent AI Safety
            </h1>
            <p
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-4 font-jost motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '180ms' }}
            >
              Testing LLM cooperation and safety in multi-agent simulation settings — from game-theoretic benchmarks to society-scale social dilemmas.
            </p>
            <p
              className="text-gray-600 max-w-2xl mx-auto font-jost motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              As AI agents increasingly interact with each other, the real world, and humans, single-agent safety evaluations are no longer sufficient. We study emergent risks in collective action problems, zero-sum competitions, and public goods games.
            </p>
            <div
              className="mt-8 flex flex-wrap justify-center gap-4 motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '420ms' }}
            >
              <Link
                href="/research"
                className="inline-flex items-center px-6 py-3 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors active:scale-95"
              >
                View All Research
                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Research ── */}
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Research</h2>
              </div>
              <p className="text-gray-600 mb-8 max-w-2xl">
                Published work and ongoing research agenda on testing cooperation in multi-agent LLM systems.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-xl bg-white p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {papers.map((paper) => (
                    <article
                      key={paper.slug}
                      className="group rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-all hover:-translate-y-0.5 bg-gray-50 flex flex-col"
                    >
                      {paper.venue ? (
                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">{paper.venue}</div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded border border-amber-400/50 text-amber-700 px-2 py-0.5 text-[11px] self-start mb-2">
                          Coming soon
                        </div>
                      )}

                      <h3 className="text-base font-semibold text-gray-900 group-hover:underline underline-offset-4 leading-snug mb-2">
                        {paper.paperUrl ? (
                          <a href={paper.paperUrl} target="_blank" rel="noopener noreferrer">
                            {paper.title}
                          </a>
                        ) : paper.blogSlug ? (
                          <Link href={`/blog/${paper.blogSlug}`}>{paper.title}</Link>
                        ) : (
                          paper.title
                        )}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 flex-1">{paper.summary}</p>

                      {paper.authors.length > 0 && (
                        <p className="mt-3 text-xs text-gray-500">{paper.authors.join(', ')}</p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {paper.paperUrl ? (
                          <a
                            href={paper.paperUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-xs items-center gap-1 rounded border border-primary-300 text-primary-700 px-2 py-1 hover:bg-primary-50 transition-colors"
                          >
                            Read paper <span aria-hidden>↗</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-red-400/40 text-red-600 px-2 py-1 text-[11px]">
                            Paper coming soon
                          </span>
                        )}
                        {paper.blogSlug && (
                          <Link
                            href={`/blog/${paper.blogSlug}`}
                            className="inline-flex text-xs items-center gap-1 rounded border border-gray-200 text-gray-600 px-2 py-1 hover:bg-white transition-colors"
                          >
                            Blog post
                          </Link>
                        )}
                      </div>

                      {paper.tags && paper.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {paper.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Media Contact ── */}
        <MediaContact color="primary" />

        {/* ── CTA ── */}
        <ScrollReveal>
          <section className="bg-primary-700 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Explore Our Research</h2>
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto font-jost">
                View all our publications across AI safety, multi-agent systems, and democracy defense.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/research"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors active:scale-95"
                >
                  All Research
                  <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="mailto:eurosafeai.zurich@gmail.com"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  )
}
