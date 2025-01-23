import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'

import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { portfolioPositionsHandler } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDecayFactor } from '@/app/server-handlers/sumr-decay-factor'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegates } from '@/app/server-handlers/sumr-delegates'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
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
    sumrStakingInfo,
    sumrDelegates,
    sumrToClaim,
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
    getSumrStakingInfo(),
    getSumrDelegates(),
    getSumrToClaim({ walletAddress }),
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

  const sumrDecayFactors = await getSumrDecayFactor(
    sumrDelegates.map((delegate) => delegate.account.address),
  )

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  const totalRays = Number(sumrEligibility.leaderboard[0]?.totalPoints ?? 0)

  return (
    <PortfolioPageViewComponent
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
