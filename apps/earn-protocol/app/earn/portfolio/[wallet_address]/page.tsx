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

  const [walletData, { vaults, callDataTimestamp }] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    await getVaultsList(),
  ])
  const rewardsData = portfolioRewardsHandler(walletAddress)

  return (
    <>
      <PortfolioPageView
        walletAddress={walletAddress}
        walletData={walletData}
        rewardsData={rewardsData}
        strategiesList={vaults}
      />
      <pre
        style={{
          backgroundColor: 'rgba(30,30,30,0.5)',
          backdropFilter: 'blur(30px)',
          color: 'rgba(180,180,180,1)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          width: '100%',
          whiteSpace: 'pre-wrap',
          marginTop: '20px',
        }}
      >
        {JSON.stringify(
          { dataTimestamp: callDataTimestamp, secondsAgo: (Date.now() - callDataTimestamp) / 1000 },
          null,
          2,
        )}
      </pre>
    </>
  )
}

export default PortfolioPage
