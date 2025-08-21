import { Button, Card, Text } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'
import Link from 'next/link'

import { getGlobalAdminData, updateGlobalAdmin } from '@/app/server-handlers/admin/user'

import styles from './AdminPanelUsers.module.css'

const UpdateGlobalAdminForm = ({
  globalAdmin,
}: {
  globalAdmin: Awaited<ReturnType<typeof getGlobalAdminData>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editUserFormWrapper}>
        <Text variant="h4">Update User</Text>
        <form action={updateGlobalAdmin} className={styles.editUserForm}>
          <input type="hidden" name="cognitoUserName" value={globalAdmin.cognitoUserName} />
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                Full name
              </label>
              <input
                name="name"
                placeholder="Full name"
                required
                defaultValue={globalAdmin.cognitoName}
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
              Update&nbsp;User
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

export const AdminPanelGlobalAdminsUpdate = async ({ userDbId }: { userDbId: string }) => {
  if (!userDbId || isNaN(Number(userDbId))) {
    throw new Error('userDbId is required')
  }
  const [globalAdmin] = await Promise.all([
    unstableCache(getGlobalAdminData, [], {
      tags: [`globalAdmin:${userDbId}`],
    })(Number(userDbId)),
  ])

  return (
    <div className={styles.adminPanelUsers}>
      <UpdateGlobalAdminForm globalAdmin={globalAdmin} />
    </div>
  )
}
