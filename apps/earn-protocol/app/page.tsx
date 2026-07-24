import { Suspense } from 'react'
import { getVaultsProtocolsList } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getDefiVaultsListData } from '@/app/server-handlers/vaults-list/get-defi-vaults-list-data'
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

const VaultsListWithData = async ({ walletAddress }: { walletAddress?: string }) => {
  const queryClient = getServerQueryClient()

  // Prefetch on the fast server -> SDK path and hydrate, so the client renders straight from
  // the cache instead of waterfalling two API calls after the JS bundle loads. A prefetch that
  // fails is simply not dehydrated, and the client transparently falls back to fetching it.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getVaultsListRouteQueryKey(walletAddress),
      queryFn: (): Promise<VaultsListRouteResponse> => getDefiVaultsListData(walletAddress),
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

  // RWA (permissioned) vaults have been removed from the earn app. Redirect the legacy
  // ?vaults=permissioned-rwa-vaults deep link to the regular vaults list.
  if (vaults?.split(',').includes('permissioned-rwa-vaults')) {
    redirect('/')
  }

  // The await above only parses the URL; the data prefetch lives inside the Suspense boundary
  // so the skeleton streams immediately while the prefetch resolves and streams in after it.
  return (
    <Suspense fallback={<VaultsListViewLoading />}>
      <VaultsListWithData walletAddress={walletAddress} />
    </Suspense>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ vaults }, headersList, tvl] = await Promise.all([
    getCachedVaultsList(),
    headers(),
    getCachedTvl(),
  ])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const tvlFormatted = formatCryptoBalance(tvl)
  const { allVaultsProtocols: protocolsSupported } = getVaultsProtocolsList(vaults)

  const ogImageUrl = `${baseUrl}earn/api/og/vaults-list?tvl=${tvlFormatted}&protocols=${protocolsSupported.length}`

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
