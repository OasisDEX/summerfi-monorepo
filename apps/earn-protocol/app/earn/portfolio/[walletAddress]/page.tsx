import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'

import { portfolioPositionsHandler } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { portfolioRewardsHandler } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

type PortfolioPageProps = {
  params: {
    walletAddress: string
  }
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress } = params

  const [walletData, { vaults }, positions, systemConfig] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    getVaultsList(),
    getUserPositions({ walletAddress }),
    systemConfigHandler(),
  ])
  const rewardsData = portfolioRewardsHandler(walletAddress)

  const positionsJsonSafe = positions
    ? parseServerResponseToClient<IArmadaPosition[]>(positions)
    : []

  const { config } = parseServerResponseToClient(systemConfig)

  const positionsList = await Promise.all(
    positionsJsonSafe.map((position) =>
      portfolioPositionsHandler({ position, vaultsList: vaults, config, walletAddress }),
    ),
  )

  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig: config })

  return (
    <PortfolioPageView
      positions={positionsList}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaultsDecorated}
    />
  )
}

export default PortfolioPage
