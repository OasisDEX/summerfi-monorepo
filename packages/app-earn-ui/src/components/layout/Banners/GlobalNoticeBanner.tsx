import { type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.css'

export const GlobalNoticeBanner: FC<{ message: ReactNode }> = ({ message }): ReactNode => {
  return (
    <div className={bannerStyles.globalNoticeBannerWrapper}>
      <Text variant="p4semi">{message}</Text>
    </div>
  )
}
