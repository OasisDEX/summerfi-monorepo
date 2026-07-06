'use client'

import { getDisplayToken, SkeletonLine } from '@summerfi/app-earn-ui'
import { type TimeframesType, type TokenSymbolsList } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import dynamic from 'next/dynamic'

import { usePortfolioPositionHistoryQuery } from '@/features/portfolio/api/get-portfolio-position-history-data'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { useInView } from '@/hooks/use-in-view'

import historicalChartStyles from '@/components/organisms/Charts/components/Historical.module.css'

type LazyPositionHistoryChartProps = {
  walletAddress: string
  position: PositionWithVault
  timeframe: TimeframesType
}

// Mirrors the chart + legend layout of HistoricalChart so the loading state reads as a real graph
// section rather than an empty block.
const ChartLoadingSkeleton = () => (
  <div className={historicalChartStyles.historicalChartWrapper}>
    <SkeletonLine
      height={315}
      radius="var(--radius-roundish)"
      style={{ flex: 1, minWidth: 0, margin: '20px 24px 20px 0' }}
    />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--general-space-24)',
        flexShrink: 0,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--general-space-8)',
            alignItems: 'flex-start',
          }}
        >
          <SkeletonLine width={110} height={14} style={{ margin: '0 40px 0 40px' }} />
          <SkeletonLine width={140} height={22} style={{ margin: '0 40px 0 40px' }} />
        </div>
      ))}
    </div>
  </div>
)

// recharts (~100KB gzip) is only needed once this chart actually renders; keep it out of the
// portfolio route's initial JS and load it in its own chunk alongside the in-view-gated data fetch
// above. `loading` reuses the same skeleton shown while the data query is pending.
const PositionHistoricalChart = dynamic(
  () =>
    import('@/components/organisms/Charts/PositionHistoricalChart').then(
      (mod) => mod.PositionHistoricalChart,
    ),
  { ssr: false, loading: () => <ChartLoadingSkeleton /> },
)

// Renders the per-position historical chart, but only fetches its (heavy) history data once the
// card scrolls into view. The loaded chart is rendered WITHOUT an extra wrapper element so it stays
// a direct child of PortfolioPosition's flex `graphWrapper` — wrapping it collapses the recharts
// ResponsiveContainer width to 0 (the legend still shows, but the line chart goes blank). The
// IntersectionObserver ref therefore lives on the loading skeleton, which is all we need to trigger
// the fetch.
export const LazyPositionHistoryChart = ({
  walletAddress,
  position,
  timeframe,
}: LazyPositionHistoryChartProps) => {
  const { ref, isInView } = useInView<HTMLDivElement>()
  const network = supportedSDKNetwork(position.vault.protocol.network)

  const { data } = usePortfolioPositionHistoryQuery(
    walletAddress,
    network,
    position.vault.id,
    isInView,
  )

  if (data) {
    return (
      <PositionHistoricalChart
        chartData={data}
        position={position}
        timeframe={timeframe}
        tokenSymbol={getDisplayToken(position.vault.inputToken.symbol) as TokenSymbolsList}
      />
    )
  }

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ChartLoadingSkeleton />
    </div>
  )
}
