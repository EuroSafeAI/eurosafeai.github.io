'use client'

import dynamic from 'next/dynamic'

// Disable SSR — the map fetches a relative URL that only works in the browser
const EuropeMapClient = dynamic(() => import('./EuropeMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 text-gray-400 font-jost text-sm">
      Loading map…
    </div>
  ),
})

export default function EuropeMapWrapper() {
  return <EuropeMapClient />
}
