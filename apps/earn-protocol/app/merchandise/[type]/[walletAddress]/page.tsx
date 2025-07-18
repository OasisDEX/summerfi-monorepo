import { isValidAddress } from '@summerfi/serverless-shared'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { MerchandisePageView } from '@/features/merchandise/components/MerchandisePageView/MerchandisePageView'
import { MerchandiseType } from '@/features/merchandise/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { getSeoKeywords } from '@/helpers/seo-keywords'

interface MerchandisePageProps {
  params: Promise<{
    walletAddress: string
    type: MerchandiseType
  }>
}

const merchandisePathGuard = ({
  type,
  walletAddress,
}: {
  type: MerchandiseType
  walletAddress: string
}) => {
  return {
    // verify that type in url is valid (nft ommited as it's not a physical item)
    isTypeValid: type === MerchandiseType.T_SHIRT || type === MerchandiseType.HOODIE,
    // verify that wallet address is valid
    isAddressValid: isValidAddress(walletAddress),
  }
}

const MerchandisePage = async ({ params }: MerchandisePageProps) => {
  const { type, walletAddress } = await params

  const { isTypeValid, isAddressValid } = merchandisePathGuard({ type, walletAddress })

  if (!isTypeValid) {
    return redirect(`/portfolio/${walletAddress}?tab=${PortfolioTabs.BEACH_CLUB}`)
  }

  if (!isAddressValid) {
    return redirect(`/portfolio`)
  }

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
