import { type FC } from 'react'
import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseQueryStringServerSide, parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'
import { parseProtocolFilter } from '@/features/rebalance-activity/table/filters/mappers'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface RebalanceActivityPageProps {
  searchParams: ReadonlyURLSearchParams
}

const RebalanceActivityPage: FC<RebalanceActivityPageProps> = async (props) => {
  const { searchParams } = await props

  const parsedSearchParams = await parseQueryStringServerSide({ searchParams })
  const [{ vaults }, rebalanceActivity, configRaw] = await Promise.all([
    getVaultsList(),
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 50,
      protocols: parseProtocolFilter(parsedSearchParams.protocols),
      strategies: parsedSearchParams.strategies,
      tokens: parsedSearchParams.tokens,
    }),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
    })(),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  return (
    <RebalanceActivityView
      vaultsList={vaultsWithConfig}
      rebalanceActivity={rebalanceActivity}
      searchParams={parsedSearchParams}
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
