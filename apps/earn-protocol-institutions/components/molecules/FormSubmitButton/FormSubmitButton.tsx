'use client'

import { type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@summerfi/app-earn-ui'

export function FormSubmitButton({
  className,
  pendingLabel,
  label,
}: {
  className?: string
  pendingLabel: ReactNode
  label?: ReactNode
}) {
  const { pending } = useFormStatus()

  return (
    <Button variant="primarySmall" type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : label ?? 'Submit'}
    </Button>
  )
}
