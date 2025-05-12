import { type FC, type ReactNode } from 'react'
import { type PlatformLogo } from '@summerfi/app-types'
import clsx from 'clsx'
import Image from 'next/image'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { OrderInformation } from '@/components/molecules/OrderInformation/OrderInformation'

import classNames from './PositionCard.module.css'

interface PositionCardProps {
  handleClick?: () => void
  platformLogo: PlatformLogo
  title: {
    label: ReactNode
    value?: ReactNode
  }
  list: {
    label: string
    value: ReactNode
  }[]
  banner?: ReactNode
  isActive?: boolean
  listHeading?: ReactNode
}

export const PositionCard: FC<PositionCardProps> = ({
  platformLogo,
  title,
  list,
  isActive,
  handleClick,
  banner,
  listHeading = null,
}) => {
  return (
    <Card className={classNames.positionCardWrapper} onClick={handleClick}>
      <div className={classNames.positionCardHeader}>
        <Image src={platformLogo} alt={platformLogo} height={34} style={{ width: 'auto' }} />
        <div
          className={clsx(classNames.positionCardHeaderIcon, {
            [classNames.positionCardHeaderIconActive]: isActive,
          })}
        >
          <Icon
            iconName="checkmark"
            size={13}
            style={{
              color: isActive
                ? 'var(--earn-protocol-success-100)'
                : 'var(--earn-protocol-neutral-40)',
            }}
          />
        </div>
      </div>
      <div className={classNames.positionSubHeader}>
        <Text variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          {title.label}
        </Text>
        <div className={classNames.positionSubHeaderAmount}>{title.value && title.value}</div>
      </div>
      <div className={classNames.divider} />
      {listHeading}
      {list.length > 0 && (
        <OrderInformation
          items={list}
          wrapperStyles={{
            padding: 'unset',
            backgroundColor: 'unset',
          }}
        />
      )}
      {banner && (
        <Card variant="cardSecondarySmallPaddings" className={classNames.positionCardBanner}>
          {banner}
        </Card>
      )}
    </Card>
  )
}
