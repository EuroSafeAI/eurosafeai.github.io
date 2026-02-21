import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Democracy Defense | EuroSafeAI',
  description:
    'Research on detecting democracy-threatening tendencies of AI and Large Language Models.',
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function DemocracyDefensePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-slate-50 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p
              className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-4 font-jost motion-safe:animate-fade-in"
              style={{ animationDelay: '0ms' }}
            >
              Research Line
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '60ms' }}
            >
              Democracy Defense
            </h1>
            <p
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-4 font-jost motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '180ms' }}
            >
              Research on detecting democracy-threatening tendencies of AI and Large Language Models (LLMs).
            </p>
            <p
              className="text-gray-600 max-w-2xl mx-auto font-jost motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              Democracy Defense is a research line within EuroSafeAI, advancing rigorous, public-interest evaluations of AI systems in democratic contexts.
            </p>
            <div
              className="mt-8 flex flex-wrap justify-center gap-4 motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '420ms' }}
            >
              <Link
                href="/research"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors active:scale-95"
              >
                View All Research
                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured Video ── */}
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Video</h2>
                <p className="text-gray-600 font-jost">AI, Safety, and Democratic Resilience</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="max-w-3xl mx-auto">
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ aspectRatio: '16 / 9' }}>
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/NpGpq1WKcuI"
                    title="AI, Safety, and Democratic Resilience"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600 text-center font-jost">
                  A concise overview connecting AI safety, platform accountability, and information integrity.
                  Highlights practical approaches for evaluating model risks and building civic-minded safeguards.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Media Contact ── */}
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Media Contact</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <a href="https://zhijing-jin.com/home/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <Image
                        src="/images/team/zhijing-jin.png"
                        alt="Zhijing Jin"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                      />
                    </a>
                    <div>
                      <a
                        href="https://zhijing-jin.com/home/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                      >
                        Zhijing Jin
                      </a>
                      <p className="text-sm text-gray-500">Founder &amp; Head, Jinesis AI Lab</p>
                      <a href="mailto:zjin.admin@cs.toronto.edu" className="text-sm text-purple-600 hover:underline">
                        zjin.admin@cs.toronto.edu
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <a href="https://vesaterra.github.io/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <Image
                        src="/images/team/punya-pandey.png"
                        alt="Punya Syon Pandey"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                      />
                    </a>
                    <div>
                      <a
                        href="https://vesaterra.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                      >
                        Punya Syon Pandey
                      </a>
                      <p className="text-sm text-gray-500">Lab Assistant</p>
                      <a href="mailto:ppandey@cs.toronto.edu" className="text-sm text-purple-600 hover:underline">
                        ppandey@cs.toronto.edu
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a
                  href="https://bsky.app/profile/zhijingjin.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  Bluesky
                </a>
                <a
                  href="https://x.com/ZhijingJin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  X / Twitter
                </a>
                <a
                  href="https://youtube.com/@Zhijing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  YouTube
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <ScrollReveal>
          <section className="bg-purple-600 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Explore Our Research
              </h2>
              <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto font-jost">
                View all our publications across AI safety, multi-agent systems, and democracy defense.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/research"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors active:scale-95"
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
