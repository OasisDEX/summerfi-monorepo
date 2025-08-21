export const institutionsAdminPanelColumns = [
  {
    label: 'ID',
    accessor: 'id',
  },
  {
    label: 'Name',
    accessor: 'name',
  },
  {
    label: 'Display Name',
    accessor: 'displayName',
  },
  {
    label: 'Users',
    accessor: 'users',
  },
  {
    label: 'Created At',
    accessor: 'createdAt',
  },
  {
    label: 'Actions',
    accessor: 'actions',
  },
]

// Users admin panel
export type AdminPanelColumn<T> = {
  label: string
  accessor: keyof T & string
}

export type UserAdminTableRow = {
  id: number
  userSub: string
  cognitoUserName: string
  cognitoName: string
  institutionId: number
  role: string | null
  createdAt: Date
}

export const usersAdminPanelColumns: readonly AdminPanelColumn<UserAdminTableRow>[] = [
  { label: 'ID', accessor: 'id' },
  { label: 'Sub', accessor: 'userSub' },
  { label: 'User name', accessor: 'cognitoUserName' },
  { label: 'Name', accessor: 'cognitoName' },
  { label: 'Institution', accessor: 'institutionId' },
  { label: 'Role', accessor: 'role' },
  { label: 'Created At', accessor: 'createdAt' },
]
