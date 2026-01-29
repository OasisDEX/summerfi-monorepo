import { type TableColumn } from '@summerfi/app-earn-ui'

import { type ActiveUsersListColumns } from '@/features/panels/vaults/components/PanelUserAdmin/types'

export const whitelistedListColumns = [
  {
    key: 'address',
    title: 'Address',
  },
  {
    key: 'action',
    title: '',
  },
]
export const whitelistedAQListColumns = [
  {
    key: 'address',
    title: 'Address',
  },
  {
    key: 'action',
    title: '',
  },
]

export const activeUsersListColumns: TableColumn<ActiveUsersListColumns>[] = [
  {
    key: 'address',
    title: 'Address',
  },
  {
    key: 'tvl',
    title: 'TVL',
    sortable: true,
  },
  {
    key: 'first-deposit',
    title: 'First Deposit',
    sortable: true,
  },
  {
    key: 'last-activity',
    title: 'Last Activity',
    sortable: true,
  },
]
