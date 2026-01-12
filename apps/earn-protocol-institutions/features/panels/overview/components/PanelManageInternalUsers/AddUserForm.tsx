'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import {
  BASIC_TOAST_CONFIG,
  Card,
  ERROR_TOAST_CONFIG,
  SUCCESS_TOAST_CONFIG,
} from '@summerfi/app-earn-ui'

import { FormSubmitButton } from '@/components/molecules/FormSubmitButton/FormSubmitButton'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

export const AddUserForm = ({
  institutionName,
  action,
}: {
  institutionName: string
  action: (_prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>
}) => {
  const [state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)
  const toastIdRef = useRef<string | number | null>(null)

  useEffect(() => {
    if (isPending) {
      toastIdRef.current = toast.info('Adding user...', { ...BASIC_TOAST_CONFIG, autoClose: false })
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
      toastIdRef.current = null
    }
  }, [isPending])

  useEffect(() => {
    if (state?.success) {
      toast.success('User added successfully!', SUCCESS_TOAST_CONFIG)
      formRef.current?.reset()
    } else if (state?.error) {
      toast.error(state.error, ERROR_TOAST_CONFIG)
    }
  }, [state])

  return (
    <Card variant="cardPrimary">
      <form
        ref={formRef}
        action={formAction}
        className={panelManageInternalUsersStyles.addUserForm}
      >
        <input type="hidden" name="institutionName" value={institutionName} />
        <div className={panelManageInternalUsersStyles.formFields}>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="email" className={panelManageInternalUsersStyles.formLabel}>
              Email
            </label>
            <input name="email" type="email" placeholder="Email" required />
          </div>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="name" className={panelManageInternalUsersStyles.formLabel}>
              Full name
            </label>
            <input name="name" placeholder="Full name" required />
          </div>
          <div className={panelManageInternalUsersStyles.formField}>
            <label htmlFor="role" className={panelManageInternalUsersStyles.formLabel}>
              Role
            </label>
            <select name="role" defaultValue="Viewer">
              <option value="RoleAdmin">RoleAdmin</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
        <FormSubmitButton
          className={panelManageInternalUsersStyles.submitButton}
          pendingLabel={<>Adding&nbsp;User...</>}
          label={<>Add&nbsp;User</>}
        />
      </form>
    </Card>
  )
}
