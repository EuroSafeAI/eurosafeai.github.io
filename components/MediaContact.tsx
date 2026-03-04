import Image from 'next/image'
import ScrollReveal from './ScrollReveal'

type Color = 'purple' | 'primary'

const colorMap: Record<Color, {
  iconBg: string
  iconText: string
  nameHover: string
  emailText: string
  pillHover: string
}> = {
  purple: {
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    nameHover: 'hover:text-purple-600',
    emailText: 'text-purple-600',
    pillHover: 'hover:border-purple-200 hover:bg-purple-50',
  },
  primary: {
    iconBg: 'bg-primary-100',
    iconText: 'text-primary-600',
    nameHover: 'hover:text-primary-600',
    emailText: 'text-primary-600',
    pillHover: 'hover:border-primary-200 hover:bg-primary-50',
  },
}

interface Props {
  color?: Color
}

export default function MediaContact({ color = 'primary' }: Props) {
  const c = colorMap[color]

  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 ${c.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Media Contact</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <a href="https://zhijing-jin.com/home/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <Image
                    src="/images/team/zhijing-jin.png"
                    alt="Zhijing Jin"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                  />
                </a>
                <div>
                  <a
                    href="https://zhijing-jin.com/home/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold text-gray-900 ${c.nameHover} transition-colors`}
                  >
                    Zhijing Jin
                  </a>
                  <p className="text-sm text-gray-500">Founder &amp; Head, EuroSafeAI</p>
                  <a href="mailto:zjin.admin@cs.toronto.edu" className={`text-sm ${c.emailText} hover:underline`}>
                    zjin.admin@cs.toronto.edu
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <a href="https://zhijing-jin.com/home/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <Image
                    src="/images/team/pepijn-cobben.png"
                    alt="Pepijn Cobben"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                  />
                </a>
                <div>
                  <a
                    href="https://www.linkedin.com/in/pepijn-cobben?originalSubdomain=ch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold text-gray-900 ${c.nameHover} transition-colors`}
                  >
                    Pepijn Cobben
                  </a>
                  <p className="text-sm text-gray-500">Cofounder, EuroSafeAI</p>
                  <a href="mailto:pcobben@ethz.ch" className={`text-sm ${c.emailText} hover:underline`}>
                    pcobben@ethz.ch
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <a href="https://vesaterra.github.io/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <Image
                    src="/images/team/punya-pandey.png"
                    alt="Punya Syon Pandey"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                  />
                </a>
                <div>
                  <a
                    href="https://vesaterra.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold text-gray-900 ${c.nameHover} transition-colors`}
                  >
                    Punya Syon Pandey
                  </a>
                  <p className="text-sm text-gray-500">Lab Assistant</p>
                  <a href="mailto:ppandey@cs.toronto.edu" className={`text-sm ${c.emailText} hover:underline`}>
                    ppandey@cs.toronto.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href="https://bsky.app/profile/zhijingjin.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 ${c.pillHover} transition-colors`}
            >
              Bluesky
            </a>
            <a
              href="https://x.com/ZhijingJin"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 ${c.pillHover} transition-colors`}
            >
              X / Twitter
            </a>
            <a
              href="https://youtube.com/@Zhijing"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 ${c.pillHover} transition-colors`}
            >
              YouTube
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
