import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-blue-700 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              We're Hiring
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Our Mission
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Help us advance AI safety and security. We're looking for talented individuals passionate about ensuring AI benefits humanity.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                  About Us
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Work With EuroSafeAI?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  EuroSafeAI is a Swiss nonprofit focused on safety and security for advanced AI systems with emphasis on threat assessment and mitigation.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We target scenarios where AI systems may act contrary to developer intent. We actively collaborate with industry partners including DeepMind and Anthropic.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Global Impact</h4>
                    <p className="text-xs text-gray-500">Work on problems that matter</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Expert Team</h4>
                    <p className="text-xs text-gray-500">Collaborate with leading researchers</p>
                  </div>
                </div>
              </div>
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/research-3.png"
                  alt="Our team collaborating"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Open Positions
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Current Opportunities
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our team and contribute to ensuring AI systems remain safe and beneficial.
              </p>
            </div>

            {/* Job Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Communications Manager
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Part-Time
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          20-40 hours/week
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Toronto (Onsite)
                        </span>
                      </div>
                    </div>
                    <a
                      href="mailto:eurosafeai.zurich@gmail.com?subject=Communications Manager Application"
                      className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Apply Now
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Requirements
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          Marketing expertise with strong communication skills
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          Computer science knowledge or technical background
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Responsibilities
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          Managing research announcements and publications
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          Social media strategy and content creation
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          Newsletter development and distribution
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          Team coordination and internal communications
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    To apply, send your CV to{' '}
                    <a href="mailto:eurosafeai.zurich@gmail.com" className="text-blue-600 font-medium hover:underline">
                      eurosafeai.zurich@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* General Application */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Don't See a Perfect Fit?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always interested in hearing from talented individuals passionate about AI safety.
            </p>
            <a
              href="mailto:eurosafeai.zurich@gmail.com?subject=General Application"
              className="inline-flex items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Send General Application
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                Our Values
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                What We Look For
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Curiosity</h3>
                <p className="text-gray-600 text-sm">
                  A deep desire to understand complex systems and push boundaries.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ethics</h3>
                <p className="text-gray-600 text-sm">
                  Strong commitment to ethical principles and responsible AI development.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Proactive Mindset</h3>
                <p className="text-gray-600 text-sm">
                  Initiative to identify and address potential problems before they become an issue.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
