import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'
import { portfolioRewardsHandler } from '@/server-handlers/portfolio/portfolio-rewards-handler'
import { portfolioWalletAssetsHandler } from '@/server-handlers/portfolio/portfolio-wallet-assets-handler'

type PortfolioPageProps = {
  params: {
    wallet_address: string
  }
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const walletAddress = params.wallet_address

  const walletData = await portfolioWalletAssetsHandler(walletAddress)
  const rewardsData = await portfolioRewardsHandler(walletAddress)

  return (
    <PortfolioPageView
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
    />
  )
}

export default PortfolioPage
