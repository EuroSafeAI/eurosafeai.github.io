import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import Image from 'next/image'
import Link from 'next/link'
import { getAllSlugs } from '@/lib/blog'

/* ── Research data ────────────────────────────────────────────────── */

interface ResearchItem {
  title: string
  description: string
  category: string
  categoryColor: string
  categoryTextColor: string
  venue?: string
  date: string
  paperUrl?: string
  blogSlug?: string
  comingSoon?: boolean
  imageUrl?: string
}

const highlighted: ResearchItem[] = [
  {
    title: 'GT-HarmBench: Benchmarking AI Safety Risks Through the Lens of Game Theory',
    description:
      'Frontier AI systems are increasingly capable and deployed in high-stakes multi-agent environments. However, existing AI safety benchmarks largely evaluate single agents, leaving multi-agent risks such as coordination failure and conflict poorly understood. We introduce GT-HarmBench, a benchmark of 2,009 high-stakes scenarios spanning game-theoretic structures such as the Prisoner\'s Dilemma, Stag Hunt and Chicken. Scenarios are drawn from realistic AI risk contexts in the MIT AI Risk Repository. Across 15 frontier models, agents choose socially beneficial actions in only 62% of cases',
    category: 'Multi-Agent Safety',
    categoryColor: 'bg-primary-100',
    categoryTextColor: 'text-primary-700',
    venue: 'Preprint 2026',
    date: '2026-02-01',
    paperUrl: 'https://arxiv.org/abs/2602.12316',
  },
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
  {
    title: 'SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests',
    description:
      'We propose SocialHarmBench, the first comprehensive benchmark to evaluate the vulnerability of LLMs to socially harmful goals with 78,836 prompts from 47 democratic countries collected from 16 genres and 11 domains. From experiments on 15 cutting-edge LLMs, many safety risks are uncovered.',
    category: 'Democracy Defense',
    categoryColor: 'bg-purple-100',
    categoryTextColor: 'text-purple-700',
    date: '2025',
    paperUrl: 'https://arxiv.org/abs/2510.04891',
    imageUrl: '/images/democracy-defense/social-harm.jpg',
    blogSlug: 'socialharmbench-llm-vulnerabilities',
  },
  {
    title: 'Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models',
    description:
      'We propose a novel methodology to assess LLM alignment on the democracy\u2013authoritarianism spectrum, combining psychometric tools, a new favorability metric, and role-model probing. We find that LLMs generally favor democratic values but exhibit increased favorability toward authoritarian figures when prompted in Mandarin.',
    category: 'Democracy Defense',
    categoryColor: 'bg-purple-100',
    categoryTextColor: 'text-purple-700',
    date: '2025',
    paperUrl: 'https://arxiv.org/abs/2506.12758',
    imageUrl: '/images/democracy-defense/authoritarian.jpg',
    blogSlug: 'democratic-or-authoritarian-bias-in-llms',
  },
]

const otherResearch: ResearchItem[] = [
  {
    title: 'Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing',
    description:
      'We explore multiple directions to investigate hidden mechanisms behind content moderation: training classifiers to reverse-engineer decisions across countries, and explaining moderation decisions by analyzing Shapley values and LLM-guided explanations.',
    category: 'Democracy Defense',
    categoryColor: 'bg-purple-100',
    categoryTextColor: 'text-purple-700',
    date: '2025',
    paperUrl: 'https://arxiv.org/abs/2503.05280',
    imageUrl: '/images/democracy-defense/ccmoderation.png',
    blogSlug: 'cross-country-content-moderation-nlp',
  },
  {
    title: 'Socio-Political Risks of AI',
    description:
      'A report examining how AI systems can amplify or reshape socio-political risks, and outlining governance and technical approaches to mitigate these harms.',
    category: 'Societal Impact',
    categoryColor: 'bg-blue-100',
    categoryTextColor: 'text-blue-700',
    date: '2025',
    paperUrl: '/sociopolitical-risks-of-ai.pdf',
  },
]

