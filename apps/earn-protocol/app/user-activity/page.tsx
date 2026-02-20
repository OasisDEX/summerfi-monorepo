import { type FC } from 'react'
import { parseQueryStringServerSide, parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { LatestActivityView } from '@/features/latest-activity/components/LatestActivityView/LatestActivityView'
import { parseLatestActivitySearchParams } from '@/features/latest-activity/helpers/parse-lastest-activity-search-params'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface LatestActivityPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const LatestActivityPage: FC<LatestActivityPageProps> = async ({ searchParams }) => {
  const searchParamsResolved = await searchParams

  const searchParamsParsed = await parseQueryStringServerSide({
    searchParams: searchParamsResolved,
  })

  const {
    tokens,
    strategies,
    topDepositorsSortBy,
    topDepositorsOrderBy,
    latestActivitySortBy,
    latestActivityOrderBy,
  } = parseLatestActivitySearchParams(searchParamsParsed)

  const [{ vaults }, topDepositors, latestActivity, configRaw] = await Promise.all([
    getCachedVaultsList(),
    getPaginatedTopDepositors({
      page: 1,
      limit: 50,
      tokens,
      strategies,
      sortBy: topDepositorsSortBy,
      orderBy: topDepositorsOrderBy,
      filterOutUsersAddresses: userAddresesToFilterOut,
    }),
    getPaginatedLatestActivity({
      page: 1,
      limit: 50,
      tokens,
      strategies,
      sortBy: latestActivitySortBy,
      orderBy: latestActivityOrderBy,
      filterOutUsersAddresses: userAddresesToFilterOut,
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
    <LatestActivityView
      vaultsList={vaultsWithConfig}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      searchParams={searchParamsParsed}
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - Global User Activity`,
    description:
      'A transparent view of global user activity for the Lazy Summer Protocol, showcasing the activity of all our users and access to their individual position pages.',
  }
}

export default LatestActivityPage
