import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EuropeMapWrapper from '@/components/EuropeMapWrapper'

export const metadata: Metadata = {
  title: 'European AI & Democracy Atlas — EuroSafeAI',
  description:
    'Interactive map of European countries color-coded by democracy level, AI readiness, and AI regulatory strength.',
}

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <EuropeMapWrapper />
      </main>
      <Footer />
    </div>
  )
}
