import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'

import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { portfolioPositionsHandler } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

type PortfolioPageProps = {
  params: {
    walletAddress: string
  }
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress } = params

  const [
    walletData,
    { vaults },
    positions,
    systemConfig,
    { rebalances },
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
  ] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    getVaultsList(),
    getUserPositions({ walletAddress }),
    systemConfigHandler(),
    getGlobalRebalances(),
    getSumrDelegateStake({
      walletAddress,
    }),
    fetchRaysLeaderboard({ userAddress: walletAddress.toLowerCase(), page: '1', limit: '1' }),
    getSumrBalances({
      walletAddress,
    }),
  ])

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

  const userVaultsIds = positionsList.map((position) => position.vaultData.id.toLowerCase())
  const userRebalances = rebalances.filter((rebalance) =>
    userVaultsIds.includes(rebalance.vault.id.toLowerCase()),
  )

  const rewardsData: ClaimDelegateExternalData = {
    sumrPrice: '0',
    sumrEarned: '123.45',
    sumrToClaim: '1.23',
    sumrApy: '0.0123',
    sumrStakeDelegate,
    sumrBalances,
  }

  const totalRays = Number(sumrEligibility.leaderboard[0]?.totalPoints ?? 0)

  return (
    <PortfolioPageView
      positions={positionsList}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaultsDecorated}
      rebalancesList={userRebalances}
      totalRays={totalRays}
    />
  )
}

export default PortfolioPage
