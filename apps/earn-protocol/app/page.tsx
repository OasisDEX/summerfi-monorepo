import { Suspense } from 'react'
import { getVaultsProtocolsList } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { type Metadata } from 'next'
import { headers } from 'next/headers'

import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getDefiVaultsListData } from '@/app/server-handlers/vaults-list/get-defi-vaults-list-data'
import { getRwaVaultsListData } from '@/app/server-handlers/vaults-list/get-rwa-vaults-list-data'
import { getVaultsListAdditionalData } from '@/app/server-handlers/vaults-list/get-vaults-list-additional-data'
import { type VaultsListRouteResponse } from '@/components/layout/VaultsListView/useVaultsListQuery'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import {
  getVaultsListAdditionalDataQueryKey,
  getVaultsListRouteQueryKey,
} from '@/components/layout/VaultsListView/vaults-list-query-keys'
import { VaultsListViewLoading } from '@/components/layout/VaultsListView/VaultsListViewLoading'
import { getServerQueryClient } from '@/helpers/get-server-query-client'
import { getSeoKeywords } from '@/helpers/seo-keywords'

const RWA_VAULTS_FILTER = 'permissioned-rwa-vaults'

const VaultsListWithData = async ({
  walletAddress,
  vaultsFilter,
}: {
  walletAddress?: string
  vaultsFilter?: string
}) => {
  const queryClient = getServerQueryClient()

  // Prefetch on the fast server -> SDK path and hydrate, so the client renders straight from
  // the cache instead of waterfalling two API calls after the JS bundle loads. A prefetch that
  // fails is simply not dehydrated, and the client transparently falls back to fetching it.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getVaultsListRouteQueryKey(walletAddress, vaultsFilter),
      queryFn: (): Promise<VaultsListRouteResponse> =>
        vaultsFilter === RWA_VAULTS_FILTER
          ? // RWA's vaultsInfo is IRwaVaultInfo[]; the client contract and the list view treat it
            // as the optional IArmadaVaultInfo[] shape, mirroring fetchVaultsListRoute's cast.
            (getRwaVaultsListData(walletAddress) as unknown as Promise<VaultsListRouteResponse>)
          : getDefiVaultsListData(walletAddress),
    }),
    queryClient.prefetchQuery({
      queryKey: getVaultsListAdditionalDataQueryKey(),
      queryFn: getVaultsListAdditionalData,
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VaultListViewComponent walletAddress={walletAddress} />
    </HydrationBoundary>
  )
}

const EarnAllVaultsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ walletAddress?: string; vaults?: string }>
}) => {
  const { walletAddress, vaults } = await searchParams

  // The await above only parses the URL; the data prefetch lives inside the Suspense boundary
  // so the skeleton streams immediately while the prefetch resolves and streams in after it.
  return (
    <Suspense fallback={<VaultsListViewLoading />}>
      <VaultsListWithData walletAddress={walletAddress} vaultsFilter={vaults} />
    </Suspense>
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const [{ vaults }, headersList, params, tvl] = await Promise.all([
    getCachedVaultsList(),
    headers(),
    searchParams,
    getCachedTvl(),
  ])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const tvlFormatted = formatCryptoBalance(tvl)
  const { allVaultsProtocols: protocolsSupported } = getVaultsProtocolsList(vaults)

  let ogImageUrl = ''

  if (typeof params.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vaults-list?tvl=${tvlFormatted}&protocols=${protocolsSupported.length}`
  }

  return {
    title: `Lazy Summer Protocol - $${tvlFormatted} TVL with ${protocolsSupported.length} protocols supported`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
    keywords: getSeoKeywords(),
  }
}

export default EarnAllVaultsPage
