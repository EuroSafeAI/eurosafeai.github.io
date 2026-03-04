import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { Metadata } from 'next'
import Link from 'next/link'
import modelsData from '@/data/models.json'
import DownloadTrigger from './DownloadTrigger'

// Only generate pages for slugs that have a PDF on disk.
// Any other slug → 404.
export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  const dir = resolve(process.cwd(), 'public/certificate')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.pdf'))
    .map((f) => ({ slug: f.replace(/\.pdf$/, '') }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const model = (modelsData as { id: string; name: string; company: string }[])
    .find((m) => m.id === slug)
  const title = model
    ? `${model.name} — AI Safety Certificate · EuroSafeAI`
    : 'AI Safety Certificate · EuroSafeAI'
  return { title }
}

export default async function CertificatePage({ params }: Props) {
  const { slug } = await params

  // dynamicParams = false ensures only slugs from generateStaticParams reach here,
  // which already filters to PDFs that exist on disk. No secondary check needed.
  const model = (modelsData as { id: string; name: string; company: string }[])
    .find((m) => m.id === slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-white flex items-center justify-center px-4">
      <DownloadTrigger slug={slug} />

      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 text-primary-600 mb-6 shadow-sm">
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 4v10m0 0l-3-3m3 3l3-3M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {model ? model.name : slug}
        </h1>
        {model && (
          <p className="text-sm text-gray-500 font-jost mb-6">{model.company}</p>
        )}

        <p className="text-sm text-gray-600 font-jost mb-8">
          Your certificate is downloading&hellip; If it doesn&apos;t start automatically,
          use the button below.
        </p>

        <a
          href={`/certificate/${slug}.pdf`}
          download={`${slug}-eurosafe-certificate.pdf`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Certificate
        </a>

        <p className="mt-8 text-xs text-gray-400 font-jost">
          <Link href="/certificate" className="underline hover:text-primary-600 transition-colors">
            ← Back to the leaderboard
          </Link>
        </p>
      </div>
    </div>
  )
}
