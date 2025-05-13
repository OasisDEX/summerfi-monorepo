import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { LatestActivityView } from '@/features/latest-activity/components/LatestActivityView/LatestActivityView'

interface LatestActivityPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const LatestActivityPage: FC<LatestActivityPageProps> = async ({ searchParams }) => {
  const searchParamsResolved = await searchParams

  const searchParamsParsed = await parseQueryStringServerSide({
    searchParams: searchParamsResolved,
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const tokens = searchParamsParsed.tokens ?? []
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const strategies = searchParamsParsed.strategies ?? []

  const [{ vaults }, topDepositors, latestActivity] = await Promise.all([
    getVaultsList(),
    getPaginatedTopDepositors({
      page: 1,
      limit: 50,
      tokens,
      strategies,
      filterOutUsersAddresses: userAddresesToFilterOut,
    }),
    getPaginatedLatestActivity({
      page: 1,
      limit: 50,
      tokens,
      strategies,
      filterOutUsersAddresses: userAddresesToFilterOut,
    }),
  ])

  return (
    <LatestActivityView
      vaultsList={vaults}
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
