import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multi-Agent Safety | EuroSafeAI',
  description:
    'Research on testing LLM cooperation and safety in multi-agent simulation settings, including game-theoretic benchmarking and social dilemma experiments.',
}

/* ── Research data ─────────────────────────────────────────────── */

const highlighted = [
  {
    title: 'GT-HarmBench: Benchmarking AI Safety Risks Through the Lens of Game Theory',
    description:
      'We map AI safety risks from the MIT AI Risk Repository to 6 canonical 2×2 games (Prisoner\'s Dilemma, Chicken, Stag Hunt, Battle of the Sexes, Coordination, No Conflict), generating 2,009 high-stakes scenarios. Evaluating 15 LLMs, we reveal wide variation in cooperative safety: Claude 4.5 Opus leads with a 0.85 weighted average while Grok 4.1 Fast scores 0.35. We identify systematic biases including a "game theory anchoring effect" and show that mechanism design—especially a Trusted Mediator—can steer agents toward safer outcomes (+0.18).',
    venue: 'Preprint 2026',
    paperUrl: 'https://arxiv.org/abs/2602.12316',
  },
  {
    title: 'Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents',
    description:
      'We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs facing a Tragedy of the Commons. Agents play as villagers sharing a finite resource (fish, pasture, or river) across monthly rounds of acting, discussing, and reflecting. We find that most models fail to achieve sustainable equilibrium, with the highest survival rate below 54%. Agents leveraging moral reasoning achieve significantly better sustainability.',
    venue: 'NeurIPS 2024',
    paperUrl: 'https://arxiv.org/abs/2404.16698',
    blogSlug: 'cooperate-or-collapse',
  },
]

const researchAgenda = [
  {
    title: 'MoralSim',
    description: 'How do LLMs tradeoff payoff and moral values when facing other agents in strategic settings?',
  },
  {
    title: 'SanctSim',
    description: 'Do LLMs prefer sanctioning institutes or not? Studying whether agents adopt punishment mechanisms to sustain cooperation.',
  },
  {
    title: 'GovSim-Elect / AgentElect',
    description: 'A simulation of elections in multi-agent LLM societies — examining how AI agents vote, campaign, and coordinate in democratic processes.',
  },
  {
    title: 'Agent-to-Agent Theory of Mind',
    description: 'Do LLMs adapt towards each other and what are the opportunities and risks? Assessing how agents model one another\'s intentions and update their strategies.',
  },
  {
    title: 'CoopEval',
    description: 'Benchmarking cooperation-sustaining mechanisms and LLM agents in social dilemmas — translating game-theoretic mechanisms to real evaluation settings.',
  },
]

/* ── Page ─────────────────────────────────────────────────────────── */

export default function MultiAgentSafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-slate-50 py-16 lg:py-24">
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
              As AI agents increasingly interact with each other, the real world, and humans, single-agent safety evaluations are no longer sufficient. We study what happens when groups of LLMs face collective action problems, zero-sum competitions, and public goods games.
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

        {/* ── Highlighted Research ── */}
        <section className="bg-gray-50 py-16 lg:py-20">
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
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full">
                    <div className="h-1.5 w-full bg-primary-700" />
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition-colors active:scale-95"
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
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Research Agenda ── */}
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Research Agenda</h2>
              </div>
              <p className="text-gray-600 mb-10 max-w-2xl">
                Our work series on testing cooperation in multi-agent LLM systems — from benchmarking emergent behavior to designing alignment mechanisms.
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {researchAgenda.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                          Multi-Agent Safety
                        </span>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                          Coming Soon
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
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
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        Zhijing Jin
                      </a>
                      <p className="text-sm text-gray-500">Founder &amp; Head, Jinesis AI Lab</p>
                      <a href="mailto:zjin.admin@cs.toronto.edu" className="text-sm text-primary-600 hover:underline">
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
                        className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        Punya Syon Pandey
                      </a>
                      <p className="text-sm text-gray-500">Lab Assistant</p>
                      <a href="mailto:ppandey@cs.toronto.edu" className="text-sm text-primary-600 hover:underline">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  Bluesky
                </a>
                <a
                  href="https://x.com/ZhijingJin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  X / Twitter
                </a>
                <a
                  href="https://youtube.com/@Zhijing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  YouTube
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <ScrollReveal>
          <section className="bg-primary-700 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Explore Our Research
              </h2>
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
