import { type TableColumn } from '@summerfi/app-earn-ui'

import { type UserListColumns } from '@/features/panels/overview/components/PanelManageInternalUsers/types'

export const usersPanelColumns: TableColumn<UserListColumns>[] = [
  {
    title: 'Name',
    key: 'cognitoName',
  },
  {
    title: 'Email',
    key: 'cognitoEmail',
  },
  {
    title: 'Role',
    key: 'role',
  },
  {
    title: 'Created At',
    key: 'createdAt',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]
