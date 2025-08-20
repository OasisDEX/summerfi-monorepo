import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import {
  createInstitution,
  deleteInstitution,
  getInstitutionsList,
  updateInstitution,
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
        <form action={createInstitution} className={styles.addInstitutionForm}>
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

const RemoveInstitutionForm = () => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.removeInstitutionFormWrapper}>
        <Text variant="h4">Remove Institution</Text>
        <Text variant="p3">
          To prevent accidental deletions, please enter the internal institution ID (&quot;ID&quot;
          in the table) of the institution you want to remove.
        </Text>
        <form action={deleteInstitution} className={styles.removeInstitutionForm}>
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                ID
              </label>
              <input id="id" name="id" required placeholder="internal-id" />
            </div>
          </div>
          <Button variant="primarySmall" type="submit" className={styles.submitButton}>
            Remove Institution
          </Button>
        </form>
      </div>
    </Card>
  )
}

const UpdateInstitutionForm = ({
  institutions,
}: {
  institutions: Awaited<ReturnType<typeof getInstitutionsList>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editInstitutionFormWrapper}>
        <Text variant="h4">Update Institution</Text>
        <form action={updateInstitution} className={styles.editInstitutionForm}>
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label htmlFor="id" className={styles.formLabel}>
                ID
              </label>
              <select id="id" name="id" required>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </div>
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
            Update&nbsp;Institution
          </Button>
        </form>
      </div>
    </Card>
  )
}

const InstitutionsListTable = ({
  institutions,
}: {
  institutions: Awaited<ReturnType<typeof getInstitutionsList>>
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
                            {accessor === 'displayName' && logo && (
                              <Image
                                src={logo}
                                alt={institutionsAdminPanelDisplayRow(
                                  (row as { [key: string]: unknown })[accessor],
                                )}
                                className={styles.logo}
                                width={32}
                                height={32}
                              />
                            )}
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
                            {accessor === 'users' && row[accessor].length}
                            {institutionsAdminPanelDisplayRow(
                              (row as { [key: string]: unknown })[accessor],
                              accessor,
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
  const institutions = await getInstitutionsList()

  return (
    <div className={styles.adminPanelInstitutions}>
      <InstitutionsListTable institutions={institutions} />
      <AddInstitutionForm />
      <UpdateInstitutionForm institutions={institutions} />
      <RemoveInstitutionForm />
    </div>
  )
}
