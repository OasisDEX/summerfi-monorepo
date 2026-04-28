import { type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import navigationItemsStyles from './NavigationItems.module.css'

export type NavigationItemsProps = {
  items: {
    id: string
    title: ReactNode
    description: string
    url: string
    icon: IconNamesList
    iconSize?: number
    target?: string
    prefetchDisabled?: boolean
    onClick?: () => void
  }[]
  currentPath?: string
}

export const NavigationItems = ({ items, currentPath }: NavigationItemsProps): React.ReactNode => {
  return (
    <div className={navigationItemsStyles.navigationItemsWrapper}>
      {items.map((item) => {
        const linkContent = (
          <div className={navigationItemsStyles.navigationItemsItem}>
            <div className={navigationItemsStyles.navigationItemsIconWrapper}>
              <Icon iconName={item.icon} size={item.iconSize ?? 32} />
            </div>
            <div>
              <Text
                as="p"
                variant="p3semi"
                className={clsx(
                  currentPath === item.url
                    ? navigationItemsStyles.activeLink
                    : navigationItemsStyles.inactiveLink,
                )}
              >
                {item.title}
              </Text>
              <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                {item.description}
              </Text>
            </div>
          </div>
        )

        return item.url.startsWith('/landing_page') ? (
          <a
            href={item.url.replace('/landing_page', '')} // replace what we set in getNavigationItems for landing page links to make them work (because of stupid basepath handling not being overwriteable in Link component)
            rel="external"
            key={`NavItems_${item.id}`}
            target={item.target}
            onClick={item.onClick}
          >
            {linkContent}
          </a>
        ) : (
          <Link
            href={item.url}
            key={`NavItems_${item.id}`}
            prefetch={!item.prefetchDisabled}
            target={item.target}
            onClick={item.onClick}
            suppressHydrationWarning
          >
            {linkContent}
          </Link>
        )
      })}
    </div>
  )
}
