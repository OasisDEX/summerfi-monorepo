import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { UserActivityView } from '@/features/user-activity/components/UserActivityView/UserActivityView'

interface UserActivityPageProps {
  searchParams: ReadonlyURLSearchParams
}

const UserActivityPage: FC<UserActivityPageProps> = async props => {
  const searchParams = await props.searchParams;
  const [{ vaults }, { usersActivity, totalUsers, topDepositors }] = await Promise.all([
    getVaultsList(),
    getUsersActivity(),
  ])

  return (
    <UserActivityView
      vaultsList={vaults}
      usersActivity={usersActivity}
      topDepositors={topDepositors}
      totalUsers={totalUsers}
      searchParams={parseQueryStringServerSide({ searchParams })}
    />
  )
}

export default UserActivityPage
