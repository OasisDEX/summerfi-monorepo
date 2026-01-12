'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import {
  BASIC_TOAST_CONFIG,
  Card,
  ERROR_TOAST_CONFIG,
  SUCCESS_TOAST_CONFIG,
} from '@summerfi/app-earn-ui'
import { useRouter } from 'next/navigation'

import { FormSubmitButton } from '@/components/molecules/FormSubmitButton/FormSubmitButton'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

export const EditUserForm = ({
  institutionName,
  action,
  user,
}: {
  institutionName: string
  action: (_prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>
  user: {
    userSub: string
    cognitoName: string | undefined
    role: string | null | undefined
    institutionId: number
  }
}) => {
  const [state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)
  const toastIdRef = useRef<string | number | null>(null)
  const { push } = useRouter()

  useEffect(() => {
    if (isPending) {
      toastIdRef.current = toast.info('Editing user...', {
        ...BASIC_TOAST_CONFIG,
        autoClose: false,
      })
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
      toastIdRef.current = null
    }
  }, [isPending])

  useEffect(() => {
    if (state?.success) {
      toast.success('User edited successfully!', SUCCESS_TOAST_CONFIG)
      formRef.current?.reset()
      push(`/${institutionName}/overview/manage-internal-users`)
    } else if (state?.error) {
      toast.error(state.error, ERROR_TOAST_CONFIG)
    }
  }, [state, institutionName, push])

  return (
    <Card variant="cardPrimary">
      <form
        ref={formRef}
        action={formAction}
        className={panelManageInternalUsersStyles.editUserForm}
      >
        <input type="hidden" name="userSub" value={user.userSub} />
        <input type="hidden" name="institutionId" value={user.institutionId} />
        <div className={panelManageInternalUsersStyles.formFields}>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="name" className={panelManageInternalUsersStyles.formLabel}>
              Full name
            </label>
            <input name="name" placeholder="Full name" required defaultValue={user.cognitoName} />
          </div>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="role" className={panelManageInternalUsersStyles.formLabel}>
              Role
            </label>
            <select name="role" defaultValue={user.role ?? ''} required>
              <option value="" disabled hidden>
                Select role
              </option>
              <option value="RoleAdmin">RoleAdmin</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
        <FormSubmitButton
          className={panelManageInternalUsersStyles.submitButton}
          pendingLabel={<>Editing&nbsp;User...</>}
          label={<>Edit&nbsp;User</>}
        />
      </form>
    </Card>
  )
}