const workInProgress: ResearchItem[] = [
  {
    title: 'Defending against LLM Propaganda: Detecting Historical Revisionism by Large Language Models',
    description:
      'We introduce HistoricalMisinfo, a curated dataset of 500 historically contested events from 45 countries, each paired with factual and revisionist narratives. Evaluating responses from multiple LLMs, we observe vulnerabilities and systematic variation in revisionism across models, countries, and prompt types.',
    category: 'Democracy Defense',
    categoryColor: 'bg-purple-100',
    categoryTextColor: 'text-purple-700',
    date: '2025',
    comingSoon: true,
    imageUrl: '/images/democracy-defense/historical_misinfo.jpg',
    blogSlug: 'preserving-historical-truth-revisionism-llms',
  },
  {
    title: 'When Do Language Models Endorse Limitations on Universal Human Rights Principles?',
    description:
      'We evaluate how LLMs navigate trade-offs involving the Universal Declaration of Human Rights, leveraging 1,152 synthetically generated scenarios across 24 rights articles in eight languages. Analysis of eleven major LLMs reveals systematic biases in rights endorsement patterns.',
    category: 'Democracy Defense',
    categoryColor: 'bg-purple-100',
    categoryTextColor: 'text-purple-700',
    date: '2025',
    comingSoon: true,
    imageUrl: '/images/democracy-defense/hr_pic.png',
    blogSlug: 'llms-udhr-human-rights-evaluation',
  },
]

const mediaCoverage = [
  {
    source: 'WIRED',
    year: '2025',
    title: 'AI Social Media Users Are Not Always a Totally Dumb Idea',
    url: 'https://www.wired.com/story/ai-social-media-users-are-not-always-a-totally-dumb-idea/',
  },
  {
    source: 'AXRP Podcast',
    year: '2024',
    title: 'Zhijing Jin on LLMs, Causality, and Multi-Agent Systems',
    url: 'https://www.youtube.com/watch?v=4K-lHz2_QGg',
  },
  {
    source: 'The AI Purity Podcast',
    year: '2024',
    title: 'Zhijing Jin on Socially Responsible NLP: Education, Causal NLP, and AI Text',
    url: 'https://www.youtube.com/watch?v=SOhhxniom_w',
  },
]

/* ── Components ───────────────────────────────────────────────────── */

const existingBlogSlugs = new Set(getAllSlugs())

function HighlightedCard({ item }: { item: ResearchItem }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={600}
          height={200}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="h-1.5 w-full bg-primary-700" />
      )}

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.categoryColor} ${item.categoryTextColor}`}>
            {item.category}
          </span>
          {item.venue && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {item.venue}
            </span>
          )}
        </div>

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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition-colors active:scale-95"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-primary-700 text-primary-700 hover:bg-primary-50 transition-colors active:scale-95"
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
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.categoryColor} ${item.categoryTextColor}`}>
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
        {/* ── Hero — CSS animations, no JS needed ── */}
        <section className="bg-primary-700 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <p
              className="text-xs font-semibold text-primary-200 uppercase tracking-widest mb-4 motion-safe:animate-fade-in"
              style={{ animationDelay: '0ms' }}
            >
              EuroSafeAI Lab
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '60ms' }}
            >
              Our Research
            </h1>
            <p
              className="text-xl text-primary-100 max-w-3xl motion-safe:animate-fade-slide-up"
              style={{ animationDelay: '180ms' }}
            >
              Our technical research focuses on developing methods to ensure that
              AI systems act safely and cooperatively, even in multi-agent
              settings and under adversarial conditions.
            </p>
          </div>
        </section>

        {/* ── Highlighted Research ── */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Highlighted Research</h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {highlighted.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <HighlightedCard item={item} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Other Research ── */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Other Research</h2>
              </div>
              <p className="text-gray-600 mb-10 max-w-2xl">
                Additional published work across our research directions.
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {otherResearch.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <OtherResearchRow item={item} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Work in Progress ── */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Work in Progress</h2>
              </div>
              <p className="text-gray-600 mb-10 max-w-2xl">
                Ongoing and forthcoming work across our research directions.
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {workInProgress.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <OtherResearchRow item={item} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Media Coverage ── */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Media Coverage</h2>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {mediaCoverage.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5"
                  >
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {item.source}, {item.year}
                    </span>
                    <p className="mt-2 text-gray-900 font-medium">&ldquo;{item.title}&rdquo;</p>
                    <span className="mt-2 inline-flex items-center text-sm text-primary-700 font-medium">
                      Read more
                      <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <ScrollReveal>
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
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors active:scale-95"
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
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  )
}
