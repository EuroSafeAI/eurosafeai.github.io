import React from 'react'

function Solution() {
  const cards = [
    {
      title: "Deep Technical Research",
      description: "Philosophy isn't enough. We fund and conduct technical research into interpretability, robustness, and control mechanisms.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Standards & Governance",
      description: "Establishing the standard for deployment. If it's not safe, it doesn't ship. We define the red lines that cannot be crossed.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Uncorrupted by Profit",
      description: "We are a non-profit. We answer to the common good, not shareholders. Our independence is our superpower.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-void">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-display font-extrabold text-center mb-16 fade-in-up">
          Our Mandate
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-charcoal border border-electric-cyan/20 p-8 hover:border-electric-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-electric-cyan/20 fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-electric-cyan mb-6">
                {card.icon}
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed font-light">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solution

