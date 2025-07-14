import { type Metadata } from 'next'

import { MerchandisePageView } from '@/features/merchandise/components/MerchandisePageView/MerchandisePageView'
import { type MerchandiseType } from '@/features/merchandise/types'
import { getSeoKeywords } from '@/helpers/seo-keywords'

interface MerchandisePageProps {
  params: Promise<{
    walletAddress: string
    type: MerchandiseType
  }>
}

const MerchandisePage = async ({ params }: MerchandisePageProps) => {
  const { type, walletAddress } = await params

  return <MerchandisePageView type={type} walletAddress={walletAddress} />
}

export async function generateMetadata({ params }: MerchandisePageProps): Promise<Metadata> {
  const { type } = await params

  return {
    title: `Claim your Beach Club ${type}`,
    description: `Claim your ${type} for your Summer Beach Club adventures`,
    keywords: getSeoKeywords(),
  }
}

export default MerchandisePage
