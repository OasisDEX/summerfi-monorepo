import { type FC, type ReactNode } from 'react'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import classNames from '@/components/organisms/Sidebar/Sidebar.module.scss'

interface SidebarProps {
  title: string
  content: ReactNode
  primaryButton: {
    label: string
    action?: () => void
    url?: string
    disabled?: boolean
    loading?: boolean
  } & ({ action: () => void; url?: never } | { action?: never; url: string })
  footnote?: ReactNode
}

export const Sidebar: FC<SidebarProps> = ({ title, content, primaryButton, footnote }) => {
  const labelElement = primaryButton.loading ? <LoadingSpinner size={28} /> : primaryButton.label

  return (
    <Card className={classNames.sidebarWrapper} variant="cardPrimary">
      <div className={classNames.sidebarHeaderWrapper}>
        <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
          {title}
        </Text>
      </div>

      <div className={classNames.sidebarHeaderSpacer} />
      {content}

      {primaryButton.action && (
        <Button
          variant="primaryLarge"
          style={{ marginBottom: 'var(--general-space-20)', width: '100%' }}
          onClick={primaryButton.action}
          disabled={primaryButton.disabled}
        >
          {labelElement}
        </Button>
      )}
      {primaryButton.url && (
        <Link href={primaryButton.url}>
          <Button
            variant="primaryLarge"
            style={{ marginBottom: 'var(--general-space-20)', width: '100%' }}
            disabled={primaryButton.disabled}
          >
            {labelElement}
          </Button>
        </Link>
      )}
      {footnote && <div className={classNames.sidebarFootnoteWrapper}>{footnote}</div>}
    </Card>
  )
}
