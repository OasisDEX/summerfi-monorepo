import { type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.css'

export const GlobalNoticeBanner = ({ message }: { message: ReactNode }): ReactNode => {
  return (
    <div className={bannerStyles.globalNoticeBannerWrapper}>
      <Text variant="p4semi">{message}</Text>
    </div>
  )
}
