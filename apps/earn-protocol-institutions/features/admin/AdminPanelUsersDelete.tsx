import { Card, Text } from '@summerfi/app-earn-ui'

import {
  rootAdminActionDeleteWholeUser,
  rootAdminActionGetUserData,
} from '@/app/server-handlers/admin/user'
import { ConfirmDeleteForm } from '@/features/admin/ConfirmDeleteForm'

import styles from './AdminPanelUsers.module.css'

const DeleteUserForm = ({
  user,
}: {
  user: Awaited<ReturnType<typeof rootAdminActionGetUserData>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editUserFormWrapper}>
        <Text variant="h4">Delete User</Text>
        <Text variant="p3">
          Deleting the user will remove: the DB entry in our DB and the cognito user pool entry.
        </Text>
        <ConfirmDeleteForm
          action={rootAdminActionDeleteWholeUser}
          className={styles.editUserForm}
          confirmation={{
            mode: 'check',
            label: 'I understand this permanently deletes the user from the database and Cognito.',
          }}
          submitLabel={<>Delete&nbsp;User</>}
          pendingLabel={<>Deleting&nbsp;User...</>}
          pendingToast="Deleting user..."
          backHref="/admin/users"
        >
          <input type="hidden" name="userSub" value={user.userSub} />
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                User name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={user.cognitoUserName}
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
                defaultValue={user.cognitoName}
                disabled
                required
                placeholder="Human Friendly Name"
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="institutionId" className={styles.formLabel}>
                Institution ID
              </label>
              <input
                id="institutionId"
                name="institutionId"
                defaultValue={user.institutionId}
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

export const AdminPanelUsersDelete = async ({ userDbId }: { userDbId: string }) => {
  if (!userDbId || isNaN(Number(userDbId))) {
    throw new Error('userDbId is required')
  }
  const user = await rootAdminActionGetUserData(Number(userDbId))

  return (
    <div className={styles.adminPanelUsers}>
      <DeleteUserForm user={user} />
    </div>
  )
}
