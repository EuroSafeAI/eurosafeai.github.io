import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import Image from 'next/image'
import Link from 'next/link'

function InfoCard({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3 font-jost">
        {label}
      </p>
      <h3 className="text-xl font-bold text-gray-900 leading-snug mb-4">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed font-jost">
        {description}
      </p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-slate-50 via-primary-50/50 to-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left Content — staggered CSS animations (Server Component safe) */}
              <div>
                <p
                  className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-4 font-jost motion-safe:animate-fade-in"
                  style={{ animationDelay: '0ms' }}
                >
                  AI Safety Research
                </p>
                <h1
                  className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 motion-safe:animate-fade-slide-up"
                  style={{ animationDelay: '60ms' }}
                >
                  Pioneering
                  <br />
                  <span className="text-primary-600">Multi-Agent Safety</span>
                </h1>
                <p
                  className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-8 max-w-lg font-jost motion-safe:animate-fade-slide-up"
                  style={{ animationDelay: '180ms' }}
                >
                  Advancing AI safety through rigorous research, threat assessment, and mitigation strategies that prioritize safeguarding humanity.
                </p>
                <div
                  className="flex flex-wrap gap-4 motion-safe:animate-fade-slide-up"
                  style={{ animationDelay: '300ms' }}
                >
                  <Link
                    href="/research"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 active:scale-95"
                  >
                    Our Research
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/team"
                    className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors duration-200 active:scale-95"
                  >
                    Meet Our Team
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Image — gentle float (float animation also fades in at 0→1 via keyframe start) */}
              <div
                className="relative hidden lg:block motion-safe:animate-float"
              >
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  <div className="absolute inset-4 bg-primary-100 rounded-2xl transform rotate-3" />
                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden aspect-square">
                    <Image
                      src="/images/research-1.png"
                      alt="AI Safety Research"
                      fill
                      className="object-contain p-6"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission & About Cards ───────────────────────────────────── */}
        <section className="bg-gray-50 py-10 lg:py-12">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard
                  label="Our Mission"
                  title="AI systems are rapidly becoming central to economic infrastructure and high-stakes decision-making."
                  description="As multi-agent AI systems interact in markets, supply chains, and critical services, they create complex emergent dynamics that are difficult to predict or control. Our research focuses on identifying and mitigating these systemic risks to ensure AI deployment remains safe and aligned with human values as these systems scale."
                />
                <InfoCard
                  label="About Us"
                  title="EuroSafeAI focuses on research in the areas of AI safety, security, and multi-agent systems."
                  description="We advance AI safety and security by developing risk assessments and mitigation strategies. We target scenarios where AI systems may act contrary to developer intent. We value curiosity, ethics, and a proactive, responsible mindset."
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Research Focus Section ─────────────────────────────────── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3 font-jost">
                  Research Focus
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Three Pillars
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-4 font-jost">
                  We focus on critical areas of AI safety to ensure advanced systems remain beneficial and aligned with human values.
                </p>
                <Link
                  href="/research"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm font-jost"
                >
                  View our research
                  <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              <ScrollReveal delay={0}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Preventing AI Misuse</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-jost">
                    Keeping models from helping people do harm, even when prompted. Developing robust safeguards against malicious use.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Agent Safety</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-jost">
                    Ensuring groups of agents can safely interact with the real world and each other without unintended consequences.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Link href="/democracy-defense" className="block h-full">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Democracy Defense</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-jost">
                      Studying how AI systems can impact current models of government and developing protective measures.
                    </p>
                    <span className="mt-3 inline-flex items-center text-sm text-purple-600 font-medium">
                      Learn more
                      <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Collaborators Section ───────────────────────────────────────── */}
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3 font-jost">
                  Collaborations
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Collaborators
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto font-jost">
                  We collaborate with leading research labs, governments, and foundations
                  to advance AI safety on a global scale.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto items-stretch">
                {[
                  {
                    name: 'Google DeepMind',
                    href: 'https://deepmind.google/',
                    logo: '/images/partners/google-deepmind.svg',
                    width: 200,
                    height: 36,
                  },
                  {
                    name: 'Schmidt Sciences',
                    href: 'https://www.schmidtsciences.org/',
                    logo: '/images/partners/schmidt-sciences.png',
                    width: 200,
                    height: 84,
                  },
                  {
                    name: 'UK AI Safety Institute',
                    href: 'https://www.aisi.gov.uk/',
                    logo: '/images/partners/uk-aisi.svg',
                    width: 200,
                    height: 28,
                  },
                  {
                    name: 'University of Michigan',
                    href: 'https://umich.edu/',
                    logo: '/images/partners/university-of-michigan.png',
                    width: 200,
                    height: 80,
                  },
                ].map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-8 py-10 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain w-auto mx-auto"
                    />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="bg-primary-600 py-16 lg:py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join Our Mission
              </h2>
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto font-jost">
                We&apos;re looking for talented researchers and professionals who are passionate about ensuring AI benefits humanity.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/careers"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors duration-200 active:scale-95"
                >
                  View Open Positions
                  <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="mailto:eurosafeai.zurich@gmail.com"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200"
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
