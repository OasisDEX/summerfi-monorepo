import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import navigationItemsStyles from './NavigationItems.module.scss'

export type NavigationItemsProps = {
  items: {
    id: string
    title: string
    description: string
    url: string
    icon: IconNamesList
    iconSize?: number
  }[]
  currentPath?: string
}

export const NavigationItems = ({ items, currentPath }: NavigationItemsProps) => {
  return (
    <div className={navigationItemsStyles.navigationItemsWrapper}>
      {items.map((item) => (
        <Link href={item.url} key={`NavItems_${item.id}`}>
          <div className={navigationItemsStyles.navigationItemsItem}>
            <div className={navigationItemsStyles.navigationItemsIconWrapper}>
              <Icon iconName={item.icon} size={item.iconSize ?? 24} />
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
              <Text as="p" variant="p3">
                {item.description}
              </Text>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
