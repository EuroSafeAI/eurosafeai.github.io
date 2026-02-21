import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeaderboardClient from '@/components/LeaderboardClient'

export const metadata: Metadata = {
  title: 'AI Safety Alignment Leaderboard — EuroSafeAI',
  description:
    'Ranking frontier AI models by human rights alignment, harm resistance, historical accuracy, and anti-authoritarian values — evaluated through an EU regulatory lens.',
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <LeaderboardClient />
      </main>
      <Footer />
    </div>
  )
}
