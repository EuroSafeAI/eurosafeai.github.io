import React from 'react'

function ResourcesEvents() {
  const resources = [
    {
      title: "Events",
      description: "Upcoming symposiums and general meetings.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    // {
    //   title: "Service Level Agreements",
    //   description: "How we work with partners.",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    //     </svg>
    //   )
    // },
    // {
    //   title: "Grants & Subsidies",
    //   description: "Information for researchers.",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    //     </svg>
    //   )
    // }
  ]

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Latest from EuroSafeAI
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed about our activities, partnerships, and opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-blue-600 mb-4">
                {resource.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {resource.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResourcesEvents

