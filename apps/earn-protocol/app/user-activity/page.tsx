import { type FC } from 'react'
import { parseQueryStringServerSide } from '@summerfi/app-utils'
import { type ReadonlyURLSearchParams, redirect } from 'next/navigation'

import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { isPreLaunchVersion } from '@/constants/is-pre-launch-version'
import { UserActivityView } from '@/features/user-activity/components/UserActivityView/UserActivityView'

export const revalidate = 60

interface UserActivityPageProps {
  searchParams: ReadonlyURLSearchParams
}

const UserActivityPage: FC<UserActivityPageProps> = async ({ searchParams }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isPreLaunchVersion) {
    return redirect('/sumr')
  }
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
