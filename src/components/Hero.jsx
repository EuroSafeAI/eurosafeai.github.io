import React, { useState } from 'react'

function Hero() {
  const [glitchActive, setGlitchActive] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void">
      {/* Data streams background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="data-stream"
            style={{
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center space-y-8">
          {/* Pre-header */}
          <div className="font-mono text-sm text-electric-cyan/80 mb-8 fade-in-up">
            [ PROTOCOL: EURO_SAFE_AI // STATUS: ACTIVE ]
          </div>

          {/* Main headline with glitch effect */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold leading-tight fade-in-up">
            <span
              className="glitch-text inline-block cursor-pointer"
              data-text="Intelligence"
              onMouseEnter={() => setGlitchActive(true)}
              onMouseLeave={() => setGlitchActive(false)}
            >
              Intelligence
            </span>
            {' '}
            <span className="text-white">Without Control</span>
            <br />
            <span className="text-signal-orange">Is Catastrophe.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light fade-in-up" style={{ animationDelay: '0.2s' }}>
            We are rushing toward an intelligence explosion without the manual. 
            We exist to engineer the brakes, the steering, and the safety standards 
            for the most powerful technology humanity will ever create.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center mt-12 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => {
                const problemSection = document.getElementById('problem-section')
                problemSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 border-2 border-electric-cyan/50 text-electric-cyan font-display font-bold text-lg uppercase tracking-wider hover:bg-electric-cyan/10 hover:border-electric-cyan transition-all duration-300"
            >
              Read the Mission
            </button>
          </div>
        </div>

        {/* Central pulsing geometric shape */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-20">
          <div className="relative w-full h-full">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Complex geometric shape */}
              <polygon
                points="200,50 350,150 300,300 100,300 50,150"
                fill="none"
                stroke="url(#glowGradient)"
                strokeWidth="2"
                className="pulse-glow"
              />
              <polygon
                points="200,100 300,170 270,250 130,250 100,170"
                fill="none"
                stroke="#00d9ff"
                strokeWidth="1"
                opacity="0.5"
              />
              <circle cx="200" cy="200" r="30" fill="#00d9ff" opacity="0.3" className="pulse-glow" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
