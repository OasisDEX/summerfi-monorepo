import { type FC } from 'react'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { YieldTrendView } from '@/features/yield-trend/components/YieldTrendView'

interface YieldTrendPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const YieldTrendPage: FC<YieldTrendPageProps> = ({ searchParams: _searchParams }) => {
  return <YieldTrendView />
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - Yield Trend`,
    description:
      'Compare the median DeFi yield to Lazy Summer AI-Optimized Yield. See how Lazy Summer Protocol outperforms the market with AI-powered yield optimization.',
  }
}

export default YieldTrendPage
