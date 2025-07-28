'use client'

import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Expander } from '@/components/atoms/Expander/Expander'
import { Text } from '@/components/atoms/Text/Text'

import styles from './PanelNavigation.module.css'

interface ButtonOrLinkProps {
  children: ReactNode
  link?: {
    href: string
    target?: string
  }
  onClick?: () => void
}

const ButtonOrLink: FC<ButtonOrLinkProps> = ({ children, link, onClick }) => {
  if (link) {
    return (
      <Link href={link.href} target={link.target}>
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <Button variant="unstyled" onClick={onClick}>
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
  isActive?: boolean
  link?: {
    href: string
    target?: string
  }
}

interface PanelNavigationProps {
  navigation?: {
    id: string
    label?: ReactNode
    items: PanelNavigationItem[]
  }[]
  staticItems?: PanelNavigationItem[]
}

export const PanelNavigation: FC<PanelNavigationProps> = ({ navigation, staticItems }) => {
  return (
    <Card variant="cardSecondary" className={styles.panelNavigationWrapper}>
      {navigation &&
        navigation.length > 0 &&
        navigation.map((expandable) =>
          expandable.label ? (
            <Expander
              key={expandable.id}
              title={expandable.label}
              expanderWrapperClassName={styles.navigationWrapper}
              expanderButtonClassName={styles.navigationButton}
            >
              <div className={clsx(styles.itemsList, styles.navigationList)}>
                {expandable.items.map((item) => (
                  <ButtonOrLink key={item.id} onClick={item.action} link={item.link}>
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
            <div key={expandable.id} className={styles.itemsList}>
              {expandable.items.map((item) => (
                <ButtonOrLink key={item.id} onClick={item.action} link={item.link}>
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
          <div className={styles.panelNavigationSeparator} />
          <div className={styles.itemsList}>
            {staticItems.map((item) => (
              <ButtonOrLink key={item.id} link={item.link} onClick={item.action}>
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
}
