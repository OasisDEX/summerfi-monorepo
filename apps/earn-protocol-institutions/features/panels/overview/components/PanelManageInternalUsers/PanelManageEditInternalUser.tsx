import { Card, Text } from '@summerfi/app-earn-ui'

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
  institutionId: string
  session: SessionPayload
}

export const PanelManageEditInternalUser = ({
  user,
  institutionId,
  session,
}: PanelManageEditInternalUserProps) => {
  const { canManageUsers } = getUserPrivileges(session, institutionId)

  return (
    <Card
      variant="cardSecondary"
      className={panelManageInternalUsersStyles.panelManageInternalUsersWrapper}
    >
      <Text variant="h2">Editing user</Text>
      <div
        className={panelManageInternalUsersStyles.usersSection}
        style={{
          whiteSpace: 'pre-wrap',
        }}
      >
        {JSON.stringify({ canManageUsers, user }, null, 2)}
      </div>
    </Card>
  )
}
