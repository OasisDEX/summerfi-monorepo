import { Suspense } from 'react'
import { getDisplayToken, getPositionValues } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
  zero,
} from '@summerfi/app-utils'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedRwaUserVaultExposure } from '@/app/server-handlers/cached/get-rwa-user-vault-exposure'
import { getCachedRwaVaultDetails } from '@/app/server-handlers/cached/get-rwa-vault-details'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultManageCoreData } from '@/app/server-handlers/vault-manage/get-vault-manage-core-data'
import { getVaultOpenCoreData } from '@/app/server-handlers/vault-open/get-vault-open-core-data'
import { getVaultManageCoreQueryKey } from '@/components/layout/VaultManageView/vault-manage-query-keys'
import { VaultManageLoadingView } from '@/components/layout/VaultManageView/VaultManageLoadingView'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
import { getVaultOpenCoreQueryKey } from '@/components/layout/VaultOpenView/vault-open-query-keys'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { getServerQueryClient } from '@/helpers/get-server-query-client'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import {
  getVaultCuratedBy,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultManagePageProps = {
  params: Promise<{
    vaultId: string
    network: SupportedSDKNetworks
    walletAddress: string
  }>
}

const VaultManageWithData = async ({
  network,
  vaultId,
  walletAddress,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
}) => {
  const queryClient = getServerQueryClient()

  // RWA (rounds-based) vaults: a deposit mints ERC-1155 receipts, not Fleet shares — the user only
  // holds a real position once the round settles and they claim. Until then there is no position to
  // show, so the position page mirrors the open view (deposit sidebar + pending receipts). Once the
  // user holds shares, the normal position view is shown below.
  //
  // The RWA check is the same cheap/cached lookup the open page uses; we only pay for the extra
  // position fetch on RWA vaults so the common (non-RWA) path is unchanged.
  const systemConfig = parseServerResponseToClient(await getCachedConfig())
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)
  const isRwaVault =
    !!parsedVaultId && !!getVaultCuratedBy(parsedVaultId, parsedNetworkId, systemConfig)

  if (isRwaVault) {
    const [position, exposure] = parsedVaultId
      ? await Promise.all([
          getUserPosition({
            vaultAddress: parsedVaultId,
            network: parsedNetwork,
            walletAddress,
            isRwaVault,
          }),
          getCachedRwaUserVaultExposure({
            chainId: parsedNetworkId,
            fleetAddress: parsedVaultId,
            walletAddress,
          }),
        ])
      : [undefined, null]
    const hasShares = !!position && new BigNumber(position.amount.amount).gt(0)
    // A pre-claim user with no settled shares but pending/claimable exposure still belongs on the
    // manage view (it synthesizes a "settling" position from this exposure). Only fall back to the
    // deposit view when there is genuinely nothing (no shares AND no exposure).
    const hasExposure = !!exposure && new BigNumber(exposure.total).gt(0)

    if (!hasShares && !hasExposure) {
      await queryClient.prefetchQuery({
        queryKey: getVaultOpenCoreQueryKey(network, vaultId),
        queryFn: () => getVaultOpenCoreData({ network, vaultId }),
      })

      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <VaultOpenView network={network} vaultId={vaultId} />
        </HydrationBoundary>
      )
    }
  }

  // Only the core (shell) is prefetched + hydrated so the header + deposit/withdraw/switch sidebar
  // paint instantly from the server cache. The heavier details island (performance + yield charts,
  // exposure, activity tables) is intentionally left to its own client query, which streams it into
  // the section skeletons after the shell — see useVaultManageDetailsQuery / VaultManageDetailsLoading.
  await queryClient.prefetchQuery({
    queryKey: getVaultManageCoreQueryKey(network, vaultId, walletAddress),
    queryFn: () => getVaultManageCoreData({ network, vaultId, walletAddress }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VaultManageView network={network} vaultId={vaultId} walletAddress={walletAddress} />
    </HydrationBoundary>
  )
}

const EarnVaultManagePage = async ({ params }: EarnVaultManagePageProps) => {
  const { network, vaultId, walletAddress } = await params

  if (!isAddress(walletAddress)) {
    redirect('/not-found')
  }

  // Cheap, cached resolution to preserve the not-found redirect for unresolvable vault ids; the
  // data prefetch itself lives inside the Suspense boundary so the skeleton streams immediately.
  const systemConfig = parseServerResponseToClient(await getCachedConfig())
  const parsedNetworkId = subgraphNetworkToId(humanNetworktoSDKNetwork(network))
  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    redirect('/not-found')
  }

  return (
    <Suspense fallback={<VaultManageLoadingView />}>
      <VaultManageWithData network={network} vaultId={vaultId} walletAddress={walletAddress} />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: EarnVaultManagePageProps & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const [
    { network: paramsNetwork, vaultId, walletAddress },
    systemConfig,
    headersList,
    searchParamsAwaited,
  ] = await Promise.all([params, getCachedConfig(), headers(), searchParams])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    return {
      title: `Lazy Summer Protocol - Vault not found`,
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  // RWA vaults are sourced from the RWA subgraph; use the matching detail handler so the title
  // resolves (mirrors the open page metadata).
  const isRwaVault = !!getVaultCuratedBy(parsedVaultId, parsedNetworkId, systemConfig)

  const [position, vault] = await Promise.all([
    getUserPosition({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress,
      isRwaVault,
    }),
    (isRwaVault ? getCachedRwaVaultDetails : getCachedVaultDetails)({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const { netValue } =
    position && vault
      ? getPositionValues({
          position,
          vault,
        })
      : { netValue: 0 }

  const totalSUMREarned = position
    ? new BigNumber(position.claimableSummerToken.amount).plus(
        new BigNumber(position.claimedSummerToken.amount),
      )
    : zero

  let ogImageUrl = ''

  if (typeof searchParamsAwaited.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vault-position?amount=${formatCryptoBalance(netValue)}&token=${vault ? getDisplayToken(vault.inputToken.symbol) : ''}&address=${walletAddress}&sumrEarned=${formatCryptoBalance(totalSUMREarned)}`
  }

  return {
    title: `Lazy Summer Protocol - ${formatCryptoBalance(netValue)} ${vault ? getDisplayToken(vault.inputToken.symbol) : ''} position on ${capitalize(paramsNetwork)}`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
  }
}

export default EarnVaultManagePage
