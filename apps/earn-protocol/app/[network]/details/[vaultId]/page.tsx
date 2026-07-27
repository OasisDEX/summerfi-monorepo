import { Suspense } from 'react'
import { getDisplayToken } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import capitalize from 'lodash-es/capitalize'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getVaultDetailsCoreData } from '@/app/server-handlers/vault-details/get-vault-details-core-data'
import { getVaultDetailsCoreQueryKey } from '@/components/layout/VaultDetailsView/vault-details-query-keys'
import { VaultDetailsLoadingView } from '@/components/layout/VaultDetailsView/VaultDetailsLoadingView'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'
import { getServerQueryClient } from '@/helpers/get-server-query-client'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import { getVaultIdByVaultCustomName } from '@/helpers/vault-custom-value-helpers'

type EarnVaultDetailsPageProps = {
  params: Promise<{
    network: SupportedSDKNetworks
    vaultId: string
  }>
}

const VaultDetailsWithData = async ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}) => {
  const queryClient = getServerQueryClient()

  // Only the core (shell) is prefetched + hydrated so the VaultGridDetails header + intro paint
  // instantly from the server cache. The heavier content island (yield chart, exposure, security
  // stats) is intentionally left to its own client query, which streams it into the section
  // skeletons after the shell — see useVaultDetailsContentQuery / VaultDetailsContentLoading.
  await queryClient.prefetchQuery({
    queryKey: getVaultDetailsCoreQueryKey(network, vaultId),
    queryFn: () => getVaultDetailsCoreData({ network, vaultId }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VaultDetailsView network={network} vaultId={vaultId} />
    </HydrationBoundary>
  )
}

const EarnVaultDetailsPage = async ({ params }: EarnVaultDetailsPageProps) => {
  const { network, vaultId } = await params

  // Cheap, cached resolution to preserve the not-found redirect; the data prefetch itself lives
  // inside the Suspense boundary so the skeleton streams immediately.
  const systemConfig = parseServerResponseToClient(await getCachedConfig())
  const parsedNetworkId = subgraphNetworkToId(humanNetworktoSDKNetwork(network))
  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    redirect('/not-found')
  }

  // Slug-named vault URLs (from getVaultUrl/getVaultDetailsUrl, old /position/ bookmarks,
  // and the post-withdraw redirect) resolve to the canonical address URL instead of 404ing.
  if (!isAddress(vaultId)) {
    redirect(`/${network.toLowerCase()}/details/${parsedVaultId}`)
  }

  return (
    <Suspense fallback={<VaultDetailsLoadingView />}>
      <VaultDetailsWithData network={network} vaultId={vaultId} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: EarnVaultDetailsPageProps): Promise<Metadata> {
  const [{ network: paramsNetwork, vaultId }, systemConfig] = await Promise.all([
    params,
    getCachedConfig(),
  ])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)

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

  const [vault] = await Promise.all([
    getCachedVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const tokenSymbol = vault ? getDisplayToken(vault.inputToken.symbol) : ''

  return {
    title: `Automated ${tokenSymbol} Strategy Details on ${capitalize(paramsNetwork)}`,
    description: `Maximize your DeFi yield with Summer.fi's ${tokenSymbol} automated earning strategy`,
    keywords: getSeoKeywords(tokenSymbol),
  }
}

export default EarnVaultDetailsPage
