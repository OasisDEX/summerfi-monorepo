import { Card, Text } from '@summerfi/app-earn-ui'

import { updateInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { type SessionPayload } from '@/features/auth/types'
import { EditUserForm } from '@/features/panels/overview/components/PanelManageInternalUsers/EditUserForm'
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
      <EditUserForm institutionName={institutionName} user={user} action={updateInstitutionUser} />
    </Card>
  )
}
