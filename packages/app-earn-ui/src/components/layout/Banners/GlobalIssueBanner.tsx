import { type FC, type ReactNode } from 'react'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.css'

export const GlobalIssueBanner: FC<{ message: string; readMoreUrl?: string }> = ({
  message,
  readMoreUrl,
}): ReactNode => {
  return (
    <div className={bannerStyles.globalIssueBannerWrapper}>
      <Text variant="p3semi">{message}</Text>
      {readMoreUrl ? (
        <>
          &nbsp;
          <Link href={readMoreUrl}>
            <Text
              variant="p3semi"
              style={{
                color: 'var(--color-text-link)',
              }}
            >
              Read more
            </Text>
          </Link>
        </>
      ) : null}
    </div>
  )
}
