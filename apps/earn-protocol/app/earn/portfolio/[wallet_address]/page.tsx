import { portfolioRewardsHandler } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'

type PortfolioPageProps = {
  params: {
    wallet_address: string
  }
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const walletAddress = params.wallet_address

  const walletData = await portfolioWalletAssetsHandler(walletAddress)
  const rewardsData = portfolioRewardsHandler(walletAddress)

  return (
    <PortfolioPageView
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
    />
  )
}

export default PortfolioPage
