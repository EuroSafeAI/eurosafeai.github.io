import modelsData from '@/data/models.json'
import CertificatesSlugRedirect from './CertificatesSlugRedirect'

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return (modelsData as { id: string }[]).map((m) => ({ slug: m.id }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function CertificatesSlugRedirectPage({ params }: Props) {
  const { slug } = await params
  return <CertificatesSlugRedirect slug={slug} />
}
