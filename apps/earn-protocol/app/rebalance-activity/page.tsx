import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'

interface RebalanceActivityPageProps {
  searchParams: ReadonlyURLSearchParams
}

const RebalanceActivityPage: FC<RebalanceActivityPageProps> = async (props) => {
  const { searchParams } = await props
  const [{ vaults }, { rebalances }] = await Promise.all([getVaultsList(), getGlobalRebalances()])

  return (
    <RebalanceActivityView
      vaultsList={vaults}
      rebalancesList={rebalances}
      searchParams={parseQueryStringServerSide({ searchParams })}
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - Global Rebalance Activity`,
    description:
      'Summer.fi delivers sustainably higher yields, optimized with AI, to help you earn more, save time, and reduce costs. Below are the strategy optimizations performed by our AI-powered keeper network.',
  }
}

export default RebalanceActivityPage
