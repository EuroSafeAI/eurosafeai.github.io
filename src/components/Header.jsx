import React, { useState, useEffect } from 'react'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-void/95 backdrop-blur-sm border-b border-electric-cyan/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/new-logo.png" 
            alt="EuroSafeAI Logo" 
            className="h-8 w-auto opacity-90"
          />
          <span className="font-display font-bold text-lg tracking-tight text-white">
            EuroSafeAI
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-electric-cyan rounded-full pulse-glow"></div>
            <span className="text-electric-cyan">SYSTEM_STATUS: ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
