import { type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.css'

export const GlobalIssueBanner = ({ message }: { message: string }): ReactNode => {
  return (
    <div className={bannerStyles.globalIssueBannerWrapper}>
      <Text variant="p3semi">{message}</Text>
    </div>
  )
}
