import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { getInstitutionsList } from '@/app/server-handlers/admin/institution'
import { createUser, getUsersList } from '@/app/server-handlers/admin/user'
import { usersAdminPanelColumns } from '@/features/admin/constants'
import { institutionsAdminPanelDisplayRow } from '@/features/admin/helpers'

import styles from './AdminPanelUsers.module.css'

const AddUserForm = ({
  institutions,
}: {
  institutions: Awaited<ReturnType<typeof getInstitutionsList>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.addUserFormContainer}>
        <Text variant="h4">Add user</Text>
        <form action={createUser} className={styles.addUserForm}>
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input name="email" type="email" placeholder="Email" required />
            </div>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                Full name
              </label>
              <input name="name" placeholder="Full name" required />
            </div>
            <div className={styles.formField}>
              <label htmlFor="role" className={styles.formLabel}>
                Role
              </label>
              <select name="role" defaultValue="Viewer">
                <option value="RoleAdmin">RoleAdmin</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label htmlFor="institutionId" className={styles.formLabel}>
                Institution
              </label>
              <select name="institutionId" required defaultValue="">
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
          <Button variant="primarySmall" type="submit" className={styles.addUserButton}>
            Add&nbsp;User
          </Button>
        </form>
      </div>
    </Card>
  )
}

const UsersList = ({ users }: { users: Awaited<ReturnType<typeof getUsersList>>['users'] }) => {
  return (
    <div className={styles.usersSection}>
      {users.length === 0 ? (
        <Text>No users found.</Text>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {usersAdminPanelColumns.map((col) => (
                  <th key={col.accessor} className={styles.tableHeader}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((row) => {
                const key = `${row.userSub}-${row.id}`

                return (
                  <tr key={key}>
                    {usersAdminPanelColumns.map(({ accessor }) => (
                      <td key={accessor} className={styles.tableCell}>
                        <div className={styles.tableCellContent}>
                          {accessor === 'institutionId' && row.institutionDisplayName}
                          {accessor === 'actions' && (
                            <>
                              <Link href={`/admin/users/${row.id}/edit`}>
                                <Button variant="textPrimarySmall">Edit</Button>
                              </Link>
                              <Link href={`/admin/users/${row.id}/delete`}>
                                <Button variant="textPrimarySmall">Delete</Button>
                              </Link>
                            </>
                          )}
                          {institutionsAdminPanelDisplayRow(
                            (row as { [key: string]: unknown })[accessor],
                            accessor,
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export const AdminPanelUsers = async () => {
  const [{ users }, institutions] = await Promise.all([getUsersList(), getInstitutionsList()])

  return (
    <div className={styles.container}>
      <UsersList users={users} />
      <AddUserForm institutions={institutions} />
    </div>
  )
}
