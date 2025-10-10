import { useMemo } from 'react'
import { Button, Card, Table, type TableRow, Text } from '@summerfi/app-earn-ui'
import { type UserRole } from '@summerfi/summer-protocol-institutions-db'
import dayjs from 'dayjs'
import Link from 'next/link'

import { addInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { type SessionPayload } from '@/features/auth/types'
import { usersPanelColumns } from '@/features/panels/overview/components/PanelManageInternalUsers/constants'
import { type UserListColumns } from '@/features/panels/overview/components/PanelManageInternalUsers/types'
import { getUserPrivileges } from '@/features/user/get-user-privileges'
import { getUserRoleColor } from '@/helpers/get-user-role-color'

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
    role: UserRole | null
    name: string | null
    institutionDisplayName: string | null
  }[]
  institutionName: string
  session: SessionPayload
}

const TableCellRightAlign = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
)

const mapUsersToTableRows: (
  users: PanelManageListInternalUsersProps['users'],
  institutionName: string,
  canManageUsers: boolean,
) => TableRow<UserListColumns>[] = (users, institutionName, canManageUsers) => {
  return users.map((user) => ({
    id: user.userSub,
    content: {
      cognitoName: user.cognitoName,
      cognitoEmail: <TableCellRightAlign>{user.cognitoEmail}</TableCellRightAlign>,
      role: (
        <TableCellRightAlign>
          <span style={{ fontWeight: 'bold', color: getUserRoleColor(user.role as UserRole) }}>
            {user.role}
          </span>
        </TableCellRightAlign>
      ),
      createdAt: (
        <TableCellRightAlign>
          {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </TableCellRightAlign>
      ),
      actions: (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/${institutionName}/overview/manage-internal-users/edit/${user.id}`}>
            <Button variant="textSecondaryMedium" disabled={!canManageUsers}>
              Edit
            </Button>
          </Link>
          <Link href={`/${institutionName}/overview/manage-internal-users/delete/${user.id}`}>
            <Button variant="textSecondaryMedium" disabled={!canManageUsers}>
              Delete
            </Button>
          </Link>
        </div>
      ),
    },
  }))
}

export const PanelManageListInternalUsers = ({
  users,
  institutionName,
  session,
}: PanelManageListInternalUsersProps) => {
  const { canManageUsers } = getUserPrivileges(session, institutionName)
  const userPanelListRows = useMemo(
    () => mapUsersToTableRows(users, institutionName, canManageUsers),
    [users, institutionName, canManageUsers],
  )

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
      <Card variant="cardPrimarySmallPaddings">
        <div className={panelManageInternalUsersStyles.usersSection}>
          {users.length === 0 ? (
            <Text>No users found.</Text>
          ) : (
            <div className={panelManageInternalUsersStyles.tableContainer}>
              <Table rows={userPanelListRows} columns={usersPanelColumns} />
            </div>
          )}
        </div>
      </Card>
      <Text variant="h3">Add user</Text>
      <Card variant="cardPrimary">
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
    </Card>
  )
}
