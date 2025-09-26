import { Button, Card, Text } from '@summerfi/app-earn-ui'
import { type UserRole } from '@summerfi/summer-protocol-institutions-db'
import Link from 'next/link'

import { updateInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { type SessionPayload } from '@/features/auth/types'
import { getUserPrivileges } from '@/features/user/get-user-privileges'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

type PanelManageEditInternalUserProps = {
  user: {
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
  }
  institutionName: string
  session: SessionPayload
}

export const PanelManageEditInternalUser = ({
  user,
  institutionName,
  session,
}: PanelManageEditInternalUserProps) => {
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
      <Text variant="h2">Editing user</Text>
      <Card variant="cardPrimaryMediumPaddings">
        <form
          action={updateInstitutionUser}
          className={panelManageInternalUsersStyles.editUserForm}
        >
          <input type="hidden" name="userSub" value={user.userSub} />
          <input type="hidden" name="institutionId" value={user.institutionId} />
          <div className={panelManageInternalUsersStyles.formFields}>
            <div className={panelManageInternalUsersStyles.formField}>
              <label htmlFor="name" className={panelManageInternalUsersStyles.formLabel}>
                Full name
              </label>
              <input name="name" placeholder="Full name" required defaultValue={user.cognitoName} />
            </div>
            <div className={panelManageInternalUsersStyles.formField}>
              <label htmlFor="role" className={panelManageInternalUsersStyles.formLabel}>
                Role
              </label>
              <select name="role" defaultValue={user.role as UserRole}>
                <option value="RoleAdmin">RoleAdmin</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button
              variant="primarySmall"
              type="submit"
              style={{ alignSelf: 'flex-start' }}
              className={panelManageInternalUsersStyles.submitButton}
            >
              Update&nbsp;User
            </Button>
            <Link href={`/${institutionName}/overview/manage-internal-users`}>
              <Button variant="secondarySmall">Go&nbsp;back</Button>
            </Link>
          </div>
        </form>
      </Card>
    </Card>
  )
}
