import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0d229e] via-[#1a3bc7] to-[#0099ff] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image src="/images/footer-bg.png" alt="" fill className="object-cover" />
          </div>
          <div className="container-max px-6 py-24 md:py-32 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                We're Hiring
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Join Our Mission
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Help us advance AI safety and security. We're looking for talented
                individuals who are passionate about ensuring AI benefits humanity.
              </p>
            </div>
          </div>
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="#f9fafb"
              />
            </svg>
          </div>
        </section>

        {/* About Section */}
        <section className="section-padding bg-gray-50 -mt-1">
          <div className="container-max">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm font-semibold text-[#0099ff] uppercase tracking-wider mb-4">
                  About Us
                </h2>
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  Why Work With Astral Research?
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Astral Research is a Swiss nonprofit focused on safety and security for
                  advanced AI systems with emphasis on threat assessment and mitigation.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  We target scenarios where AI systems may act contrary to developer intent.
                  We actively collaborate with industry partners including DeepMind and
                  Anthropic, valuing curiosity, ethics, and a proactive, responsible mindset
                  in team members.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-[#0d229e]/10 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-[#0d229e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Impact</h4>
                    <p className="text-sm text-gray-600">Work on problems that matter for humanity</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-[#0099ff]/10 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-[#0099ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Expert Team</h4>
                    <p className="text-sm text-gray-600">Collaborate with leading researchers</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/research-3.png"
                    alt="Our team collaborating"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-semibold text-[#0099ff] uppercase tracking-wider mb-4">
                Open Positions
              </h2>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Current Opportunities
              </h3>
              <p className="text-lg text-gray-600">
                Join our team and contribute to ensuring AI systems remain safe and beneficial.
              </p>
            </div>

            {/* Job Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-hover">
                <div className="p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">
                        Communications Manager
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Part-Time
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          20-40 hours/week
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          Toronto (Onsite)
                        </span>
                      </div>
                    </div>
                    <a
                      href="mailto:eurosafeai.zurich@gmail.com?subject=Communications Manager Application"
                      className="btn-primary !py-3 !px-6 text-sm"
                    >
                      Apply Now
                    </a>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#0099ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Requirements
                      </h5>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d229e] mt-2 flex-shrink-0" />
                          Marketing expertise with strong communication skills
                        </li>
                        <li className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d229e] mt-2 flex-shrink-0" />
                          Computer science knowledge or technical background
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#0099ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Responsibilities
                      </h5>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d229e] mt-2 flex-shrink-0" />
                          Managing research announcements and publications
                        </li>
                        <li className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d229e] mt-2 flex-shrink-0" />
                          Social media strategy and content creation
                        </li>
                        <li className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d229e] mt-2 flex-shrink-0" />
                          Newsletter development and distribution
                        </li>
                        <li className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d229e] mt-2 flex-shrink-0" />
                          Team coordination and internal communications
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    To apply, send your CV and a brief statement to{' '}
                    <a
                      href="mailto:eurosafeai.zurich@gmail.com?subject=Communications Manager Application"
                      className="text-[#0099ff] font-medium hover:underline"
                    >
                      eurosafeai.zurich@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* General Application Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0d229e]/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#0d229e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Don't See a Perfect Fit?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We're always interested in hearing from talented individuals who are passionate
                about AI safety. Send us your information and we'll keep you in mind for future
                opportunities.
              </p>
              <a
                href="mailto:eurosafeai.zurich@gmail.com?subject=General Application"
                className="btn-primary"
              >
                Send General Application
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-semibold text-[#0099ff] uppercase tracking-wider mb-4">
                Our Values
              </h2>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                What We Look For
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Curiosity</h4>
                <p className="text-gray-600">
                  A deep desire to understand complex systems and push the boundaries of AI safety research.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d229e] to-[#0099ff] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Ethics</h4>
                <p className="text-gray-600">
                  A strong commitment to ethical principles and responsible AI development practices.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Proactive Mindset</h4>
                <p className="text-gray-600">
                  Initiative to identify and address potential risks before they become problems.
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
