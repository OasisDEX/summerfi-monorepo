import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import {
  rootAdminActionDeleteInstitution,
  rootAdminActionGetInstitutionData,
} from '@/app/server-handlers/admin/institution'

import styles from './AdminPanelInstitutions.module.css'

const DeleteInstitutionForm = ({
  institution,
}: {
  institution: Awaited<ReturnType<typeof rootAdminActionGetInstitutionData>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editInstitutionFormWrapper}>
        <Text variant="h4">Delete Institution</Text>
        <Text variant="p3">
          Deleting the institution will remove: the institution itself and all of the users added to
          that institution (from the DB and cognito user pool)
        </Text>
        <form action={rootAdminActionDeleteInstitution} className={styles.editInstitutionForm}>
          <div className={styles.formFields}>
            <input type="hidden" name="id" value={institution?.id} />
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>
                Name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={institution?.name}
                disabled
                required
                placeholder="internal-name"
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="displayName" className={styles.formLabel}>
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                defaultValue={institution?.displayName}
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
              Delete&nbsp;Institution
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

export const AdminPanelInstitutionsDelete = async ({
  institutionDbId,
}: {
  institutionDbId: string
}) => {
  if (!institutionDbId || isNaN(Number(institutionDbId))) {
    throw new Error('institutionDbId is required')
  }
  const institution = await rootAdminActionGetInstitutionData(Number(institutionDbId))

  return (
    <div className={styles.adminPanelInstitutions}>
      <DeleteInstitutionForm institution={institution} />
    </div>
  )
}
