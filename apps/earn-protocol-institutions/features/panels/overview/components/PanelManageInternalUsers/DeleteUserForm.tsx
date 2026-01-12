'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { BASIC_TOAST_CONFIG, Button, Card } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { FormSubmitButton } from '@/components/molecules/FormSubmitButton/FormSubmitButton'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

export const DeleteUserForm = ({
  institutionName,
  action,
  user,
}: {
  institutionName: string
  user: {
    userSub: string
    cognitoEmail: string | undefined
    cognitoName: string | undefined
  }
  action: (_prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>
}) => {
  const [_state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isPending) {
      toast.info('Deleting user...', {
        ...BASIC_TOAST_CONFIG,
      })
    }
  }, [isPending])

  return (
    <Card variant="cardPrimaryMediumPaddings">
      <form
        ref={formRef}
        action={formAction}
        className={panelManageInternalUsersStyles.removeUserForm}
      >
        <input type="hidden" name="institutionName" value={institutionName} />
        <div className={panelManageInternalUsersStyles.formFields}>
          <input type="hidden" name="userSub" value={user.userSub} />
          <input type="hidden" name="institutionName" value={institutionName} />
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="email" className={panelManageInternalUsersStyles.formLabel}>
              Email
            </label>
            <input id="email" name="email" defaultValue={user.cognitoEmail} disabled required />
          </div>

          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="displayName" className={panelManageInternalUsersStyles.formLabel}>
              Name
            </label>
            <input
              id="displayName"
              name="displayName"
              defaultValue={user.cognitoName}
              disabled
              required
              placeholder="Human Friendly Name"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <FormSubmitButton
            className={panelManageInternalUsersStyles.submitButton}
            pendingLabel={<>Deleting&nbsp;User...</>}
            label={<>Delete&nbsp;User</>}
          />
          <Link href={`/${institutionName}/overview/manage-internal-users`}>
            <Button variant="secondarySmall">Go&nbsp;back</Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}
