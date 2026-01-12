'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'react-toastify'
import { Button, SUCCESS_TOAST_CONFIG } from '@summerfi/app-earn-ui'

export function FormSubmitButton({
  className,
  toastLabel,
  pendingLabel,
  label,
}: {
  className?: string
  toastLabel?: string
  pendingLabel: ReactNode
  label?: ReactNode
}) {
  const { pending } = useFormStatus()
  const [handlePending, setHandlePending] = useState(false)

  useEffect(() => {
    if (pending && !handlePending) {
      setHandlePending(true)
      if (toastLabel) {
        toast.info(toastLabel, {
          ...SUCCESS_TOAST_CONFIG,
        })
      }
    }
  }, [pending, handlePending, toastLabel])

  return (
    <Button variant="primarySmall" type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : label ?? 'Submit'}
    </Button>
  )
}
