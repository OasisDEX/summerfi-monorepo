import { getDisplayToken, getPositionValues, getUniqueVaultId } from '@summerfi/app-earn-ui'
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
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import { type ChainId, ChainIds, type IArmadaVaultInfo } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedRwaReceipts } from '@/app/server-handlers/cached/get-rwa-receipts'
import { getCachedRwaUserPositions } from '@/app/server-handlers/cached/get-rwa-user-positions'
import { getCachedRwaVaultsInfo } from '@/app/server-handlers/cached/get-rwa-vaults-info'
import { getCachedRwaVaultsList } from '@/app/server-handlers/cached/get-rwa-vaults-list'
import { getCachedUserDcaOrders } from '@/app/server-handlers/cached/get-user-dca-orders'
import { getCachedUserPositions } from '@/app/server-handlers/cached/get-user-positions'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { type PortfolioRwaPendingPosition } from '@/features/portfolio/components/PortfolioOverview/PortfolioRwaPendingPositions'
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
  const [
    userPositions,
    vaultsList,
    systemConfig,
    vaultsInfo,
    rwaUserPositions,
    rwaVaultsList,
    rwaVaultsInfo,
  ] = await Promise.all([
    getCachedUserPositions({ walletAddress }),
    getCachedVaultsList(),
    getCachedConfig(),
    getCachedVaultsInfo(),
    // RWA (rounds-based) positions/vaults live in the institutional subgraph and are read via the
    // insti SDK. They're additive to the portfolio and degrade gracefully if unavailable.
    getCachedRwaUserPositions({ walletAddress }),
    getCachedRwaVaultsList(),
    getCachedRwaVaultsInfo(),
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
    rwaUserPositions,
    rwaVaultsList,
    rwaVaultsInfo,
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

  const {
    userPositions,
    userDcaOrders,
    vaultsList,
    systemConfig,
    vaultsInfo,
    rwaUserPositions,
    rwaVaultsList,
    rwaVaultsInfo,
  } = await portfolioCallsHandler({
    chainId: ChainIds.Base,
    walletAddress,
  })

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []
  const rwaUserPositionsJsonSafe = rwaUserPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(rwaUserPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList([
    ...vaultsList.vaults,
    ...rwaVaultsList.vaults,
  ])

  // Standard vaults decorated for the view (positions carousel + DCA lookups). RWA vaults are
  // permissioned, so they intentionally stay out of the "you might like" surfaces.
  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
    daoManagedVaultsList,
  })

  // Combined list (standard + RWA), used only to resolve each position to its vault and to drive the
  // per-vault history/APY/chart calls. RWA positions carry their own (RWA) vault into the view.
  const allVaultsWithConfig = decorateVaultsWithConfig({
    vaults: [...vaultsList.vaults, ...rwaVaultsList.vaults],
    systemConfig,
    userPositions: [...userPositionsJsonSafe, ...rwaUserPositionsJsonSafe],
    daoManagedVaultsList,
  })

  // Source of truth for which fleets are RWA: the RWA vaults list (their ids are the fleet
  // addresses). decorateWithFleetConfig keys the fleet config by vault id and can miss the RWA flag
  // for list-sourced vaults, so we match on these addresses directly instead of relying on
  // isRwaVault — this drives both the pending-receipts fetch and the RWA pill on position rows.
  const rwaFleetAddresses = new Set(rwaVaultsList.vaults.map((vault) => vault.id.toLowerCase()))

  const rwaVaultsWithConfig = allVaultsWithConfig.filter((vault) =>
    rwaFleetAddresses.has(vault.id.toLowerCase()),
  )

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)
  // IRwaVaultInfo is a structural clone of IArmadaVaultInfo (differs only by the `type` discriminant
  // and a brand symbol that the JSON round-trip above strips), and findVaultInfo matches by id — so
  // it's safe to treat RWA vault info as IArmadaVaultInfo for the portfolio's position->info lookup.
  const rwaVaultsInfoParsed = parseServerResponseToClient(rwaVaultsInfo)
    .vaults as unknown as IArmadaVaultInfo[]
  const allVaultsInfo = [...vaultsInfoParsed, ...rwaVaultsInfoParsed]

  // Defensive: only keep RWA positions whose vault resolved in the combined list, so a stray
  // position (e.g. a delisted RWA vault) can't make mergePositionWithVault throw and crash the page.
  const resolvableRwaPositions = rwaUserPositionsJsonSafe.filter((position) =>
    allVaultsWithConfig.some(
      (vault) =>
        vault.id.toLowerCase() === position.pool.id.fleetAddress.value.toLowerCase() &&
        subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)) ===
          position.id.user.chainInfo.chainId,
    ),
  )

  const allUserPositions = [...userPositionsJsonSafe, ...resolvableRwaPositions]

  const positionsWithVault = allUserPositions.map((position) => {
    const merged = mergePositionWithVault({
      position,
      vaultsWithConfig: allVaultsWithConfig,
      vaultsInfo: allVaultsInfo,
    })

    // Guarantee RWA positions are flagged so the "RWA" pill renders, even when the fleet-config
    // decoration didn't set isRwaVault on this vault instance.
    return rwaFleetAddresses.has(merged.vault.id.toLowerCase())
      ? { ...merged, vault: { ...merged.vault, isRwaVault: true } }
      : merged
  })

  const [positionHistoryMap, vaultsApyByNetworkMap, rwaPendingPositions] = await Promise.all([
    Promise.all(
      allVaultsWithConfig.map((vault) =>
        getCachedPositionHistory({
          network: supportedSDKNetwork(vault.protocol.network),
          address: walletAddress.toLowerCase(),
          vault,
        }),
      ),
    ).then(mapPortfolioVaultsApy),
    getCachedVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    // Pending RWA positions (un-settled deposit/withdraw receipts), denormalised with the display
    // fields the portfolio card needs (token + link target). One receipts read per RWA vault.
    Promise.all(
      rwaVaultsWithConfig.map(async (vault) => {
        const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))
        const receipts = await getCachedRwaReceipts({
          chainId: vaultChainId,
          fleetAddress: vault.id,
          walletAddress,
        })

        return receipts.map(
          (receipt): PortfolioRwaPendingPosition => ({
            ...receipt,
            fleetAddress: vault.id,
            network: supportedSDKNetwork(vault.protocol.network),
            vaultId: vault.customFields?.slug ?? vault.id,
            tokenSymbol: getDisplayToken(vault.inputToken.symbol),
            tokenDecimals: vault.inputToken.decimals,
          }),
        )
      }),
    ).then((perVault) => perVault.flat()),
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
      rwaPendingPositions={rwaPendingPositions}
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
  const {
    userPositions,
    vaultsList,
    systemConfig,
    vaultsInfo,
    rwaUserPositions,
    rwaVaultsList,
    rwaVaultsInfo,
  } = await portfolioCallsHandler({
    chainId: ChainIds.Base,
    walletAddress,
  })

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)
  // IRwaVaultInfo is a structural clone of IArmadaVaultInfo (differs only by the `type` discriminant
  // and a brand symbol that the JSON round-trip above strips), and findVaultInfo matches by id — so
  // it's safe to treat RWA vault info as IArmadaVaultInfo for the portfolio's position->info lookup.
  const rwaVaultsInfoParsed = parseServerResponseToClient(rwaVaultsInfo)
    .vaults as unknown as IArmadaVaultInfo[]
  const allVaultsInfo = [...vaultsInfoParsed, ...rwaVaultsInfoParsed]

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []
  const rwaUserPositionsJsonSafe = rwaUserPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(rwaUserPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList([
    ...vaultsList.vaults,
    ...rwaVaultsList.vaults,
  ])

  // Combined (standard + RWA) so the portfolio totals below include claimed RWA positions.
  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: [...vaultsList.vaults, ...rwaVaultsList.vaults],
    systemConfig,
    userPositions: [...userPositionsJsonSafe, ...rwaUserPositionsJsonSafe],
    daoManagedVaultsList,
  })

  const resolvableRwaPositions = rwaUserPositionsJsonSafe.filter((position) =>
    vaultsWithConfig.some(
      (vault) =>
        vault.id.toLowerCase() === position.pool.id.fleetAddress.value.toLowerCase() &&
        subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)) ===
          position.id.user.chainInfo.chainId,
    ),
  )

  const positionsWithVault = [...userPositionsJsonSafe, ...resolvableRwaPositions].map(
    (position) => {
      return mergePositionWithVault({
        position,
        vaultsWithConfig,
        vaultsInfo: allVaultsInfo,
      })
    },
  )

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
