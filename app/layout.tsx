import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    apple: '/favicon.ico',
  },
  title: 'EuroSafeAI - Pioneering Multi-Agent Safety',
  description:
    'A nonprofit research organization advancing AI safety and security through rigorous research, threat assessment, and mitigation strategies.',
  keywords: ['AI Safety', 'AI Security', 'Multi-Agent Safety', 'Research', 'Nonprofit', 'Switzerland'],
  authors: [{ name: 'EuroSafeAI' }],
  openGraph: {
    title: 'EuroSafeAI - Pioneering Multi-Agent Safety',
    description:
      'A nonprofit research organization advancing AI safety and security through rigorous research, threat assessment, and mitigation strategies.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EuroSafeAI - Pioneering Multi-Agent Safety',
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
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            (function() {
              var host = window.location.hostname;
              var id = host.endsWith('.ca') ? 'G-6RH7QF9GNV' : 'G-C4SNM3JE25';
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
              document.head.appendChild(s);
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', id);
            })();
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Libre Baskerville — Authoritative legal/government serif for headings.
          IBM Plex Sans — Precise, technical sans for body & UI text.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-jost">{children}</body>
    </html>
  )
}
