'use client'

import { useEffect } from 'react'

export default function CertificatesSlugRedirect({ slug }: { slug: string }) {
  useEffect(() => {
    window.location.replace(`/certificate/${slug}`)
  }, [slug])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to certificate…</p>
    </div>
  )
}
