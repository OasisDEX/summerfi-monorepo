'use client'
import { type IconNamesList } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import * as iconsList from '@/tokens/icons/iconsProxy'

export const AllIconsList = () => {
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      Icons count: {Object.keys(iconsList).length}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridGap: '0.2rem',
        }}
      >
        {Object.keys(iconsList).map((iconName) => (
          <div
            key={iconName}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Icon iconName={iconName as IconNamesList} size={64} />
            <span style={{ fontSize: '0.8rem' }}>{iconName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
