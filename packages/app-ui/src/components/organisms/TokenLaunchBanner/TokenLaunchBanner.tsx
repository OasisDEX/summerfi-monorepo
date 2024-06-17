import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { CountDown } from '@/components/organisms/CountDown/CountDown'

import classNames from '@/components/organisms/TokenLaunchBanner/TokensLaunchBanner.module.scss'

export const TokenLaunchBanner = () => {
  // TODO update once date will be known
  const futureTimestamp = '2024-12-25T00:00:00'

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.content}>
        <Text as="p" variant="p2semi" style={{ color: 'var(--color-primary-30)' }}>
          DeFi is about to get a lot easier
        </Text>
        <Text as="h5" variant="h5">
          Summer.fi Token launch 👉
        </Text>
        <Text as="p" variant="p2semi">
          <Link href="/">Read announcement →</Link>
        </Text>
      </div>
      <CountDown futureTimestamp={futureTimestamp} />
    </div>
  )
}
