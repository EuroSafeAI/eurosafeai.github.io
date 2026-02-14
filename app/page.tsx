import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/50 to-white">
          <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Swiss Nonprofit Research Organization
                </div> */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Pioneering
                  <br />
                  <span className="text-blue-700">Multi-Agent Safety</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                  Advancing AI safety through rigorous research, threat assessment, and mitigation strategies that prioritize safeguarding humanity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/team"
                    className="inline-flex items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Meet Our Team
                    <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/careers"
                    className="inline-flex items-center px-6 py-3 border-2 border-blue-700 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Join Us
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative hidden lg:block">
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  <div className="absolute inset-4 bg-blue-100 rounded-2xl transform rotate-3" />
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

        {/* About Section */}
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                  About Us
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Dedicated to AI Safety Research
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Astral Research is a nonprofit research organization registered under Swiss law. Our mission is to advance AI safety and security by developing risk assessments and mitigation strategies.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  We target scenarios where AI systems may act contrary to developer intent. We actively collaborate with industry partners including DeepMind and Anthropic, valuing curiosity, ethics, and a proactive, responsible mindset.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {['ZJ', 'AH', 'PC', 'TZ'].map((initials, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">4 Co-founders</p>
                    <p className="text-gray-500">Leading the mission</p>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/research-2.png"
                    alt="Research collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 hidden md:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Swiss Registered</p>
                    <p className="text-xs text-gray-500">Nonprofit Organization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Focus Section */}
        <section className="bg-gray-50 py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Research Focus
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Areas of Expertise
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We focus on critical areas of AI safety to ensure advanced systems remain beneficial and aligned with human values.
              </p>
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
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <section className="bg-blue-700 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              We're looking for talented researchers and professionals who are passionate about ensuring AI benefits humanity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
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
