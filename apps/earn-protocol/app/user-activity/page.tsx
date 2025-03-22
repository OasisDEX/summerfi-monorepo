import { type FC } from 'react'
import { parseQueryStringServerSide, subgraphNetworkToId } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { UserActivityView } from '@/features/user-activity/components/UserActivityView/UserActivityView'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface UserActivityPageProps {
  searchParams: Promise<ReadonlyURLSearchParams>
}

const UserActivityPage: FC<UserActivityPageProps> = async ({ searchParams }) => {
  const searchParamsResolved = await searchParams
  const [{ vaults }, { usersActivity, totalUsers, topDepositors }, systemConfig] =
    await Promise.all([
      getVaultsList(),
      getUsersActivity({ filterTestingWallets: true }),
      systemConfigHandler(),
    ])

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig: systemConfig.config,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  return (
    <UserActivityView
      vaultsList={vaults}
      usersActivity={usersActivity}
      topDepositors={topDepositors}
      totalUsers={totalUsers}
      searchParams={parseQueryStringServerSide({ searchParams: searchParamsResolved })}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
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
