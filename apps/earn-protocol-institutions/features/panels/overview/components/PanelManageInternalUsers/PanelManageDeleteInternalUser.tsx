import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { removeInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { type SessionPayload } from '@/features/auth/types'
import { getUserPrivileges } from '@/features/user/get-user-privileges'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

type PanelManageDeleteInternalUserProps = {
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

export const PanelManageDeleteInternalUser = ({
  user,
  institutionName,
  session,
}: PanelManageDeleteInternalUserProps) => {
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
      <Text variant="h2">Deleting user</Text>
      <form action={removeInstitutionUser} className={panelManageInternalUsersStyles.editUserForm}>
        <div className={panelManageInternalUsersStyles.formFields}>
          <input type="hidden" name="userSub" value={user.userSub} />
          <input type="hidden" name="institutionName" value={institutionName} />
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="name" className={panelManageInternalUsersStyles.formLabel}>
              Email
            </label>
            <input id="email" name="email" defaultValue={user.cognitoEmail} disabled required />
          </div>

          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="displayName" className={panelManageInternalUsersStyles.formLabel}>
              Name
            </label>
            <input
              id="displayName"
              name="displayName"
              defaultValue={user.cognitoName}
              disabled
              required
              placeholder="Human Friendly Name"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button
            variant="primarySmall"
            type="submit"
            style={{ alignSelf: 'flex-start' }}
            className={panelManageInternalUsersStyles.submitButton}
          >
            Delete&nbsp;User
          </Button>
          <Link href={`/${institutionName}/overview/manage-internal-users`}>
            <Button variant="secondarySmall">Go back</Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}
