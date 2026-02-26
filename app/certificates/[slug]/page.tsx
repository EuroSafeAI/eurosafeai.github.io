import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import CertificatesSlugRedirect from './CertificatesSlugRedirect'

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  const dir = resolve(process.cwd(), 'public/certificate')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.pdf'))
    .map((f) => ({ slug: f.replace(/\.pdf$/, '') }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function CertificatesSlugRedirectPage({ params }: Props) {
  const { slug } = await params
  return <CertificatesSlugRedirect slug={slug} />
}
