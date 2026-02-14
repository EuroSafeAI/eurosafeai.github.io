import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Astral Research - Pioneering Multi-Agent Safety',
  description:
    'A nonprofit research organization advancing AI safety and security through rigorous research, threat assessment, and mitigation strategies.',
  keywords: ['AI Safety', 'AI Security', 'Multi-Agent Safety', 'Research', 'Nonprofit', 'Switzerland'],
  authors: [{ name: 'Astral Research' }],
  openGraph: {
    title: 'Astral Research - Pioneering Multi-Agent Safety',
    description:
      'A nonprofit research organization advancing AI safety and security through rigorous research, threat assessment, and mitigation strategies.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astral Research - Pioneering Multi-Agent Safety',
    description:
      'A nonprofit research organization advancing AI safety and security.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
