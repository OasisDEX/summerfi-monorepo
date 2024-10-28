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

  const [walletData, { vaults }] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    await getVaultsList(),
  ])
  const rewardsData = portfolioRewardsHandler(walletAddress)

  return (
    <PortfolioPageView
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaults}
    />
  )
}

export default PortfolioPage
