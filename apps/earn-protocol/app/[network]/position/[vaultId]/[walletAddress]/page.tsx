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
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultManageCoreData } from '@/app/server-handlers/vault-manage/get-vault-manage-core-data'
import { getVaultManageCoreQueryKey } from '@/components/layout/VaultManageView/vault-manage-query-keys'
import { VaultManageLoadingView } from '@/components/layout/VaultManageView/VaultManageLoadingView'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
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
      <VaultManageView
        network={network}
        vaultId={vaultId}
        walletAddress={walletAddress}
        isRwaVault={false}
      />
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

  // RWA (permissioned) vaults have been removed from the earn app. They are still detected via the
  // curator config so a direct/bookmarked RWA position URL redirects to the regular vaults list.
  const isRwaVault = !!getVaultCuratedBy(parsedVaultId, parsedNetworkId, systemConfig)

  if (isRwaVault) {
    redirect('/')
  }

  return (
    <Suspense fallback={<VaultManageLoadingView isRwaVault={false} />}>
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

  const [position, vault] = await Promise.all([
    getUserPosition({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress,
    }),
    getCachedVaultDetails({
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
