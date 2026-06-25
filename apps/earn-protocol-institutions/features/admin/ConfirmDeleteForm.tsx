'use client'

import { type ReactNode, useActionState, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { BASIC_TOAST_CONFIG, Button, Input, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { FormSubmitButton } from '@/components/molecules/FormSubmitButton/FormSubmitButton'

/**
 * How the destructive submit is gated:
 *  - `type`: the admin must type `match` (e.g. the institution/user name) before the button enables —
 *    reserved for the highest-stakes, cascading deletes.
 *  - `check`: a single acknowledgement checkbox — proportionate for single-entity deletes.
 */
export type DeleteConfirmation = { mode: 'type'; match: string } | { mode: 'check'; label: string }

/**
 * Client wrapper for the root-admin destructive delete forms. Previously these were plain
 * server-component `<form action={serverAction}>`s with a bare submit button: one click fired an
 * irreversible (and, for institutions, cascading) delete with no confirmation, no disabled/pending
 * state (double-submit), and no feedback. This adds a confirmation gate, a pending lock + label, and
 * an in-progress toast, while leaving the server actions' redirect-on-completion contract untouched.
 * The read-only fields + hidden inputs the action reads are passed in as `children`.
 */
export const ConfirmDeleteForm = ({
  action,
  confirmation,
  submitLabel,
  pendingLabel,
  pendingToast,
  backHref,
  backLabel = 'Go back',
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>
  confirmation: DeleteConfirmation
  submitLabel: ReactNode
  pendingLabel: ReactNode
  pendingToast: string
  backHref: string
  backLabel?: string
  className?: string
  children: ReactNode
}) => {
  const [, formAction, isPending] = useActionState(async (_prev: null, formData: FormData) => {
    await action(formData)

    return null
  }, null)

  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isPending) {
      toast.info(pendingToast, { ...BASIC_TOAST_CONFIG })
    }
  }, [isPending, pendingToast])

  const isConfirmed =
    confirmation.mode === 'type'
      ? typed.trim().toLowerCase() === confirmation.match.trim().toLowerCase()
      : checked

  return (
    <form action={formAction} className={className}>
      {children}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {confirmation.mode === 'type' ? (
          <>
            <label htmlFor="confirm-delete-input">
              <Text as="span" variant="p3semi">
                Type <strong>{confirmation.match}</strong> to confirm
              </Text>
            </label>
            <Input
              id="confirm-delete-input"
              variant="dark"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={confirmation.match}
              autoComplete="off"
            />
          </>
        ) : (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <Text as="span" variant="p3">
              {confirmation.label}
            </Text>
          </label>
        )}
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
        <FormSubmitButton pendingLabel={pendingLabel} label={submitLabel} disabled={!isConfirmed} />
        <Link href={backHref}>
          <Button variant="secondarySmall">{backLabel}</Button>
        </Link>
      </div>
    </form>
  )
}
