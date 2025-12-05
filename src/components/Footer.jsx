import React from 'react'

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Address */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Contact</h3>
            <address className="text-sm text-slate-600 not-italic leading-relaxed">
              EuroSafeAI<br />
              Uetikon am See 8852 <br />
               Zürich<br />
              Switzerland
            </address>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a 
                  href="#" 
                  className="hover:text-blue-600 transition-colors underline"
                >
                  Articles of Association (PDF)
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-blue-600 transition-colors underline"
                >
                  Data Protection
                </a>
              </li>
            </ul>
          </div>

          {/* Data Protection Info */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Privacy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We exclusively gather personal data required to fulfil the purpose 
              of the association. Member data is confidential.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} EuroSafeAI. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Politically independent and denominationally neutral.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

