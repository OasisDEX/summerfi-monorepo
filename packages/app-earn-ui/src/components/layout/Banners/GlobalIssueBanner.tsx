import { type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.css'

export const GlobalIssueBanner: FC<{ message: string }> = ({ message }): ReactNode => {
  return (
    <div className={bannerStyles.globalIssueBannerWrapper}>
      <Text variant="p3semi">{message}</Text>
    </div>
  )
}
