import { portfolioRewardsHandler } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
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
  const strategiesList = await getVaultsList()

  return (
    <PortfolioPageView
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      strategiesList={strategiesList}
    />
  )
}

export default PortfolioPage
