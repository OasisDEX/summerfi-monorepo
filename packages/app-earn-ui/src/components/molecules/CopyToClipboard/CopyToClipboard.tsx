'use client'
import { type FC, type ReactNode } from 'react'

import { Button } from '@/components/atoms/Button/Button'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

interface CopyToClipboardProps {
  textToCopy: string // The text to be copied
  children: ReactNode
  tooltipText?: string // Tooltip message when hovering (optional)
  copiedText?: string // Tooltip message after copy (optional)
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({
  children,
  textToCopy,
  copiedText = 'Copied!',
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy text to clipboard:', error)
    }
  }

  return (
    <Tooltip
      tooltip={copiedText}
      triggerOnClick
      tooltipCardVariant="cardSecondarySmallPaddings"
      tooltipWrapperStyles={{ top: '20px' }}
    >
      <Button onClick={handleCopy} variant="unstyled">
        {children}
      </Button>
    </Tooltip>
  )
}
