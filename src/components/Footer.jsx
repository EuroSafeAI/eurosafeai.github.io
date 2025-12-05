import React from 'react'

function Footer() {
  return (
    <footer className="relative py-12 px-6 bg-black border-t border-electric-cyan/10">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="text-center">
          <div className="font-mono text-sm text-gray-500 mb-6">
            EuroSafeAI [2025]
          </div>
          <address className="font-mono text-xs text-gray-500 not-italic">
            Uetikon am See 8852<br />
            Zürich<br />
            Switzerland
          </address>
        </div>
        
        {/* System Transparency - Small */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-electric-cyan/5">
          <div className="font-mono text-[10px] text-gray-600 space-y-1">
            <div><span className="text-electric-cyan/60">SYSTEM_TRANSPARENCY:</span> <span className="text-gray-500">LOCATION: Zürich, Switzerland | STRUCTURE: Democratic Verein | FINANCIALS: 100% Non-Profit | DATA: Zero-knowledge architecture</span></div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

