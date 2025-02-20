import { getUniqueVaultId } from '@summerfi/app-earn-ui'
import { type HistoryChartData, type IArmadaPosition } from '@summerfi/app-types'
import { parseServerResponseToClient } from '@summerfi/app-utils'

import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import {
  getPositionHistory,
  type GetPositionHistoryReturnType,
} from '@/app/server-handlers/position-history'
import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegatesWithDecayFactor } from '@/app/server-handlers/sumr-delegates-with-decay-factor'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { mergePositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { getPositionHistoricalData } from '@/helpers/chart-helpers/get-position-historical-data'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress: walletAddressRaw } = await params

  const walletAddress = walletAddressRaw.toLowerCase()

  const [
    walletData,
    { rebalances },
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
    usersActivity,
    userPositions,
    vaultsList,
    systemConfig,
  ] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    getGlobalRebalances(),
    getSumrDelegateStake({ walletAddress }),
    fetchRaysLeaderboard({ userAddress: walletAddress, page: '1', limit: '1' }),
    getSumrBalances({ walletAddress }),
    getSumrStakingInfo(),
    getSumrDelegatesWithDecayFactor(),
    getSumrToClaim({ walletAddress }),
    getUsersActivity({ filterTestingWallets: false, walletAddress }),
    getUserPositions({ walletAddress }),
    getVaultsList(),
    systemConfigHandler(),
  ])

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig: systemConfig.config,
  })

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
    })
  })

  const positionHistoryMap = await Promise.all(
    vaultsWithConfig.map(
      async (vault) =>
        await getPositionHistory({
          network: vault.protocol.network,
          address: walletAddress.toLowerCase(),
          vault,
        }),
    ),
  ).then((responses) =>
    responses.reduce<{
      [key: string]: GetPositionHistoryReturnType['positionHistory']
    }>((acc, { positionHistory, vault }) => {
      return {
        ...acc,
        [getUniqueVaultId(vault)]: parseServerResponseToClient(positionHistory),
      }
    }, {}),
  )

  const userVaultsIds = positionsWithVault.map((position) => position.vault.id.toLowerCase())
  const userRebalances = rebalances.filter((rebalance) =>
    userVaultsIds.includes(rebalance.vault.id.toLowerCase()),
  )

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  const totalRaysPoints = Number(sumrEligibility.leaderboard[0]?.totalPoints ?? 0)
  const tgeSnapshotPoints = Number(sumrEligibility.leaderboard[0]?.tgeSnapshotPoints ?? 0)

  const totalRays = totalRaysPoints - tgeSnapshotPoints

  const userActivity = usersActivity.usersActivity.filter(
    (activity) => activity.account.toLowerCase() === walletAddress.toLowerCase(),
  )

  const positionsHistoricalChartMap = positionsWithVault.reduce<{
    [key: string]: HistoryChartData
  }>(
    (acc, position) => ({
      ...acc,
      [getUniqueVaultId(position.vault)]: getPositionHistoricalData({
        position: position.position,
        vault: position.vault,
        positionHistory: positionHistoryMap[getUniqueVaultId(position.vault)],
      }),
    }),
    {},
  )

  return (
    <PortfolioPageViewComponent
      positions={positionsWithVault}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaultsWithConfig}
      rebalancesList={userRebalances}
      totalRays={totalRays}
      userActivity={userActivity}
      positionsHistoricalChartMap={positionsHistoricalChartMap}
    />
  )
}

export default PortfolioPage
