'use client'
import { type FC, type ReactNode, useState } from 'react'
import clsx from 'clsx'
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
    hidden?: boolean
  }
  footnote?: ReactNode
  error?: string | ReactNode
  asDesktopOnly?: boolean
  isMobile?: boolean
  goBackAction?: () => void
  drawerOptions?:
    | {
        slideFrom: 'bottom'
        forceMobileOpen?: boolean
      }
    | {
        slideFrom: 'right'
        closeDrawer: () => void
        forceMobileOpen?: boolean
      }
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
  goBackAction,
  isMobile,
  drawerOptions = { slideFrom: 'bottom' },
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const isOpenResolved = drawerOptions.forceMobileOpen ?? isOpen

  const labelElement = primaryButton.loading ? <LoadingSpinner size={28} /> : primaryButton.label

  const sidebarWrapped = (
    <Card className={sidebarClassNames.sidebarWrapper} variant="cardPrimary">
      <div
        className={clsx(sidebarClassNames.sidebarHeaderWrapper, {
          [sidebarClassNames.centerTitle]: !titleTabs && !!goBackAction,
        })}
        onClick={() => {
          if (isMobile) setIsOpen((prev) => !prev)
        }}
      >
        {goBackAction && (
          <div onClick={goBackAction} className={sidebarClassNames.goBackButton}>
            <Icon iconName="arrow_backward" color="var(--color-background-primary)" size={24} />
          </div>
        )}
        <div className={clsx(sidebarClassNames.sidebarHeaderActionButtonsWrapper)}>
          {titleTabs && titleTabs.length > 0 ? (
            titleTabs.map((tab) => (
              <Text
                onClick={(e) => {
                  // eslint-disable-next-line no-unused-expressions
                  isOpenResolved && e.stopPropagation()
                  onTitleTabChange?.(tab)
                }}
                key={`TitleTab_${tab}`}
                as="h5"
                variant="h5"
                style={{
                  marginRight: 'var(--general-space-20)',
                  cursor: onTitleTabChange ? 'pointer' : 'default',
                  color:
                    capitalize(title) === capitalize(tab)
                      ? 'var(--earn-protocol-secondary-100)'
                      : 'var(--color-text-primary-disabled)',
                }}
              >
                {capitalize(tab)}
              </Text>
            ))
          ) : (
            <Text as="h5" variant="h5" className={sidebarClassNames.sidebarTitle}>
              {title}
            </Text>
          )}
        </div>
        {goBackAction && <div className={sidebarClassNames.goBackButtonFillFLex} />}

        <div className={sidebarClassNames.sidebarHeaderChevron}>
          {drawerOptions.slideFrom === 'bottom' && (
            <Icon iconName={isOpenResolved ? 'chevron_down' : 'chevron_up'} variant="xs" />
          )}
          {drawerOptions.slideFrom === 'right' && (
            <div onClick={drawerOptions.closeDrawer}>
              <Icon iconName="close" variant="xs" color="var(--earn-protocol-secondary-40)" />
            </div>
          )}
        </div>
      </div>

      <div className={sidebarClassNames.sidebarHeaderSpacer} />
      {content}

      {primaryButton.action && !primaryButton.url && !primaryButton.hidden && (
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
    sidebarWrapped
  ) : (
    <>
      {isMobile ? (
        <MobileDrawer
          isOpen={isOpenResolved}
          onClose={() => setIsOpen(false)}
          slideFrom={drawerOptions.slideFrom}
          height="100%"
          variant="sidebar"
        >
          {sidebarWrapped}
        </MobileDrawer>
      ) : (
        sidebarWrapped
      )}
    </>
  )
}
