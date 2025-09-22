import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { addInstitutionUser } from '@/app/server-handlers/institution/institution-users'
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
  institutionName: string
  session: SessionPayload
}

export const PanelManageListInternalUsers = ({
  users,
  institutionName,
  session,
}: PanelManageListInternalUsersProps) => {
  const { canManageUsers } = getUserPrivileges(session, institutionName)

  if (!canManageUsers) {
    return (
      <Card
        variant="cardSecondary"
        className={panelManageInternalUsersStyles.panelManageInternalUsersWrapper}
      >
        <Text variant="h2">Manage Internal Users</Text>
        <div className={panelManageInternalUsersStyles.usersSection}>
          <Text>You do not have permission to view this page.</Text>
        </div>
      </Card>
    )
  }

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
                                      ? `/${institutionName}/overview/manage-internal-users/edit/${row.id}`
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
                                      ? `/${institutionName}/overview/manage-internal-users/delete/${row.id}`
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
      <Text variant="h3">Add user</Text>
      <form action={addInstitutionUser} className={panelManageInternalUsersStyles.addUserForm}>
        <input type="hidden" name="institutionName" value={institutionName} />
        <div className={panelManageInternalUsersStyles.formFields}>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="email" className={panelManageInternalUsersStyles.formLabel}>
              Email
            </label>
            <input name="email" type="email" placeholder="Email" required />
          </div>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="name" className={panelManageInternalUsersStyles.formLabel}>
              Full name
            </label>
            <input name="name" placeholder="Full name" required />
          </div>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="role" className={panelManageInternalUsersStyles.formLabel}>
              Role
            </label>
            <select name="role" defaultValue="Viewer">
              <option value="RoleAdmin">RoleAdmin</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
        <Button
          variant="primarySmall"
          type="submit"
          className={panelManageInternalUsersStyles.addUserButton}
        >
          Add&nbsp;User
        </Button>
      </form>
    </Card>
  )
}
