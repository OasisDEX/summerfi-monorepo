import { Button, Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { getInstitutionData, updateInstitution } from '@/app/server-handlers/admin/institution'

import styles from './AdminPanelInstitutions.module.css'

const UpdateInstitutionForm = ({
  institution,
}: {
  institution: Awaited<ReturnType<typeof getInstitutionData>>
}) => {
  return (
    <Card variant="cardGradientDark">
      <div className={styles.editInstitutionFormWrapper}>
        <Text variant="h4">Update Institution</Text>
        <form action={updateInstitution} className={styles.editInstitutionForm}>
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
                required
                placeholder="Human Friendly Name"
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="logoUrl" className={styles.formLabel}>
                Logo URL (optional)
              </label>
              <input
                id="logoUrl"
                name="logoUrl"
                defaultValue={institution?.logoUrl}
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="logoFile" className={styles.formLabel}>
                Logo File <br />
                <small>(override the current logo, optional)</small>
              </label>
              <input id="logoFile" name="logoFile" type="file" accept="image/*" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button
              variant="primarySmall"
              type="submit"
              style={{ alignSelf: 'flex-start' }}
              className={styles.submitButton}
            >
              Update&nbsp;Institution
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

export const AdminPanelInstitutionsUpdate = async ({
  institutionDbId,
}: {
  institutionDbId: string
}) => {
  if (!institutionDbId || isNaN(Number(institutionDbId))) {
    throw new Error('institutionDbId is required')
  }
  const institution = await getInstitutionData(Number(institutionDbId))

  return (
    <div className={styles.adminPanelInstitutions}>
      <UpdateInstitutionForm institution={institution} />
    </div>
  )
}
