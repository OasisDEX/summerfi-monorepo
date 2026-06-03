'use client'

import { useInstitutionTvlChartQuery } from '@/features/panels/overview/api/get-institution-tvl-chart-data'
import { TvlChartIntermediary } from '@/features/panels/overview/components/PanelInstitutionOverview/TvlChartIntermediary'
import { useInView } from '@/hooks/use-in-view'

// Defers the (O(n)-per-vault) TVL + NAV performance fetch off the server render path: the query
// only fires once this block scrolls into view, and TvlChartIntermediary shows its spinner until
// the data arrives. The IntersectionObserver ref sits on the wrapper, which is always rendered.
export const LazyTvlChart = ({ institutionName }: { institutionName: string }) => {
  const { ref, isInView } = useInView<HTMLDivElement>()
  const { data, isLoading } = useInstitutionTvlChartQuery(institutionName, isInView)

  const chartData = data ?? undefined

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <TvlChartIntermediary
        vaultsTvlChartData={chartData?.tvlChartData}
        vaultsNavChartData={chartData?.navChartData}
        isLoading={!isInView || isLoading}
      />
    </div>
  )
}
