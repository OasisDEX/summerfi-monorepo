import { Button, Card, Text } from '@summerfi/app-earn-ui'
import { type UserRole } from '@summerfi/summer-protocol-institutions-db'
import Link from 'next/link'

import { adminGetInstitutionsList } from '@/app/server-handlers/admin/institution'
import { getUserData, updateUser } from '@/app/server-handlers/admin/user'

import styles from './AdminPanelUsers.module.css'

const UpdateUserForm = ({
  user,
  institutions,
}: {
  user: Awaited<ReturnType<typeof getUserData>>
  institutions: Awaited<ReturnType<typeof adminGetInstitutionsList>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editUserFormWrapper}>
        <Text variant="h4">Update User</Text>
        <form action={updateUser} className={styles.editUserForm}>
          <input type="hidden" name="userSub" value={user.userSub} />
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                Full name
              </label>
              <input name="name" placeholder="Full name" required defaultValue={user.cognitoName} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="role" className={styles.formLabel}>
                Role
              </label>
              <select name="role" defaultValue={user.role as UserRole}>
                <option value="RoleAdmin">RoleAdmin</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label htmlFor="institutionId" className={styles.formLabel}>
                Institution
              </label>
              <select name="institutionId" required defaultValue={user.institutionId}>
                <option value="" disabled>
                  Select institution
                </option>
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.displayName} (#{i.id})
                  </option>
                ))}
              </select>
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
            <Link href="/admin/users">
              <Button variant="secondarySmall">Go back</Button>
            </Link>
          </div>
        </form>
      </div>
    </Card>
  )
}

export const AdminPanelUsersUpdate = async ({ userDbId }: { userDbId: string }) => {
  if (!userDbId || isNaN(Number(userDbId))) {
    throw new Error('userDbId is required')
  }
  const [user, institutions] = await Promise.all([
    getUserData(Number(userDbId)),
    adminGetInstitutionsList(),
  ])

  return (
    <div className={styles.adminPanelUsers}>
      <UpdateUserForm user={user} institutions={institutions} />
    </div>
  )
}
