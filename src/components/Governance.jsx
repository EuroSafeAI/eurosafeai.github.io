import React from 'react'

function Governance() {
  return (
    <section className="relative py-32 px-6 bg-void">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-electric-cyan mb-12 fade-in-up">
          SYSTEM_TRANSPARENCY
        </h2>

        <div className="space-y-6 font-mono text-sm md:text-base text-gray-400 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="border-l-2 border-electric-cyan/30 pl-6">
            <span className="text-electric-cyan">LOCATION:</span>
            <span className="text-white ml-2">Zürich, Switzerland (The Neutral Node)</span>
          </div>

          <div className="border-l-2 border-electric-cyan/30 pl-6">
            <span className="text-electric-cyan">STRUCTURE:</span>
            <span className="text-white ml-2">Democratic Verein. Decentralized oversight.</span>
          </div>

          <div className="border-l-2 border-electric-cyan/30 pl-6">
            <span className="text-electric-cyan">FINANCIALS:</span>
            <span className="text-white ml-2">100% Non-Profit. No dividends. All resources deployed for safety research.</span>
          </div>

          <div className="border-l-2 border-electric-cyan/30 pl-6">
            <span className="text-electric-cyan">DATA:</span>
            <span className="text-white ml-2">Zero-knowledge architecture where possible. Your privacy is absolute.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Governance

