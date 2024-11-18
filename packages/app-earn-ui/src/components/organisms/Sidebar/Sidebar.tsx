'use client'
import { type FC, type ReactNode, useState } from 'react'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { LoadingSpinner } from '@/components/molecules/LoadingSpinner/LoadingSpinner'
import { MobileDrawer } from '@/components/molecules/MobileDrawer/MobileDrawer'
import { useMobileCheck } from '@/hooks/use-mobile-check.ts'

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
  }
  footnote?: ReactNode
  error?: string | ReactNode
  asDesktopOnly?: boolean
}

export const Sidebar: FC<SidebarProps> = ({
  title,
  titleTabs,
  content,
  primaryButton,
  footnote,
  error,
  onTitleTabChange,
  asDesktopOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isMobile } = useMobileCheck()

  const labelElement = primaryButton.loading ? <LoadingSpinner size={28} /> : primaryButton.label

  const sidebarWrapped = (
    <Card className={sidebarClassNames.sidebarWrapper} variant="cardPrimary">
      <div
        className={sidebarClassNames.sidebarHeaderWrapper}
        onClick={() => {
          if (isMobile) setIsOpen((prev) => !prev)
        }}
      >
        <div className={sidebarClassNames.sidebarHeaderActionButtonsWrapper}>
          {titleTabs && titleTabs.length > 0 ? (
            titleTabs.map((tab) => (
              <Text
                onClick={(e) => {
                  // eslint-disable-next-line no-unused-expressions
                  isOpen && e.stopPropagation()
                  onTitleTabChange?.(tab)
                }}
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

        <div className={sidebarClassNames.sidebarHeaderChevron}>
          <Icon iconName={isOpen ? 'chevron_down' : 'chevron_up'} variant="xs" />
        </div>
      </div>

      <div className={sidebarClassNames.sidebarHeaderSpacer} />
      {content}

      {primaryButton.action && !primaryButton.url && (
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
        <Link href={primaryButton.url} onClick={primaryButton.action}>
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

  return asDesktopOnly ? (
    content
  ) : (
    <>
      <div className={sidebarClassNames.sidebarWrapperDesktop}>{sidebarWrapped}</div>
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        slideFrom="bottom"
        height="100%"
        variant="sidebar"
      >
        {sidebarWrapped}
      </MobileDrawer>
    </>
  )
}
