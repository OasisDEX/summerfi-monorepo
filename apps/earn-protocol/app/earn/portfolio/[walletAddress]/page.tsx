import { portfolioRewardsHandler } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'

type PortfolioPageProps = {
  params: {
    walletAddress: string
  }
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress } = params

  const [walletData, { vaults }, positions] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    await getVaultsList(),
    await getUserPositions({ walletAddress }),
  ])
  const rewardsData = portfolioRewardsHandler(walletAddress)

  return (
    <PortfolioPageView
      positions={positions ?? []}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaults}
    />
  )
}

export default PortfolioPage
