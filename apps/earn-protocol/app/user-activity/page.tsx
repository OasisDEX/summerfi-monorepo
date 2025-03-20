import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { getPaginatedUsersActivities } from '@/app/server-handlers/tables-data/users-activities/api'
import { UserActivityView } from '@/features/user-activity/components/UserActivityView/UserActivityView'

interface UserActivityPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const UserActivityPage: FC<UserActivityPageProps> = async ({ searchParams }) => {
  const searchParamsResolved = await searchParams

  const searchParamsParsed = await parseQueryStringServerSide({
    searchParams: searchParamsResolved,
  })

  const tokens = searchParamsParsed.tokens ?? []
  const strategies = searchParamsParsed.strategies ?? []

  const [{ vaults }, topDepositors, usersActivities] = await Promise.all([
    getVaultsList(),
    getPaginatedTopDepositors({
      page: 1,
      limit: 50,
      tokens,
      strategies,
    }),
    getPaginatedUsersActivities({
      page: 1,
      limit: 50,
      tokens,
      strategies,
    }),
  ])

  return (
    <UserActivityView
      vaultsList={vaults}
      usersActivities={usersActivities}
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

export default UserActivityPage
