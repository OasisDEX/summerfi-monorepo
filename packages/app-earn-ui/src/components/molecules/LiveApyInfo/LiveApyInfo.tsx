import { type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import liveApyInfoStyles from './LiveApyInfo.module.css'

export const LiveApyInfo = ({
  apyCurrent,
  apyUpdatedAt,
  isAltPressed,
}: {
  apyCurrent: string
  apyUpdatedAt?: { apyUpdatedAtAltLabel: string; apyUpdatedAtLabel: string }
  isAltPressed: boolean
}): ReactNode => {
  return (
    <div className={liveApyInfoStyles.liveApyInfoWrapper}>
      <Text variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
        Lazy&nbsp;Summer&nbsp;Live&nbsp;APY:&nbsp;{apyCurrent}
      </Text>
      {isAltPressed && apyUpdatedAt && <>Updated @ {apyUpdatedAt.apyUpdatedAtAltLabel}</>}
      <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
        Lazy Summer Live APY updates every 10 minutes with real-time data, ensuring the most
        accurate, up-to-the-minute rate.
      </Text>
    </div>
  )
}
