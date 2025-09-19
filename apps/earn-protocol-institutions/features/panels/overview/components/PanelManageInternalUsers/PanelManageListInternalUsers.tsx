import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type SessionPayload } from '@/features/auth/types'
import { usersPanelColumns } from '@/features/panels/overview/components/PanelManageInternalUsers/constants'
import { institutionsInternalUsersDisplayRow } from '@/features/panels/overview/components/PanelManageInternalUsers/helpers'
import { getUserPrivileges } from '@/features/user/get-user-privileges'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

type PanelManageListInternalUsersProps = {
  users: {
    userSub: string
    cognitoEmail: string | undefined
    cognitoUserName: string | undefined
    cognitoName: string | undefined
    institutionId: number
    createdAt: Date
    id: number
    role: 'RoleAdmin' | 'SuperAdmin' | 'Viewer' | null
    name: string | null
    institutionDisplayName: string | null
  }[]
  institutionId: string
  session: SessionPayload
}

export const PanelManageListInternalUsers = ({
  users,
  institutionId,
  session,
}: PanelManageListInternalUsersProps) => {
  const { canManageUsers } = getUserPrivileges(session, institutionId)

  return (
    <Card
      variant="cardSecondary"
      className={panelManageInternalUsersStyles.panelManageInternalUsersWrapper}
    >
      <Text variant="h2">Manage Internal Users</Text>
      <div className={panelManageInternalUsersStyles.usersSection}>
        {users.length === 0 ? (
          <Text>No users found.</Text>
        ) : (
          <div className={panelManageInternalUsersStyles.tableContainer}>
            <table className={panelManageInternalUsersStyles.table}>
              <thead>
                <tr>
                  {usersPanelColumns.map((col) => (
                    <th key={col.accessor} className={panelManageInternalUsersStyles.tableHeader}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((row) => {
                  const key = `${row.userSub}-${row.id}`

                  return (
                    <tr key={key}>
                      {usersPanelColumns.map(({ accessor }) => (
                        <td key={accessor} className={panelManageInternalUsersStyles.tableCell}>
                          <div className={panelManageInternalUsersStyles.tableCellContent}>
                            {accessor === 'institutionId' && row.institutionDisplayName}
                            {accessor === 'actions' && (
                              <>
                                <Link
                                  href={
                                    canManageUsers
                                      ? `/${institutionId}/overview/manage-internal-users/edit/${row.id}`
                                      : '#'
                                  }
                                >
                                  <Button variant="textPrimarySmall" disabled={!canManageUsers}>
                                    Edit
                                  </Button>
                                </Link>
                                <Link
                                  href={
                                    canManageUsers
                                      ? `/${institutionId}/overview/manage-internal-users/delete/${row.id}`
                                      : '#'
                                  }
                                >
                                  <Button variant="textPrimarySmall" disabled={!canManageUsers}>
                                    Delete
                                  </Button>
                                </Link>
                              </>
                            )}
                            {institutionsInternalUsersDisplayRow(
                              (row as { [key: string]: unknown })[accessor],
                              accessor,
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
