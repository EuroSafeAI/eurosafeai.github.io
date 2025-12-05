import React from 'react'

function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/logo2.jpg" 
            alt="EuroSafeAI Logo" 
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg tracking-tight text-slate-900">
            EuroSafeAI
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header

