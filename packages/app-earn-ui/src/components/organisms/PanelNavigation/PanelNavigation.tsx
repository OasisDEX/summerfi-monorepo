'use client'

import { type FC, type ReactNode, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Expander } from '@/components/atoms/Expander/Expander'
import { Text } from '@/components/atoms/Text/Text'
import { MobileDrawer } from '@/components/molecules/MobileDrawer/MobileDrawer'

import styles from './PanelNavigation.module.css'

interface ButtonOrLinkProps {
  children: ReactNode
  link?: {
    href: string
    target?: string
  }
  disabled?: boolean
  onClick?: () => void
}

const ButtonOrLink: FC<ButtonOrLinkProps> = ({ children, link, onClick, disabled }) => {
  if (link) {
    return (
      <Link
        href={link.href}
        target={link.target}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <Button
        variant="unstyled"
        onClick={onClick}
        disabled={disabled}
        style={disabled ? { pointerEvents: 'none', opacity: 0.4 } : {}}
      >
        {children}
      </Button>
    )
  }

  return children
}

interface PanelNavigationItem {
  id: string
  label: ReactNode
  action?: () => void
  disabled?: boolean
  isActive?: boolean
  link?: {
    href: string
    target?: string
  }
}

export interface PanelNavigationProps {
  navigation?: {
    id: string
    label?: ReactNode
    items: PanelNavigationItem[]
    expanded?: boolean
  }[]
  staticItems?: PanelNavigationItem[]
  isMobile?: boolean
}

export const PanelNavigation: FC<PanelNavigationProps> = ({
  navigation,
  staticItems,
  isMobile,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const content = (
    <Card variant="cardSecondary" className={styles.panelNavigationWrapper}>
      {isMobile && (
        <div className={styles.panelNavigationHeader}>
          <Button
            variant="unstyled"
            onClick={() => setIsOpen((prev) => !prev)}
            className={styles.headerButton}
          >
            <Text variant="p1semi">. . .</Text>
          </Button>
        </div>
      )}
      {navigation &&
        navigation.length > 0 &&
        navigation.map((navItem) =>
          navItem.label ? (
            <Expander
              key={navItem.id}
              title={navItem.label}
              expanderWrapperClassName={styles.navigationWrapper}
              expanderButtonClassName={styles.navigationButton}
              defaultExpanded={navItem.expanded ?? false}
            >
              <div className={clsx(styles.itemsList, styles.navigationList)}>
                {navItem.items.map((item) => (
                  <ButtonOrLink
                    key={item.id}
                    onClick={item.action}
                    link={item.link}
                    disabled={item.disabled}
                  >
                    <Text
                      as="div"
                      variant="p1semi"
                      className={clsx(styles.buttonText, {
                        [styles.activeButtonText]: item.isActive,
                      })}
                    >
                      {item.label}
                    </Text>
                  </ButtonOrLink>
                ))}
              </div>
            </Expander>
          ) : (
            <div key={navItem.id} className={styles.itemsList}>
              {navItem.items.map((item) => (
                <ButtonOrLink
                  key={item.id}
                  onClick={item.action}
                  link={item.link}
                  disabled={item.disabled}
                >
                  <Text
                    as="div"
                    variant="p1semi"
                    className={clsx(styles.buttonText, {
                      [styles.activeButtonText]: item.isActive,
                    })}
                  >
                    {item.label}
                  </Text>
                </ButtonOrLink>
              ))}
            </div>
          ),
        )}
      {staticItems && staticItems.length > 0 && (
        <>
          {navigation && <div className={styles.panelNavigationSeparator} />}
          <div className={styles.staticItemsList}>
            {staticItems.map((item) => (
              <ButtonOrLink
                key={item.id}
                link={item.link}
                onClick={item.action}
                disabled={item.disabled}
              >
                <Text
                  as="div"
                  variant="p1semi"
                  className={clsx(styles.buttonText, {
                    [styles.activeButtonText]: item.isActive,
                  })}
                >
                  {item.label}
                </Text>
              </ButtonOrLink>
            ))}
          </div>
        </>
      )}
    </Card>
  )

  return isMobile ? (
    <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} variant="sidebar" height="70vh">
      {content}
    </MobileDrawer>
  ) : (
    content
  )
}
