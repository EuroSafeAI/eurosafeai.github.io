'use client'

import { useEffect } from 'react'

export default function CertificatesRedirect() {
  useEffect(() => {
    window.location.replace('/certificate')
  }, [])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">
        Redirecting to <a href="/certificate" className="text-primary-600 underline">leaderboard</a>…
      </p>
    </div>
  )
}
