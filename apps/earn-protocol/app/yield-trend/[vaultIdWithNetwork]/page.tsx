import { type Metadata } from 'next'

import { YieldTrendPage } from '@/app/yield-trend/common/YieldTrendPage'

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - Yield Trend`,
    description:
      'Compare the median DeFi yield to Lazy Summer AI-Optimized Yield. See how Lazy Summer Protocol outperforms the market with AI-powered yield optimization.',
  }
}

export default YieldTrendPage
