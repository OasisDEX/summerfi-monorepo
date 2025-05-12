import { type FC, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import classNames from '@/components/atoms/List/List.module.css'

interface ListProps {
  list: ReactNode[]
  itemIcon?: IconNamesList
}

export const List: FC<ListProps> = ({ list, itemIcon }) => {
  return (
    <ul>
      {list.map((item, idx) => (
        <li key={idx} className={classNames.liWrapper}>
          {itemIcon && <Icon iconName={itemIcon} size={14} color="rgba(255, 73, 164, 1)" />}
          <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            {item}
          </Text>
        </li>
      ))}
    </ul>
  )
}
