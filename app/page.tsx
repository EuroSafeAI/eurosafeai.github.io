import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

function InfoCard({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
        {label}
      </p>
      <h3 className="text-xl font-bold text-gray-900 leading-snug mb-4">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-50 via-primary-50/50 to-white">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Pioneering
                  <br />
                  <span className="text-primary-600">Multi-Agent Safety</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                  Advancing AI safety through rigorous research, threat assessment, and mitigation strategies that prioritize safeguarding humanity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/team"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Meet Our Team
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/research"
                    className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Our Research
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative hidden lg:block">
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

        {/* Mission & About Cards */}
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard
                label="Our Mission"
                title="AI systems will soon be integrated into large parts of the economy and our personal lives."
                description="While this transformation may unlock substantial benefits, there are also vast risks. We believe some of the greatest risks stem from multi-agent systems that interact in complex, unpredictable ways. Our goal is to understand and evaluate these risks well enough to prevent the possible harms that unsafe AI systems might cause."
              />
              <InfoCard
                label="About Us"
                title="We focus on research in the areas of AI safety, security, and multi-agent systems."
                description="We advance AI safety and security by developing risk assessments and mitigation strategies. We target scenarios where AI systems may act contrary to developer intent, and actively collaborate with industry partners including DeepMind and Anthropic. We value curiosity, ethics, and a proactive, responsible mindset."
              />
            </div>
          </div>
        </section>

        {/* Research Focus Section */}
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
                Research Focus
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Three Pillars
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                We focus on critical areas of AI safety to ensure advanced systems remain beneficial and aligned with human values.
              </p>
              <Link
                href="/research"
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm"
              >
                View our research
                <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Preventing AI Misuse
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Keeping models from helping people do harm, even when prompted. Developing robust safeguards against malicious use.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Multi-Agent Safety
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ensuring groups of agents can safely interact with the real world and each other without unintended consequences.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Defense of Democracy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Studying how AI systems can impact current models of government and developing protective measures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              We're looking for talented researchers and professionals who are passionate about ensuring AI benefits humanity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                View Open Positions
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
      </main>

      <Footer />
    </div>
  )
}
