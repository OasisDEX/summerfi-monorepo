import { Suspense } from 'react'
import { getPositionValues } from '@summerfi/app-earn-ui'
import { formatAddress, formatCryptoBalance, formatFiatBalance, zero } from '@summerfi/app-utils'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPortfolioCoreData } from '@/app/server-handlers/portfolio/get-portfolio-core-data'
import { resolvePortfolioContext } from '@/app/server-handlers/portfolio/resolve-portfolio-context'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { PortfolioPageViewLoadingState } from '@/components/layout/PortfolioPageView/PortfolioPageViewLoadingState'
import { getPortfolioCoreQueryKey } from '@/features/portfolio/api/portfolio-query-keys'
import { getServerQueryClient } from '@/helpers/get-server-query-client'
import { isValidAddress } from '@/helpers/is-valid-address'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const PortfolioWithData = async ({ walletAddress }: { walletAddress: string }) => {
  const queryClient = getServerQueryClient()

  // Only the core shell (positions + values, APY, carousel) is prefetched +
  // hydrated so the portfolio paints instantly from the server cache. Each position's historical
  // chart is intentionally left to its own client query, fetched per-position as the card scrolls
  // into view — see usePortfolioPositionHistoryQuery / LazyPositionHistoryChart.
  await queryClient.prefetchQuery({
    queryKey: getPortfolioCoreQueryKey(walletAddress),
    queryFn: () => getPortfolioCoreData({ walletAddress }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PortfolioPageViewComponent viewWalletAddress={walletAddress} />
    </HydrationBoundary>
  )
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress: walletAddressRaw } = await params
  const walletAddress = walletAddressRaw.toLowerCase()

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  // The await above only parses + validates the URL; the data prefetch lives inside the Suspense
  // boundary so the skeleton streams immediately while the prefetch resolves and streams in after.
  return (
    <Suspense fallback={<PortfolioPageViewLoadingState />}>
      <PortfolioWithData walletAddress={walletAddress} />
    </Suspense>
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

  // Reuses the shared resolver so the position->vault merge isn't duplicated here; the OG totals
  // below only need the merged positions, not the (deferred) historical charts.
  const { positionsWithVault } = await resolvePortfolioContext({ walletAddress })

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
