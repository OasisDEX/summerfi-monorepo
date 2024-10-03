import { type IconNamesList } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import navigationExploreStyles from './NavigationExplore.module.scss'

type NavigationExploreProps = {
  items: {
    id: string
    title: string
    description: string
    url: string
    icon: IconNamesList
    iconSize?: number
  }[]
}

export const NavigationExplore = ({ items }: NavigationExploreProps) => {
  return (
    <div className={navigationExploreStyles.navigationExploreWrapper}>
      {items.map((item) => (
        <div key={item.id} className={navigationExploreStyles.navigationExploreItem}>
          <div className={navigationExploreStyles.navigationExploreIconWrapper}>
            <Icon iconName={item.icon} size={item.iconSize ?? 24} />
          </div>
          <div>
            <Text as="p" variant="p3semi">
              {item.title}
            </Text>
            <Text
              as="p"
              variant="p3"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              {item.description}
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}
