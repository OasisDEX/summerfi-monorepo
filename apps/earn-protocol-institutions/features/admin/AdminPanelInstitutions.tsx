import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import {
  rootAdminActionCreateInstitution,
  rootAdminActionGetInstitutionsList,
} from '@/app/server-handlers/admin/institution'
import { institutionsAdminPanelColumns } from '@/features/admin/constants'
import {
  institutionsAdminPanelDisplayRow,
  institutionsAdminPanelGetLogoSrc,
} from '@/features/admin/helpers'

import styles from './AdminPanelInstitutions.module.css'

const AddInstitutionForm = () => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.addInstitutionFormWrapper}>
        <Text variant="h4">Add Institution</Text>
        <form action={rootAdminActionCreateInstitution} className={styles.addInstitutionForm}>
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                Name
              </label>
              <input id="name" name="name" required placeholder="internal-name" />
            </div>

            <div className={styles.formField}>
              <label htmlFor="displayName" className={styles.formLabel}>
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                required
                placeholder="Human Friendly Name"
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="logoUrl" className={styles.formLabel}>
                Logo URL (optional)
              </label>
              <input id="logoUrl" name="logoUrl" type="url" placeholder="https://..." />
            </div>

            <div className={styles.formField}>
              <label htmlFor="logoFile" className={styles.formLabel}>
                Logo File (optional)
              </label>
              <input id="logoFile" name="logoFile" type="file" accept="image/*" />
            </div>
          </div>

          <Button
            variant="primarySmall"
            type="submit"
            style={{ alignSelf: 'flex-start' }}
            className={styles.submitButton}
          >
            Add&nbsp;Institution
          </Button>
        </form>
      </div>
    </Card>
  )
}

const InstitutionsListTable = ({
  institutions,
}: {
  institutions: Awaited<ReturnType<typeof rootAdminActionGetInstitutionsList>>
}) => {
  return (
    <div className={styles.institutionsListWrapper}>
      {institutions.length === 0 ? (
        <Text>No institutions found.</Text>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {institutionsAdminPanelColumns.map(({ label, accessor }) => (
                  <th key={accessor} className={styles.tableTh}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {institutions.map((row) => {
                const key = row.id
                const logo = institutionsAdminPanelGetLogoSrc(row.logoFile)

                return (
                  <tr key={key}>
                    {institutionsAdminPanelColumns.map(({ accessor }) => {
                      return (
                        <td key={accessor} className={styles.tableTd}>
                          <div className={styles.tableTdContent}>
                            {accessor === 'displayName' ? (
                              logo ? (
                                <Image
                                  src={logo}
                                  alt={institutionsAdminPanelDisplayRow(
                                    (row as { [key: string]: unknown })[accessor],
                                  )}
                                  className={styles.logo}
                                  width={32}
                                  height={32}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                  }}
                                />
                              )
                            ) : null}
                            {accessor === 'displayName' && !logo && row.logoUrl && (
                              <Image
                                src={row.logoUrl}
                                alt={institutionsAdminPanelDisplayRow(
                                  (row as { [key: string]: unknown })[accessor],
                                )}
                                className={styles.logo}
                                width={32}
                                height={32}
                              />
                            )}
                            {accessor === 'users' && (
                              <span className={styles.monospace}>{row[accessor].length}</span>
                            )}
                            {accessor === 'actions' && (
                              <div className={styles.actions}>
                                <Link href={`/admin/institutions/${row.id}/edit`}>
                                  <Button variant="textPrimarySmall">Edit</Button>
                                </Link>
                                <Link href={`/admin/institutions/${row.id}/delete`}>
                                  <Button variant="textSecondarySmall">Delete</Button>
                                </Link>
                              </div>
                            )}
                            {accessor !== 'users' && accessor !== 'actions' && (
                              <span
                                className={
                                  accessor === 'id' || accessor === 'name' ? styles.monospace : ''
                                }
                              >
                                {institutionsAdminPanelDisplayRow(
                                  (row as { [key: string]: unknown })[accessor],
                                  accessor,
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
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

export const AdminPanelInstitutions = async () => {
  const institutions = await rootAdminActionGetInstitutionsList()

  return (
    <div className={styles.adminPanelInstitutions}>
      <InstitutionsListTable institutions={institutions} />
      <AddInstitutionForm />
    </div>
  )
}
