import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type ReadonlyURLSearchParams } from 'next/navigation'

// import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getTopDepositorsServerSide } from '@/app/server-handlers/tables-data/top-depositors/api'
import { getUsersActivitiesServerSide } from '@/app/server-handlers/tables-data/users-activities/api'
import { UserActivityView } from '@/features/user-activity/components/UserActivityView/UserActivityView'

interface UserActivityPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const UserActivityPage: FC<UserActivityPageProps> = async ({ searchParams }) => {
  const searchParamsResolved = await searchParams

  const searchParamsParsed = parseQueryStringServerSide({ searchParams: searchParamsResolved })

  const tokens = searchParamsParsed.tokens ?? []
  const strategies = searchParamsParsed.strategies ?? []

  const [{ vaults }, topDepositors, usersActivities] = await Promise.all([
    getVaultsList(),
    getTopDepositorsServerSide({
      page: 1,
      limit: 50,
      sortBy: 'balanceUsd',
      orderBy: 'desc',
      tokens,
      strategies,
    }).then((res) => res.json()),
    getUsersActivitiesServerSide({
      page: 1,
      limit: 50,
      sortBy: 'timestamp',
      orderBy: 'desc',
      tokens,
      strategies,
    }).then((res) => res.json()),
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

export default UserActivityPage
