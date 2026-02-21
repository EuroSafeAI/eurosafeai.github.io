'use client'

import { useEffect, useRef } from 'react'

export default function DownloadTrigger({ slug }: { slug: string }) {
  const triggered = useRef(false)

  useEffect(() => {
    if (triggered.current) return
    triggered.current = true
    const a = document.createElement('a')
    a.href = `/certificates/${slug}.pdf`
    a.download = `${slug}-eurosafe-certificate.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [slug])

  return null
}
