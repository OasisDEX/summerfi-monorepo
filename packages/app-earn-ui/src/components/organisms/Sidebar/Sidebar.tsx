'use client'
import { type CSSProperties, type FC, type ReactNode, useState } from 'react'
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
  secondaryButton?: {
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
  customHeader?: ReactNode
  customHeaderStyles?: CSSProperties
  handleIsDrawerOpen?: (flag: boolean) => void
  hiddenHeaderChevron?: boolean
}

export const Sidebar: FC<SidebarProps> = ({
  title,
  titleTabs,
  content,
  primaryButton,
  secondaryButton,
  footnote,
  error,
  onTitleTabChange,
  asDesktopOnly = false,
  goBackAction,
  isMobile,
  drawerOptions = { slideFrom: 'bottom' },
  customHeader,
  customHeaderStyles,
  handleIsDrawerOpen,
  hiddenHeaderChevron = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const isOpenResolved = drawerOptions.forceMobileOpen ?? isOpen

  const labelElement = primaryButton.loading ? <LoadingSpinner size={28} /> : primaryButton.label

  const sidebarWrapped = (
    <Card className={sidebarClassNames.sidebarWrapper} variant="cardSecondary">
      <div
        className={clsx(sidebarClassNames.sidebarHeaderWrapper, {
          [sidebarClassNames.centerTitle]: !titleTabs && !!goBackAction,
        })}
        onClick={() => {
          if (isMobile)
            setIsOpen((prev) => {
              handleIsDrawerOpen?.(!prev)

              return !prev
            })
        }}
        style={customHeaderStyles}
      >
        {customHeader ? (
          customHeader
        ) : (
          <>
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
            {!hiddenHeaderChevron && (
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
            )}
          </>
        )}
      </div>

      <div className={sidebarClassNames.sidebarHeaderSpacer} />
      <div className={sidebarClassNames.sidebarContent}>{content}</div>
      <div className={sidebarClassNames.sidebarCta}>
        {primaryButton.action && !primaryButton.url && !primaryButton.hidden && (
          <Button
            variant="primaryLarge"
            onClick={primaryButton.action}
            disabled={primaryButton.disabled}
          >
            {labelElement}
          </Button>
        )}
        {primaryButton.url && (
          <Link href={primaryButton.url} onClick={primaryButton.action} prefetch>
            <Button variant="primaryLarge" disabled={primaryButton.disabled}>
              {labelElement}
            </Button>
          </Link>
        )}
        {secondaryButton?.action && !secondaryButton.url && !secondaryButton.hidden && (
          <Button
            variant="secondaryLarge"
            onClick={secondaryButton.action}
            disabled={secondaryButton.disabled}
          >
            {secondaryButton.label}
          </Button>
        )}
        {secondaryButton?.url && (
          <Link href={secondaryButton.url} onClick={secondaryButton.action} prefetch>
            <Button variant="secondaryLarge" disabled={secondaryButton.disabled}>
              {secondaryButton.label}
            </Button>
          </Link>
        )}
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        <AnimateHeight show={!!error} id="sidebar-error">
          <Box className={sidebarClassNames.sidebarErrorWrapper}>
            {typeof error === 'string' ? (
              <Text variant="p4" style={{ textAlign: 'center' }}>
                {error}
              </Text>
            ) : (
              error
            )}
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
