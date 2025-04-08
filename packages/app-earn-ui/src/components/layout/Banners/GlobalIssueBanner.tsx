import { type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.scss'

export const GlobalIssueBanner = ({ message }: { message: string }): ReactNode => {
  return (
    <div className={bannerStyles.globalIssueBannerWrapper}>
      <Text variant="p3semi">{message}</Text>
    </div>
  )
}
