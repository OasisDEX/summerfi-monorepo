'use client'

import { type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@summerfi/app-earn-ui'

export function FormSubmitButton({
  className,
  pendingLabel,
  label,
  disabled,
}: {
  className?: string
  pendingLabel: ReactNode
  label?: ReactNode
  // Lets a caller gate submission on its own state (e.g. a confirmation checkbox / type-to-confirm)
  // on top of the built-in pending lock.
  disabled?: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      variant="primarySmall"
      type="submit"
      className={className}
      disabled={pending || disabled}
    >
      {pending ? pendingLabel : (label ?? 'Submit')}
    </Button>
  )
}
