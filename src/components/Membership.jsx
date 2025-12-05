import React from 'react'

function Membership() {
  return (
    <section className="relative py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-display font-extrabold text-center mb-16 fade-in-up">
          Choose Your Role in History
        </h2>

        <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-16 font-light fade-in-up" style={{ animationDelay: '0.2s' }}>
          This is not a mailing list. This is a mobilization of resources and talent.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* The Architects */}
          <div className="bg-charcoal border-2 border-electric-cyan/30 p-10 hover:border-electric-cyan transition-all duration-300 fade-in-up">
            <div className="mb-6">
              <h3 className="text-3xl font-display font-bold text-electric-cyan mb-2">
                The Architects
              </h3>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                (Active Members)
              </p>
            </div>
            <p className="text-gray-300 mb-2 font-light">
              <strong className="text-white">For:</strong> Researchers, Engineers, Builders.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">
              You are in the arena. Access our facilities, join the working groups, 
              and vote on the strategic direction of the association.
            </p>
            <button className="w-full px-6 py-4 bg-electric-cyan text-void font-display font-bold uppercase tracking-wider hover:bg-electric-cyan/90 transition-all duration-300">
              Apply for Access
            </button>
          </div>

          {/* The Patrons */}
          <div className="bg-void border-2 border-signal-orange/30 p-10 hover:border-signal-orange transition-all duration-300 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-6">
              <h3 className="text-3xl font-display font-bold text-signal-orange mb-2">
                The Patrons
              </h3>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                (Passive Members)
              </p>
            </div>
            <p className="text-gray-300 mb-2 font-light">
              <strong className="text-white">For:</strong> Visionaries, Philanthropists, Orgs.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">
              You fuel the mission. Provide the capital and resources necessary to keep 
              independent safety research alive.
            </p>
            <button className="w-full px-6 py-4 bg-signal-orange text-white font-display font-bold uppercase tracking-wider hover:bg-signal-orange/90 transition-all duration-300">
              Fund the Safety Net
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Membership

