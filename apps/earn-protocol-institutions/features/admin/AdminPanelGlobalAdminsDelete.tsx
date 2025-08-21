import { Button, Card, Text } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'
import Link from 'next/link'

import { deleteGlobalAdmin, getGlobalAdminData } from '@/app/server-handlers/admin/user'

import styles from './AdminPanelUsers.module.css'

const DeleteUserForm = ({
  globalAdmin,
}: {
  globalAdmin: Awaited<ReturnType<typeof getGlobalAdminData>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editUserFormWrapper}>
        <Text variant="h4">Delete Global admin</Text>
        <Text variant="p3">
          Deleting the GLOBAL ADMIN will remove: the DB entry in our DB and the cognito user pool
          entry.
        </Text>
        <form action={deleteGlobalAdmin} className={styles.editUserForm}>
          <div className={styles.formFields}>
            <input type="hidden" name="userSub" value={globalAdmin.userSub} />
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
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button
              variant="primarySmall"
              type="submit"
              style={{ alignSelf: 'flex-start' }}
              className={styles.submitButton}
            >
              Delete&nbsp;User
            </Button>
            <Link href="/admin/institutions">
              <Button variant="secondarySmall">Go back</Button>
            </Link>
          </div>
        </form>
      </div>
    </Card>
  )
}

export const AdminPanelGlobalAdminsDelete = async ({ userDbId }: { userDbId: string }) => {
  if (!userDbId || isNaN(Number(userDbId))) {
    throw new Error('userDbId is required')
  }
  const globalAdmin = await unstableCache(getGlobalAdminData, [], {
    tags: [`globalAdmin:${userDbId}`],
  })(Number(userDbId))

  return (
    <div className={styles.adminPanelUsers}>
      <DeleteUserForm globalAdmin={globalAdmin} />
    </div>
  )
}
