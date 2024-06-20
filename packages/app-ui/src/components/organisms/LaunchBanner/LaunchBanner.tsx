import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { CountDown } from '@/components/organisms/CountDown/CountDown'
import { EXTERNAL_LINKS } from '@/helpers/application-links'

import classNames from '@/components/organisms/LaunchBanner/LaunchBanner.module.scss'

export const LaunchBanner = () => {
  const futureTimestamp = '2024-07-24T16:00:00-02:00'

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.content}>
        <Text as="p" variant="p2semi" style={{ color: 'var(--color-primary-30)' }}>
          DeFi is about to get a lot easier
        </Text>
        <Text as="h5" variant="h5">
          Protocol Litepaper Release 👉
        </Text>
        <Text as="p" variant="p2semi">
          <Link href={EXTERNAL_LINKS.KB.READ_ABOUT_RAYS}>Read announcement →</Link>
        </Text>
      </div>
      <CountDown futureTimestamp={futureTimestamp} />
    </div>
  )
}
