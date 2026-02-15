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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      <div className="pt-8 pb-5 px-5 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-700 flex-shrink-0 relative mb-4 ring-2 ring-gray-100">
          {member.image ? (
            <Image src={member.image} alt={member.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
              {getInitials(member.name)}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
        <p className="text-primary-600 text-sm font-medium mb-2">{member.role}</p>
        {member.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
        )}
      </div>
    </div>
  )
}

function StaffCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col items-center text-center py-5 px-4">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative mb-3 ring-2 ring-gray-100">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
    </div>
  )
}

export default function Team() {
  const board: TeamMember[] = [
    { name: 'Zhijing Jin', role: 'Chief Scientist', image: '/images/team/zhijing-jin.png' },
    { name: 'Angelo Huang', role: 'Co-founder and Director', image: '/images/team/angelo-huang.png' },
    { name: 'Pepijn Cobben', role: 'Co-founder and Director',
         image: '/images/team/pepijn-cobben.png' },
    { name: 'Terry J. C. Zhang', role: 'Co-founder and Director',
         image: '/images/team/terry-zhang.png' },
  ]

  const advisors: TeamMember[] = [
    // { name: 'Prof. Bernhard Schölkopf', role: 'Director, Max Planck Institute for Intelligent Systems', image: '/images/team/bernhard-scholkopf.png' },
    // { name: 'Prof. Mrinmaya Sachan', role: 'Assistant Professor, ETH Zürich', image: '/images/team/mrimaya-sachan.png' },
    { name: 'Prof. Roger Grosse', role: 'Associate Professor, University of Toronto', image: '/images/team/roger-grosse.png' },
    // { name: 'Prof. Rada Mihalcea', role: 'Head of AI Lab, UMich', image: '/images/team/rada-mihalcea.png' },
    // { name: 'Prof. Mona Diab', role: 'Professor, Head of CMU LTI', image: '/images/team/mona-diab.png' },
  ]

  const technicalStaff: TeamMember[] = [
    { name: 'Samuel Simko', role: 'Senior Research Scientist', 
        image: '/images/team/samuel-simko.png' },
    { name: 'David Guzman', role: 'Senior Research Scientist', 
        image: '/images/team/david-guzman.png' },
    { name: 'Yongjin Yang', role: 'PhD Student', image: '/images/team/yongjin-yang.png' },
    { name: 'Rohan Subramani', role: 'PhD Student', image: '/images/team/rohan-subramani.png' },
    { name: 'Ryan Faulkner', role: 'PhD Student & Deepmind', image: '/images/team/ryan-faulkner.jpg' },
    { name: 'Andrei Muresanu', role: 'PhD Student', image: '/images/team/andrei-muresanu.jpg' },
    { name: 'Yahang Qi', role: 'PhD Student', image: '/images/team/yahang-qi.png' },
    { name: 'Furkan Danisman', role: 'PhD Student', image: '/images/team/furkan-danisman.png' },
    { name: 'Abir Harrasse', role: 'Research Assistant', image: '/images/team/abir-harrasse.jpeg' },
    { name: 'Keenan Samway', role: 'Research Assistant', image: '/images/team/keenan-samway.png' },
    { name: 'Changling Li', role: "Master's Student", image: '/images/team/changling-li.png' },
    { name: 'Jiarui Liu', role: "Master's Student", image: '/images/team/jiarui-liu.jpg' },
    { name: 'Vishal Verma', role: "Master's Student", image: '/images/team/vishal-verma.jpg' },
    { name: 'Irene Strauss', role: "Master's Student", image: '/images/team/irene-strauss.png' },
    { name: 'Sawal Acharya', role: "Master's Student", image: '/images/team/sawal-acharya.jpg' },
    { name: 'Punya Syon Pandey', role: "Bachelor's Student", image: '/images/team/punya-pandey.png' },
    { name: 'Joeun Yook', role: "Bachelor's Student", image: '/images/team/joeun-yook.png' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary-700 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl">
              Experts in AI safety and strategic research, dedicated to advancing AI safety through innovative research.
            </p>
          </div>
        </section>

        {/* Board */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Executive Team</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {board.map((member) => <LeadershipCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>


        {/* Technical Staff */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Technical Staff</h2>
            </div>
            <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {technicalStaff.map((member) => <StaffCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>


        {/* Advisors */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Advisors</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advisors.map((member) => <LeadershipCard key={member.name} member={member} />)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-700 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to Join Our Team?</h2>
            <p className="text-lg text-primary-100 mb-8">
              We're always looking for talented individuals passionate about AI safety.
            </p>
            <a href="/careers" className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors">
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
