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

/* ── Research data ─────────────────────────────────────────────── */

const highlighted = [
  {
    title: 'Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents',
    description:
      'We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs. We find that most models fail to achieve sustainable equilibrium, with the highest survival rate below 54%. Agents leveraging moral reasoning achieve significantly better sustainability.',
    venue: 'NeurIPS 2024',
    paperUrl: 'https://arxiv.org/abs/2404.16698',
    blogSlug: 'cooperate-or-collapse',
  },
  {
    title: 'SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests',
    description:
      'We propose SocialHarmBench, the first comprehensive benchmark to evaluate the vulnerability of LLMs to socially harmful goals with 78,836 prompts from 47 democratic countries collected from 16 genres and 11 domains. From experiments on 15 cutting-edge LLMs, many safety risks are uncovered.',
    paperUrl: 'https://arxiv.org/abs/2510.04891',
    blogSlug: 'socialharmbench-llm-vulnerabilities',
    imageUrl: '/images/democracy-defense/social-harm.jpg',
  },
  {
    title: 'Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models',
    description:
      'We propose a novel methodology to assess LLM alignment on the democracy–authoritarianism spectrum, combining psychometric tools, a new favorability metric, and role-model probing. We find that LLMs generally favor democratic values but exhibit increased favorability toward authoritarian figures when prompted in Mandarin.',
    paperUrl: 'https://arxiv.org/abs/2506.12758',
    blogSlug: 'democratic-or-authoritarian-bias-in-llms',
    imageUrl: '/images/democracy-defense/authoritarian.jpg',
  },
]

const otherResearch = [
  {
    title: 'Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing',
    description:
      'We explore multiple directions to investigate hidden mechanisms behind content moderation: training classifiers to reverse-engineer decisions across countries, and explaining moderation decisions by analyzing Shapley values and LLM-guided explanations.',
    paperUrl: 'https://arxiv.org/abs/2503.05280',
    blogSlug: 'cross-country-content-moderation-nlp',
    imageUrl: '/images/democracy-defense/ccmoderation.png',
  },
]

const workInProgress = [
  {
    title: 'Defending against LLM Propaganda: Detecting Historical Revisionism by Large Language Models',
    description:
      'We introduce HistoricalMisinfo, a curated dataset of 500 historically contested events from 45 countries, each paired with factual and revisionist narratives. Evaluating responses from multiple LLMs, we observe vulnerabilities and systematic variation in revisionism across models, countries, and prompt types.',
    blogSlug: 'preserving-historical-truth-revisionism-llms',
    imageUrl: '/images/democracy-defense/historical_misinfo.jpg',
  },
  {
    title: 'When Do Language Models Endorse Limitations on Universal Human Rights Principles?',
    description:
      'We evaluate how LLMs navigate trade-offs involving the Universal Declaration of Human Rights, leveraging 1,152 synthetically generated scenarios across 24 rights articles in eight languages. Analysis of eleven major LLMs reveals systematic biases in rights endorsement patterns.',
    blogSlug: 'llms-udhr-human-rights-evaluation',
    imageUrl: '/images/democracy-defense/hr_pic.png',
  },
]

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

        {/* ── Research ── */}
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Highlighted Research</h2>
              </div>
            </ScrollReveal>

            {/* Highlighted papers */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {highlighted.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={600}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="h-1.5 w-full bg-purple-600" />
                    )}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      {item.venue && (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 self-start mb-3">
                          {item.venue}
                        </span>
                      )}
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6 flex-1">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-auto">
                        {item.paperUrl && (
                          <a
                            href={item.paperUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Paper
                          </a>
                        )}
                        {item.blogSlug && (
                          <Link
                            href={`/blog/${item.blogSlug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors active:scale-95"
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
                </ScrollReveal>
              ))}
            </div>

            {/* Other Research */}
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Other Research</h2>
              </div>
              <p className="text-gray-600 mb-6 max-w-2xl">Additional published work in this research direction.</p>
            </ScrollReveal>
            <div className="space-y-4 mb-16">
              {otherResearch.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover w-full sm:w-28 h-20 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {item.paperUrl && (
                        <a
                          href={item.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                          Paper
                        </a>
                      )}
                      {item.blogSlug && (
                        <Link
                          href={`/blog/${item.blogSlug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          Blog post
                        </Link>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Work in Progress */}
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Work in Progress</h2>
              </div>
              <p className="text-gray-600 mb-6 max-w-2xl">Ongoing and forthcoming work in this research direction.</p>
            </ScrollReveal>
            <div className="space-y-4">
              {workInProgress.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover w-full sm:w-28 h-20 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700 mb-2">
                        Coming Soon
                      </span>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {item.blogSlug && (
                        <Link
                          href={`/blog/${item.blogSlug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          Blog post
                        </Link>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Media Contact ── */}
        <section className="bg-gray-50 py-16 lg:py-20">
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
