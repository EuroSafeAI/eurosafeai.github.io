import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  description?: string
  image?: string
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

function LeadershipCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="h-32 bg-blue-700 relative flex items-center justify-center">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
        <p className="text-blue-600 text-sm font-medium mb-2">{member.role}</p>
        {member.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
        )}
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm font-bold">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{member.name}</h3>
        <p className="text-gray-500 text-sm">{member.role}</p>
      </div>
    </div>
  )
}

function ResearchCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4">
      <div className="w-14 h-14 rounded-lg bg-blue-100 flex-shrink-0 overflow-hidden relative">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-700 font-bold">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{member.name}</h3>
        <p className="text-blue-600 text-sm font-medium mb-1">{member.role}</p>
        {member.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
        )}
      </div>
    </div>
  )
}

export default function Team() {
  const leadership: TeamMember[] = [
    {
      name: 'Zhijing Jin',
      role: 'Co-founder and Director',
      description: 'Focus on risk analysis and alignment verification for advanced AI systems. Doctorate in computer science from ETH Zurich.',
      image: '/images/team/zhijing-jin.png',
    },
    {
      name: 'Angelo Huang',
      role: 'Co-founder and Director',
      description: 'Committed to non-profit integrity and governance standards. Expertise in AI safety and strategic research.',
      image: '/images/team/angelo-huang.png',
    },
    {
      name: 'Pepijn Cobben',
      role: 'Co-founder and Director',
      description: 'Dedicated to advancing AI safety through innovative research and organizational stewardship.',
      image: '/images/team/pepijn-cobben.png',
    },
    {
      name: 'Terry Jingchen Zhang',
      role: 'Co-founder and Director',
      description: 'Leading efforts in AI governance and safety standards with rigorous research methodology.',
      image: '/images/team/terry-zhang.png',
    },
  ]

  const researchStaff: TeamMember[] = [
    {
      name: 'Samuel Simko',
      role: 'Senior Research Scientist',
      description: 'Specialization in adversarial machine learning and evaluation protocols.',
      image: '/images/team/samuel-simko.png',
    },
    {
      name: 'David Guzman',
      role: 'Research Scientist',
      description: 'Focus on strategic deception detection in LLMs and malign agent behavior monitoring.',
      image: '/images/team/david-guzman.png',
    },
  ]

  const phdStudents: TeamMember[] = [
    { name: 'Yongjin Yang', role: 'PhD Student', image: '/images/team/yongjin-yang.png' },
    { name: 'Rohan Subramani', role: 'PhD Student', image: '/images/team/rohan-subramani.png' },
    { name: 'Ryan Faulkner', role: 'PhD Student & Deepmind', image: '/images/team/ryan-faulkner.jpg' },
    { name: 'Andrei Muresanu', role: 'PhD Student', image: '/images/team/andrei-muresanu.jpg' },
    { name: 'Yahang Qi', role: 'PhD Student', image: '/images/team/yahang-qi.png' },
    { name: 'Furkan Danisman', role: 'PhD Student', image: '/images/team/furkan-danisman.png' },
  ]

  const researchAssistants: TeamMember[] = [
    { name: 'Abir Harrasse', role: 'Research Assistant', image: '/images/team/abir-harrasse.jpeg' },
    { name: 'Keenan Samway', role: 'Research Assistant', image: '/images/team/keenan-samway.png' },
  ]

  const mastersStudents: TeamMember[] = [
    { name: 'Changling Li', role: "Master's Student", image: '/images/team/changling-li.png' },
    { name: 'Jiarui Liu', role: "Master's Student", image: '/images/team/jiarui-liu.jpg' },
    { name: 'Vishal Verma', role: "Master's Student", image: '/images/team/vishal-verma.jpg' },
    { name: 'Irene Strauss', role: "Master's Student", image: '/images/team/irene-strauss.png' },
    { name: 'Sawal Acharya', role: "Master's Student", image: '/images/team/sawal-acharya.jpg' },
  ]

  const bachelorsStudents: TeamMember[] = [
    { name: 'Punya Syon Pandey', role: "Bachelor's Student", image: '/images/team/punya-pandey.png' },
    { name: 'Joeun Yook', role: "Bachelor's Student", image: '/images/team/joeun-yook.png' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-blue-700 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Experts in AI safety and strategic research, dedicated to advancing AI safety through innovative research.
            </p>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Leadership</h2>
                <p className="text-gray-600 text-sm">Co-founders and Directors</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((member) => <LeadershipCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* Research Staff */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Research Staff</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {researchStaff.map((member) => <ResearchCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* PhD Students */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">PhD Students</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phdStudents.map((member) => <MemberCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* Research Assistants */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Research Assistants</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchAssistants.map((member) => <MemberCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* Master's Students */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Master's Students</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mastersStudents.map((member) => <MemberCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* Bachelor's Students */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Bachelor's Students</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bachelorsStudents.map((member) => <MemberCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to Join Our Team?</h2>
            <p className="text-lg text-blue-100 mb-8">
              We're always looking for talented individuals passionate about AI safety.
            </p>
            <a href="/careers" className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              View Open Positions
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
