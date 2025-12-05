import React from 'react'

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Deepening Understanding.<br />
                Ensuring Safety.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium">
                Closing the Gap Between AI Capability and Human Safety.
              </p>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              The development of intelligent systems is outpacing our understanding of them. 
              EuroSafeAI unites experts to research, regulate, and steer AI deployment for 
              the benefit of humanity.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg aspect-square relative">
              <svg 
                viewBox="0 0 400 400" 
                className="w-full h-full hero-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Background circles */}
                <circle cx="200" cy="200" r="180" fill="url(#gradient1)" opacity="0.4" />
                <circle cx="200" cy="200" r="140" fill="url(#gradient2)" opacity="0.3" />
                
                {/* Central hub */}
                <circle cx="200" cy="200" r="20" fill="#3b82f6" filter="url(#glow)" className="hero-node" />
                <circle cx="200" cy="200" r="25" fill="#3b82f6" opacity="0.2" />
                
                {/* Outer nodes */}
                <circle cx="200" cy="80" r="12" fill="#6366f1" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0s' }} />
                <circle cx="320" cy="200" r="12" fill="#8b5cf6" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.2s' }} />
                <circle cx="200" cy="320" r="12" fill="#3b82f6" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.4s' }} />
                <circle cx="80" cy="200" r="12" fill="#6366f1" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.6s' }} />
                
                {/* Diagonal nodes */}
                <circle cx="280" cy="120" r="10" fill="#a855f7" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.1s' }} />
                <circle cx="280" cy="280" r="10" fill="#6366f1" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.3s' }} />
                <circle cx="120" cy="280" r="10" fill="#3b82f6" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.5s' }} />
                <circle cx="120" cy="120" r="10" fill="#8b5cf6" filter="url(#glow)" className="hero-node" style={{ animationDelay: '0.7s' }} />
                
                {/* Connection lines - main radial */}
                <line x1="200" y1="200" x2="200" y2="80" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="hero-line" />
                <line x1="200" y1="200" x2="320" y2="200" stroke="#6366f1" strokeWidth="2" opacity="0.4" className="hero-line" style={{ animationDelay: '0.1s' }} />
                <line x1="200" y1="200" x2="200" y2="320" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" className="hero-line" style={{ animationDelay: '0.2s' }} />
                <line x1="200" y1="200" x2="80" y2="200" stroke="#3b82f6" strokeWidth="2" opacity="0.4" className="hero-line" style={{ animationDelay: '0.3s' }} />
                
                {/* Connection lines - diagonal */}
                <line x1="200" y1="200" x2="280" y2="120" stroke="#a855f7" strokeWidth="1.5" opacity="0.3" className="hero-line" style={{ animationDelay: '0.15s' }} />
                <line x1="200" y1="200" x2="280" y2="280" stroke="#6366f1" strokeWidth="1.5" opacity="0.3" className="hero-line" style={{ animationDelay: '0.25s' }} />
                <line x1="200" y1="200" x2="120" y2="280" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3" className="hero-line" style={{ animationDelay: '0.35s' }} />
                <line x1="200" y1="200" x2="120" y2="120" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.3" className="hero-line" style={{ animationDelay: '0.45s' }} />
                
                {/* Inter-node connections */}
                <line x1="200" y1="80" x2="280" y2="120" stroke="#6366f1" strokeWidth="1" opacity="0.2" strokeDasharray="3,3" />
                <line x1="320" y1="200" x2="280" y2="280" stroke="#8b5cf6" strokeWidth="1" opacity="0.2" strokeDasharray="3,3" />
                <line x1="200" y1="320" x2="120" y2="280" stroke="#3b82f6" strokeWidth="1" opacity="0.2" strokeDasharray="3,3" />
                <line x1="80" y1="200" x2="120" y2="120" stroke="#6366f1" strokeWidth="1" opacity="0.2" strokeDasharray="3,3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

