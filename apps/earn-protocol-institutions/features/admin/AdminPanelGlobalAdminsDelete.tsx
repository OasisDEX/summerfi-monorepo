import { Card, Text } from '@summerfi/app-earn-ui'

import {
  rootAdminActionDeleteGlobalAdmin,
  rootAdminActionGetGlobalAdminData,
} from '@/app/server-handlers/admin/user'
import { ConfirmDeleteForm } from '@/features/admin/ConfirmDeleteForm'

import styles from './AdminPanelUsers.module.css'

const DeleteUserForm = ({
  globalAdmin,
}: {
  globalAdmin: Awaited<ReturnType<typeof rootAdminActionGetGlobalAdminData>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editUserFormWrapper}>
        <Text variant="h4">Delete Global admin</Text>
        <Text variant="p3">
          Deleting the GLOBAL ADMIN will remove: the DB entry in our DB and the cognito user pool
          entry.
        </Text>
        {/* Privileged account → require typing the username to confirm. */}
        <ConfirmDeleteForm
          action={rootAdminActionDeleteGlobalAdmin}
          className={styles.editUserForm}
          confirmation={{ mode: 'type', match: globalAdmin.cognitoUserName ?? '' }}
          submitLabel={<>Delete&nbsp;User</>}
          pendingLabel={<>Deleting&nbsp;Global&nbsp;admin...</>}
          pendingToast="Deleting global admin..."
          backHref="/admin/global-admins"
        >
          <input type="hidden" name="userSub" value={globalAdmin.userSub} />
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                User name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={globalAdmin.cognitoUserName}
                disabled
                required
                placeholder="internal-name"
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="displayName" className={styles.formLabel}>
                Name
              </label>
              <input
                id="displayName"
                name="displayName"
                defaultValue={globalAdmin.cognitoName}
                disabled
                required
                placeholder="Human Friendly Name"
              />
            </div>
          </div>
        </ConfirmDeleteForm>
      </div>
    </Card>
  )
}

export const AdminPanelGlobalAdminsDelete = async ({ userDbId }: { userDbId: string }) => {
  if (!userDbId || isNaN(Number(userDbId))) {
    throw new Error('userDbId is required')
  }
  const globalAdmin = await rootAdminActionGetGlobalAdminData(Number(userDbId))

  return (
    <div className={styles.adminPanelUsers}>
      <DeleteUserForm globalAdmin={globalAdmin} />
    </div>
  )
}
