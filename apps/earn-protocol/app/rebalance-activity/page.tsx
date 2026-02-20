import { type FC } from 'react'
import { parseQueryStringServerSide, parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
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
    getCachedVaultsList(),
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 50,
      protocols: parseProtocolFilter(parsedSearchParams.protocols),
      strategies: parsedSearchParams.strategies,
      tokens: parsedSearchParams.tokens,
    }),
    getCachedConfig(),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
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
