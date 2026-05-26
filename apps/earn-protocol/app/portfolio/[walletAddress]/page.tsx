import { getPositionValues, getUniqueVaultId } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type SingleSourceChartData,
} from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatFiatBalance,
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import { type ChainId, ChainIds } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedUserDcaOrders } from '@/app/server-handlers/cached/get-user-dca-orders'
import { getCachedUserPositions } from '@/app/server-handlers/cached/get-user-positions'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { mergePositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { type GetPositionHistoryQuery } from '@/graphql/clients/position-history/client'
import { getPositionHistoricalData } from '@/helpers/chart-helpers/get-position-historical-data'
import { isValidAddress } from '@/helpers/is-valid-address'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const portfolioCallsHandler = async ({
  chainId,
  walletAddress,
}: {
  chainId: ChainId
  walletAddress: string
}) => {
  const [userPositions, vaultsList, systemConfig, vaultsInfo] = await Promise.all([
    getCachedUserPositions({ walletAddress }),
    getCachedVaultsList(),
    getCachedConfig(),
    getCachedVaultsInfo(),
  ])

  const parsedSystemConfig = parseServerResponseToClient(systemConfig)
  const dcaEnabled = !!parsedSystemConfig.features?.DcaEnabled
  const userDcaOrders = dcaEnabled ? await getCachedUserDcaOrders({ chainId, walletAddress }) : []

  return {
    userPositions,
    userDcaOrders,
    vaultsList,
    systemConfig,
    vaultsInfo,
  }
}

const mapPortfolioVaultsApy = (
  responses: { positionHistory: GetPositionHistoryQuery; vault: SDKVaultishType }[],
) =>
  responses.reduce<{
    [key: string]: GetPositionHistoryQuery
  }>((acc, { positionHistory, vault }) => {
    return {
      ...acc,
      [getUniqueVaultId(vault)]: parseServerResponseToClient(positionHistory),
    }
  }, {})

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const [{ walletAddress: walletAddressRaw }, rewardTokenPrices] = await Promise.all([
    params,
    getCachedRewardTokenPrice(),
  ])

  const walletAddress = walletAddressRaw.toLowerCase()

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  const { userPositions, userDcaOrders, vaultsList, systemConfig, vaultsInfo } =
    await portfolioCallsHandler({
      chainId: ChainIds.Base,
      walletAddress,
    })

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaultsList.vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
    daoManagedVaultsList,
  })

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
      vaultsInfo: vaultsInfoParsed,
    })
  })

  const [positionHistoryMap, vaultsApyByNetworkMap] = await Promise.all([
    Promise.all(
      vaultsWithConfig.map((vault) =>
        getCachedPositionHistory({
          network: supportedSDKNetwork(vault.protocol.network),
          address: walletAddress.toLowerCase(),
          vault,
        }),
      ),
    ).then(mapPortfolioVaultsApy),
    getCachedVaultsApy({
      fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const positionsHistoricalChartMap = positionsWithVault.reduce<{
    [key: string]: SingleSourceChartData
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
      viewWalletAddress={walletAddress}
      vaultsList={vaultsWithConfig}
      positionsHistoricalChartMap={positionsHistoricalChartMap}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      rewardTokenPrices={rewardTokenPrices}
      dcaOrders={userDcaOrders}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: PortfolioPageProps & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const [{ walletAddress: walletAddressRaw }, headersList, searchParamsAwaited] = await Promise.all(
    [params, headers(), searchParams],
  )
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const walletAddress = walletAddressRaw.toLowerCase()
  const { userPositions, vaultsList, systemConfig, vaultsInfo } = await portfolioCallsHandler({
    chainId: ChainIds.Base,
    walletAddress,
  })

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaultsList.vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
    daoManagedVaultsList,
  })

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
      vaultsInfo: vaultsInfoParsed,
    })
  })

  const totalSummerPortfolioUSD = positionsWithVault.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const totalSUMREarned = positionsWithVault.reduce((acc, { position }) => {
    return acc.plus(
      new BigNumber(position.claimableSummerToken.amount).plus(
        new BigNumber(position.claimedSummerToken.amount),
      ),
    )
  }, zero)

  let ogImageUrl = ''

  if (typeof searchParamsAwaited.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/portfolio?amount=$${formatFiatBalance(totalSummerPortfolioUSD)}&address=${walletAddress}&sumrEarned=${formatCryptoBalance(totalSUMREarned)}`
  }

  return {
    title: `Lazy Summer Protocol - ${formatAddress(walletAddress, { first: 6 })} - $${formatFiatBalance(totalSummerPortfolioUSD)} in Lazy Summer`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
  }
}

export default PortfolioPage
