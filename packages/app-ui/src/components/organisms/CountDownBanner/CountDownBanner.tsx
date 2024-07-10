import { type FC } from 'react'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { CountDown } from '@/components/organisms/CountDown/CountDown'

import classNames from '@/components/organisms/CountDownBanner/CountDownBanner.module.scss'

interface CountDownBannerProps {
  futureTimestamp: string
}

export const CountDownBanner: FC<CountDownBannerProps> = ({ futureTimestamp }) => {
  return (
    <Card
      style={{ backgroundImage: 'var(--gradient-summer-fi-lightest)', border: 'unset' }}
      className={classNames.content}
      variant="cardSmallPaddings"
    >
      <div className={classNames.infoWrapper}>
        <Icon iconName="rays" size={32} />
        <Text as="p" variant="p2semi" style={{ maxWidth: '70%' }}>
          Boost your RAYS 5x when you open a position
        </Text>
      </div>
      <CountDown futureTimestamp={futureTimestamp} variant="countDownSmallGaps" />
    </Card>
  )
}
