import { type FC, type ReactNode } from 'react'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import sidebarClassNames from '@/components/organisms/Sidebar/Sidebar.module.scss'

export interface SidebarProps {
  title: string
  titleTabs?: string[]
  onTitleTabChange?: (tab: string) => void
  content: ReactNode
  primaryButton: {
    label: string
    action?: () => void
    url?: string
    disabled?: boolean
    loading?: boolean
  } & ({ action: () => void; url?: never } | { action?: never; url: string })
  footnote?: ReactNode
  error?: string | ReactNode
}

export const Sidebar: FC<SidebarProps> = ({
  title,
  titleTabs,
  content,
  primaryButton,
  footnote,
  error,
  onTitleTabChange,
}) => {
  const labelElement = primaryButton.loading ? <LoadingSpinner size={28} /> : primaryButton.label

  return (
    <Card className={sidebarClassNames.sidebarWrapper} variant="cardPrimary">
      <div className={sidebarClassNames.sidebarHeaderWrapper}>
        {titleTabs && titleTabs.length > 0 ? (
          titleTabs.map((tab) => (
            <Text
              onClick={() => onTitleTabChange?.(tab)}
              key={`TitleTab_${tab}`}
              as="h5"
              variant="h5"
              style={{
                marginRight: 'var(--general-space-20)',
                cursor: onTitleTabChange ? 'pointer' : 'default',
                color:
                  title === capitalize(tab)
                    ? 'var(--earn-protocol-secondary-100)'
                    : 'var(--color-text-primary-disabled)',
              }}
            >
              {capitalize(tab)}
            </Text>
          ))
        ) : (
          <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
            {title}
          </Text>
        )}
      </div>

      <div className={sidebarClassNames.sidebarHeaderSpacer} />
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
      <div
        style={{
          width: '100%',
        }}
      >
        <AnimateHeight show={!!error} id="sidebar-error">
          <Box className={sidebarClassNames.sidebarErrorWrapper}>
            {typeof error === 'string' ? <Text variant="p4">{error}</Text> : error}
          </Box>
        </AnimateHeight>
      </div>
      {footnote && <div className={sidebarClassNames.sidebarFootnoteWrapper}>{footnote}</div>}
    </Card>
  )
}
