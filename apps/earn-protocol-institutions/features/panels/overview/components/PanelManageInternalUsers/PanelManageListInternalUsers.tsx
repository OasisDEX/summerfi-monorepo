import { useMemo } from 'react'
import { Button, Card, Table, type TableRow, Text } from '@summerfi/app-earn-ui'
import { type UserRole } from '@summerfi/summer-protocol-institutions-db'
import dayjs from 'dayjs'
import Link from 'next/link'

import { addInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { type SessionPayload } from '@/features/auth/types'
import { AddUserForm } from '@/features/panels/overview/components/PanelManageInternalUsers/AddUserForm'
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

const isTestInstitution = (institutionName: string) => institutionName === 'ExtDemoCorp'

const mangleIdentifier = (
  value: string | undefined,
  institutionName: string,
): string | undefined => {
  if (!value) return value
  if (!isTestInstitution(institutionName)) return value

  const isEmail = value.includes('@')

  if (!isEmail) {
    if (value.length <= 4) return value

    return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2)
  }

  const [local, domain] = value.split('@')

  if (!local || !domain) return value

  const domainParts = domain.split('.')

  if (domainParts.length < 2) return value

  const [root] = domainParts
  const tld = `.${domainParts.slice(1).join('.')}`

  const mangledLocal = local.length <= 2 ? local : local.slice(0, 2) + '*'.repeat(local.length - 2)

  const mangledRoot = root.length <= 2 ? root : root.slice(0, 2) + '*'.repeat(root.length - 2)

  return `${mangledLocal}@${mangledRoot}${tld}`
}

const mapUsersToTableRows: (
  users: PanelManageListInternalUsersProps['users'],
  institutionName: string,
  canManageUsers: boolean,
) => TableRow<UserListColumns>[] = (users, institutionName, canManageUsers) => {
  return users.map((user) => ({
    id: user.userSub,
    content: {
      cognitoName: mangleIdentifier(user.cognitoName, institutionName),
      cognitoEmail: (
        <TableCellRightAlign>
          {mangleIdentifier(user.cognitoEmail, institutionName)}
        </TableCellRightAlign>
      ),
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
          {isTestInstitution(institutionName) ? (
            <>
              <Link href={`/${institutionName}/overview/manage-internal-users`}>
                <Button variant="textSecondaryMedium" disabled>
                  Edit
                </Button>
              </Link>
              <Link href={`/${institutionName}/overview/manage-internal-users`}>
                <Button variant="textSecondaryMedium" disabled>
                  Delete
                </Button>
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
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
      {isTestInstitution(institutionName) && (
        <Text variant="p4semi" style={{ color: '#9ca3af' }}>
          You are viewing a test institution. Identifying information has been obfuscated.
        </Text>
      )}
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
      <AddUserForm institutionName={institutionName} action={addInstitutionUser} />
    </Card>
  )
}
