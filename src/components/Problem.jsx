import React from 'react'

function Problem() {
  return (
    <section className="relative py-32 px-6 bg-black text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 className="text-4xl md:text-6xl font-display font-extrabold text-center fade-in-up">
          The Alignment Gap
        </h2>

        <div className="space-y-8 text-xl md:text-2xl leading-relaxed font-light fade-in-up" style={{ animationDelay: '0.2s' }}>
          <blockquote className="border-l-4 border-signal-orange pl-8 italic text-gray-300">
            "We are building gods. But we don't know how to pray to them."
          </blockquote>

          <div className="space-y-6 text-gray-400">
            <p>
              The capabilities of intelligent systems are compounding exponentially. 
              Our understanding of their safety is moving linearly. This gap represents 
              an existential risk.
            </p>
            <p className="text-white font-normal">
              We are not a think tank. We are a firewall.
            </p>
            <p>
              EuroSafeAI is the independent scientific body dedicated to ensuring the 
              transition to superintelligence doesn't leave humanity behind.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Problem

