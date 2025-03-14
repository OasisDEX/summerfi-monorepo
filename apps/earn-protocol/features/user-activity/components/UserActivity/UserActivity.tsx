'use client'
import { type FC } from 'react'
import { Card, TabBar, WithArrow } from '@summerfi/app-earn-ui'
import {
  type SDKNetwork,
  type SDKUsersActivityType,
  type UsersActivity,
  type VaultApyData,
} from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import Link from 'next/link'

import { TopDepositorsTable } from '@/features/user-activity/components/TopDepositorsTable/TopDepositorsTable'
import { UserActivityTable } from '@/features/user-activity/components/UserActivityTable/UserActivityTable'
import { UserActivityTab } from '@/features/user-activity/types/tabs'

interface UserActivityProps {
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  vaultId: string
  page: 'open' | 'manage'
  noHighlight?: boolean
  vaultApyData: VaultApyData
}

export const UserActivity: FC<UserActivityProps> = ({
  userActivity,
  topDepositors,
  vaultId,
  page,
  noHighlight,
  vaultApyData,
}) => {
  const userActivityHiddenColumns = {
    open: ['strategy', 'position'],
    manage: ['strategy', 'balance', 'position'],
  }[page]

  const [rawVaultId, network] = vaultId.split('-')

  const vaultApyUniqueId = `${rawVaultId}-${subgraphNetworkToId(network as SDKNetwork)}`

  const tabs = [
    {
      id: UserActivityTab.LATEST_ACTIVITY,
      label: 'Latest activity',
      content: (
        <UserActivityTable
          userActivityList={userActivity}
          hiddenColumns={userActivityHiddenColumns}
          rowsToDisplay={4}
          noHighlight={noHighlight}
        />
      ),
    },
    {
      id: UserActivityTab.TOP_DEPOSITORS,
      label: 'Top depositors',
      content: (
        <TopDepositorsTable
          topDepositorsList={topDepositors}
          hiddenColumns={['user', 'strategy', 'numberOfDeposits']}
          rowsToDisplay={4}
          vaultsApyData={{
            [vaultApyUniqueId]: vaultApyData,
          }}
        />
      ),
    },
  ]

  return (
    <Card style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TabBar
          tabs={tabs}
          textVariant="p3semi"
          tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
        />
        <Link href={`/user-activity?strategies=${vaultId}`} style={{ width: 'fit-content' }}>
          <WithArrow as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            View all depositors
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}
