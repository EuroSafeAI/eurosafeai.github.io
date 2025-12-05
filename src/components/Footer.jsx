import React from 'react'

function Footer() {
  return (
    <footer className="relative py-12 px-6 bg-black border-t border-electric-cyan/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
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
    </footer>
  )
}

export default Footer
