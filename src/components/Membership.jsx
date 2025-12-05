import React from 'react'

function Membership() {
  return (
    <section className="relative py-32 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-electric-cyan rounded-full blur-3xl pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-signal-orange rounded-full blur-3xl pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 text-center space-y-12">
          <div className="fade-in-up">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6">
              Join the Mission
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              We're building the safety infrastructure for superintelligence. 
              This requires the brightest minds, the most committed resources, 
              and unwavering dedication to the common good.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Card 1 */}
            <div className="bg-charcoal border border-electric-cyan/20 p-8 hover:border-electric-cyan/50 transition-all duration-300 fade-in-up group">
              <div className="text-electric-cyan mb-6 text-4xl font-mono">[01]</div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white">
                Research Collaboration
              </h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Contribute to cutting-edge safety research. Access our facilities, 
                join working groups, and shape the future of AI governance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-charcoal border border-signal-orange/20 p-8 hover:border-signal-orange/50 transition-all duration-300 fade-in-up group" style={{ animationDelay: '0.1s' }}>
              <div className="text-signal-orange mb-6 text-4xl font-mono">[02]</div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white">
                Strategic Partnership
              </h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Organizations and institutions: align your resources with independent 
                safety research. Fuel the mission that protects humanity.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-charcoal border border-electric-cyan/20 p-8 hover:border-electric-cyan/50 transition-all duration-300 fade-in-up group" style={{ animationDelay: '0.2s' }}>
              <div className="text-electric-cyan mb-6 text-4xl font-mono">[03]</div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white">
                Philanthropic Support
              </h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Visionaries and philanthropists: your capital ensures independent 
                research continues when profit motives would compromise safety.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-void border-2 border-electric-cyan/30 p-12 max-w-3xl mx-auto hover:border-electric-cyan transition-all duration-300">
              <div className="font-mono text-sm text-electric-cyan mb-4">
                [ INITIATE_CONTACT_PROTOCOL ]
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
                Ready to Engage?
              </h3>
              <p className="text-lg text-gray-400 mb-8 font-light leading-relaxed">
                Whether you're a researcher, organization, or philanthropist, 
                we want to hear from you. Let's discuss how you can contribute 
                to humanity's safety infrastructure.
              </p>
              <a
                href="mailto:eurosafeai.zurich@gmail.com"
                className="inline-block group relative px-10 py-5 bg-electric-cyan text-void font-display font-bold text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Send Transmission</span>
                <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <div className="mt-4 font-mono text-sm text-gray-500">
                → eurosafeai.zurich@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Membership
