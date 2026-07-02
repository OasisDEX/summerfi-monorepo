import { Card, Text } from '@summerfi/app-earn-ui'

import {
  rootAdminActionDeleteInstitution,
  rootAdminActionGetInstitutionData,
} from '@/app/server-handlers/admin/institution'
import { ConfirmDeleteForm } from '@/features/admin/ConfirmDeleteForm'

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
        {/* Cascading + irreversible → require typing the institution name to confirm. */}
        <ConfirmDeleteForm
          action={rootAdminActionDeleteInstitution}
          className={styles.editInstitutionForm}
          confirmation={{ mode: 'type', match: institution?.name ?? '' }}
          submitLabel={<>Delete&nbsp;Institution</>}
          pendingLabel={<>Deleting&nbsp;Institution...</>}
          pendingToast="Deleting institution..."
          backHref="/admin/institutions"
        >
          <input type="hidden" name="id" value={institution?.id} />
          <div className={styles.formFields}>
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
        </ConfirmDeleteForm>
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
