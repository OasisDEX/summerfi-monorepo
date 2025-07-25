'use client'
import { type CSSProperties, type FC, type ReactNode, useState } from 'react'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { LoadingSpinner } from '@/components/molecules/LoadingSpinner/LoadingSpinner'
import { MobileDrawer } from '@/components/molecules/MobileDrawer/MobileDrawer'
import { EXTERNAL_LINKS } from '@/helpers/application-links'

import sidebarClassNames from '@/components/organisms/Sidebar/Sidebar.module.css'

export interface SidebarProps {
  title: string
  subtitle?: string
  titleTabs?: string[]
  onTitleTabChange?: (tab: string) => void
  content: ReactNode
  primaryButton: {
    label: string
    action?: () => void
    url?: string
    target?: string
    disabled?: boolean
    loading?: boolean
    hidden?: boolean
  }
  secondaryButton?: {
    label: string | ReactNode
    action?: () => void
    url?: string
    target?: string
    disabled?: boolean
    loading?: boolean
    hidden?: boolean
  }
  footnote?: ReactNode
  error?: string | ReactNode
  asDesktopOnly?: boolean
  isMobileOrTablet?: boolean
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
  centered?: boolean
}

export const Sidebar: FC<SidebarProps> = ({
  title,
  subtitle,
  titleTabs,
  content,
  primaryButton,
  secondaryButton,
  footnote,
  error,
  asDesktopOnly = false,
  isMobileOrTablet,
  drawerOptions = { slideFrom: 'bottom' },
  customHeader,
  customHeaderStyles,
  hiddenHeaderChevron = false,
  centered,
  onTitleTabChange,
  goBackAction,
  handleIsDrawerOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const isOpenResolved = drawerOptions.forceMobileOpen ?? isOpen

  const labelElement = primaryButton.loading ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--general-space-12)',
        opacity: 0.5,
      }}
    >
      <LoadingSpinner size={24} />
      <span style={{ color: 'var(--color-text-inverse)' }}>{primaryButton.label}</span>
    </div>
  ) : (
    primaryButton.label
  )

  const sidebarWrapped = (
    <Card
      className={clsx(sidebarClassNames.sidebarWrapper, {
        [sidebarClassNames.centered]: centered,
      })}
      variant="cardSecondary"
    >
      <div
        className={clsx(sidebarClassNames.sidebarHeaderWrapper, {
          [sidebarClassNames.centerTitle]: !titleTabs && !!goBackAction,
        })}
        onClick={() => {
          if (isMobileOrTablet)
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
                <div className={sidebarClassNames.sidebarTitleWrapper}>
                  <Text as="h5" variant="h5">
                    {title}
                  </Text>
                  {subtitle && (
                    <Text
                      as="p"
                      variant="p4semi"
                      style={{ color: 'var(--earn-protocol-secondary-40)' }}
                    >
                      {subtitle}
                    </Text>
                  )}
                </div>
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

      <div
        className={clsx(sidebarClassNames.sidebarHeaderSpacer, {
          [sidebarClassNames.hidden]: !isOpenResolved,
        })}
      />
      <div className={sidebarClassNames.sidebarContent}>{content}</div>
      <div
        style={{
          width: '100%',
          marginTop: error ?? footnote ? 'var(--general-space-20)' : undefined,
        }}
      >
        <AnimateHeight show={!!error} id="sidebar-error">
          <div className={sidebarClassNames.sidebarErrorWrapper}>
            {typeof error === 'string' ? (
              <div className={sidebarClassNames.sidebarErrorContent}>
                <Icon iconName="warning" color="var(--earn-protocol-critical-100)" size={20} />
                <Text variant="p3semi" style={{ marginLeft: 'var(--general-space-12)' }}>
                  {error}
                </Text>
              </div>
            ) : (
              error
            )}
            <br />
            <Text variant="p4semi" style={{ color: 'var(--earn-protocol-warning-100)' }}>
              If you continue to experience issues, please contact support{' '}
              <Link
                href={EXTERNAL_LINKS.DISCORD}
                style={{ textDecoration: 'underline' }}
                target="_blank"
              >
                on discord
              </Link>
              ,{' '}
              <Link
                href="https://docs.summer.fi/get-in-touch/contact-us"
                style={{ textDecoration: 'underline' }}
                target="_blank"
              >
                via email
              </Link>
              ,{' '}
              <Link
                href="https://cal.com/jordan-jackson-d278ib/summer.fi-support-call"
                style={{ textDecoration: 'underline' }}
                target="_blank"
              >
                or on a call
              </Link>
              .
            </Text>
          </div>
        </AnimateHeight>
      </div>
      <div className={sidebarClassNames.sidebarCta}>
        {(primaryButton.action ?? primaryButton.loading) &&
          !primaryButton.url &&
          !primaryButton.hidden && (
            <Button
              variant="primaryLarge"
              onClick={primaryButton.action}
              disabled={primaryButton.disabled ?? primaryButton.loading}
            >
              {labelElement}
            </Button>
          )}
        {primaryButton.url && (
          <Link
            href={primaryButton.url}
            target={primaryButton.target}
            onClick={primaryButton.action}
            prefetch
          >
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
          <Link
            href={secondaryButton.url}
            target={secondaryButton.target}
            onClick={secondaryButton.action}
            prefetch
          >
            <Button variant="secondaryLarge" disabled={secondaryButton.disabled}>
              {secondaryButton.label}
            </Button>
          </Link>
        )}
      </div>

      {footnote && <div className={sidebarClassNames.sidebarFootnoteWrapper}>{footnote}</div>}
    </Card>
  )

  return asDesktopOnly ? (
    sidebarWrapped
  ) : (
    <>
      {isMobileOrTablet ? (
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
