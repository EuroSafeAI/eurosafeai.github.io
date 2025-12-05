import React from 'react'

function Footer() {
  return (
    <footer className="relative py-12 px-6 bg-black border-t border-electric-cyan/10">
      <div className="max-w-7xl mx-auto">
        {/* System Transparency Section */}
        <div className="mb-12 pb-12 border-b border-electric-cyan/10">
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-electric-cyan mb-8">
            SYSTEM_TRANSPARENCY
          </h2>
          <div className="grid md:grid-cols-2 gap-6 font-mono text-sm md:text-base text-gray-400">
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

        {/* Footer Links and Address */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-sm text-gray-500">
            EuroSafeAI [2025]
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end font-mono text-sm">
            <a 
              href="#" 
              className="text-electric-cyan hover:text-electric-cyan/70 transition-colors underline"
            >
              [Download_Manifesto.pdf]
            </a>
            <a 
              href="#" 
              className="text-electric-cyan hover:text-electric-cyan/70 transition-colors underline"
            >
              [Encryption_Key]
            </a>
            <a 
              href="#" 
              className="text-electric-cyan hover:text-electric-cyan/70 transition-colors underline"
            >
              [Zurich_HQ]
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-electric-cyan/10 text-center">
          <address className="font-mono text-xs text-gray-500 not-italic">
            Uetikon am See 8852<br />
            Zürich<br />
            Switzerland
          </address>
        </div>
      </div>
    </footer>
  )
}

export default Footer

