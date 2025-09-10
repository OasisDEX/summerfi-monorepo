import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { createGlobalAdmin, getGlobalAdminsList } from '@/app/server-handlers/admin/user'
import { globalAdminsAdminPanelColumns } from '@/features/admin/constants'
import { institutionsAdminPanelDisplayRow } from '@/features/admin/helpers'

import styles from './AdminPanelUsers.module.css'

const AddGlobalAdminForm = () => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.addUserFormContainer}>
        <Text variant="h4">Add global admin</Text>
        <Text variant="p3">
          <Text variant="p3semi" as="span">
            &quot;With great power comes great responsibility&quot;
          </Text>{' '}
          is a proverb popularized by Spider-Man in Marvel comics, films, and related media.
          Introduced by Stan Lee, it originally appeared as a closing narration in the 1962 Amazing
          Fantasy #15, and was later attributed to Uncle Ben as advice to the young Peter Parker.
        </Text>
        <form action={createGlobalAdmin} className={styles.addUserForm}>
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
          </div>
          <Button variant="primarySmall" type="submit" className={styles.addUserButton}>
            Add&nbsp;Global&nbsp;Admin
          </Button>
        </form>
      </div>
    </Card>
  )
}

const AdminsList = ({
  admins,
}: {
  admins: Awaited<ReturnType<typeof getGlobalAdminsList>>['admins']
}) => {
  return (
    <div className={styles.usersSection}>
      {admins.length === 0 ? (
        <Text>No global admins found.</Text>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {globalAdminsAdminPanelColumns.map((col) => (
                  <th key={col.accessor} className={styles.tableHeader}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((row) => {
                const key = `${row.userSub}-${row.id}`

                return (
                  <tr key={key}>
                    {globalAdminsAdminPanelColumns.map(({ accessor }) => (
                      <td key={accessor} className={styles.tableCell}>
                        <div className={styles.tableCellContent}>
                          {accessor === 'actions' && (
                            <>
                              <Link href={`/admin/global-admins/${row.id}/edit`}>
                                <Button variant="textPrimarySmall">Edit</Button>
                              </Link>
                              <Link href={`/admin/global-admins/${row.id}/delete`}>
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

export const AdminPanelGlobalAdmins = async () => {
  const [{ admins }] = await Promise.all([getGlobalAdminsList()])

  return (
    <div className={styles.container}>
      <AdminsList admins={admins} />
      <AddGlobalAdminForm />
    </div>
  )
}
