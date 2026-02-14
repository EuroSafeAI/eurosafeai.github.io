import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  description?: string
  initials?: string
}

export default function Team() {
  const leadership: TeamMember[] = [
    {
      name: 'Zhijing Jin',
      role: 'Co-founder and Director',
      description:
        'Focus on risk analysis and alignment verification for advanced AI systems. Doctorate in computer science from ETH Zurich.',
      initials: 'ZJ',
    },
    {
      name: 'Angelo Huang',
      role: 'Co-founder and Director',
      description:
        'Committed to non-profit integrity and governance standards. Expertise in AI safety and strategic research.',
      initials: 'AH',
    },
    {
      name: 'Pepijn Cobben',
      role: 'Co-founder and Director',
      description:
        'Dedicated to advancing AI safety through innovative research and organizational stewardship.',
      initials: 'PC',
    },
    {
      name: 'Terry Jingchen Zhang',
      role: 'Co-founder and Director',
      description:
        'Leading efforts in AI governance and safety standards with rigorous research methodology.',
      initials: 'TZ',
    },
  ]

  const researchStaff: TeamMember[] = [
    {
      name: 'Samuel Simko',
      role: 'Senior Research Scientist',
      description:
        'Specialization in adversarial machine learning and evaluation protocols. Consulting experience with AI labs on alignment faking research.',
      initials: 'SS',
    },
    {
      name: 'David Guzman',
      role: 'Research Scientist',
      description:
        'Focus on strategic deception detection in LLMs and malign agent behavior monitoring. Published research on AI control.',
      initials: 'DG',
    },
  ]

  const phdStudents: TeamMember[] = [
    { name: 'Yongjin Yang', role: 'PhD Student', initials: 'YY' },
    { name: 'Rohan Subramani', role: 'PhD Student', initials: 'RS' },
    { name: 'Ryan Faulkner', role: 'PhD Student', initials: 'RF' },
    { name: 'Andrei Muresanu', role: 'PhD Student', initials: 'AM' },
    { name: 'Yahang Qi', role: 'PhD Student', initials: 'YQ' },
    { name: 'Furkan Danisman', role: 'PhD Student', initials: 'FD' },
  ]

  const researchAssistants: TeamMember[] = [
    { name: 'Abir Harrasse', role: 'Research Assistant', initials: 'AH' },
    { name: 'Keenan Samway', role: 'Research Assistant', initials: 'KS' },
  ]

  const mastersStudents: TeamMember[] = [
    { name: 'Changling Li', role: "Master's Student", initials: 'CL' },
    { name: 'Jiarui Liu', role: "Master's Student", initials: 'JL' },
    { name: 'Vishal Verma', role: "Master's Student", initials: 'VV' },
    { name: 'Irene Strauss', role: "Master's Student", initials: 'IS' },
    { name: 'Sawal Acharya', role: "Master's Student", initials: 'SA' },
  ]

  const bachelorsStudents: TeamMember[] = [
    { name: 'Punya Syon Pandey', role: "Bachelor's Student", initials: 'PP' },
    { name: 'Joeun Yook', role: "Bachelor's Student", initials: 'JY' },
  ]

  const LeadershipCard = ({ member }: { member: TeamMember }) => (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
      <div className="h-48 bg-gradient-to-br from-[#0d229e] to-[#0099ff] relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold">
          {member.initials}
        </div>
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/footer-bg.png" alt="" fill className="object-cover" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-[#0099ff] font-medium text-sm mb-4">{member.role}</p>
        {member.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
        )}
      </div>
    </div>
  )

  const ResearchCard = ({ member }: { member: TeamMember }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover flex gap-5">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0d229e] to-[#0099ff] flex-shrink-0 flex items-center justify-center text-white text-lg font-bold">
        {member.initials}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-[#0099ff] font-medium text-sm mb-3">{member.role}</p>
        {member.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
        )}
      </div>
    </div>
  )

  const SimpleCard = ({ member }: { member: TeamMember }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 card-hover flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 text-sm font-bold">
        {member.initials}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
        <p className="text-gray-500 text-sm">{member.role}</p>
      </div>
    </div>
  )

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
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Meet Our Team
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-4">
                Experts in AI safety and strategic research.
              </p>
              <p className="text-lg text-blue-200 leading-relaxed max-w-2xl">
                Our leadership team is dedicated to advancing AI safety and security
                through innovative research and organizational stewardship.
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

        {/* Leadership Team */}
        <section className="section-padding bg-gray-50 -mt-1">
          <div className="container-max">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-xl bg-[#0d229e] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Leadership</h2>
                <p className="text-gray-600">Co-founders and Directors</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((member, index) => (
                <LeadershipCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Research Staff */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0099ff] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Research Staff</h2>
                <p className="text-gray-600">
                  Expertise in machine learning, adversarial robustness, and AI governance
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {researchStaff.map((member, index) => (
                <ResearchCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* PhD Students */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">PhD Students</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phdStudents.map((member, index) => (
                <SimpleCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Research Assistants */}
        <section className="py-12 px-6 bg-white">
          <div className="container-max">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Research Assistants</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchAssistants.map((member, index) => (
                <SimpleCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Master's Students */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="container-max">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Master's Students</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mastersStudents.map((member, index) => (
                <SimpleCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Bachelor's Students */}
        <section className="py-12 px-6 bg-white">
          <div className="container-max">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Bachelor's Students</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bachelorsStudents.map((member, index) => (
                <SimpleCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="section-padding bg-gradient-to-r from-[#0d229e] to-[#0099ff]">
          <div className="container-max text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Join Our Team?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals passionate about AI safety.
            </p>
            <a
              href="/careers"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold bg-white text-[#0d229e] hover:bg-blue-50 transition-all duration-300 shadow-lg"
            >
              View Open Positions
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
