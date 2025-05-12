import { type FC } from 'react'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { CountDown } from '@/components/organisms/CountDown/CountDown'

import countdownBannerStyles from '@/components/organisms/CountDownBanner/CountDownBanner.module.css'

interface CountDownBannerProps {
  countdownLabel: string
  futureTimestamp: string
}

export const CountDownBanner: FC<CountDownBannerProps> = ({ futureTimestamp, countdownLabel }) => {
  return (
    <Card
      style={{ backgroundImage: 'var(--gradient-summer-fi-lightest)', border: 'unset' }}
      className={countdownBannerStyles.content}
      variant="cardSmallPaddings"
    >
      <div className={countdownBannerStyles.infoWrapper}>
        <Icon iconName="rays" size={32} />
        <Text as="p" variant="p2semi" style={{ maxWidth: '70%' }}>
          {countdownLabel}
        </Text>
      </div>
      <CountDown futureTimestamp={futureTimestamp} variant="countDownSmallGaps" />
    </Card>
  )
}
