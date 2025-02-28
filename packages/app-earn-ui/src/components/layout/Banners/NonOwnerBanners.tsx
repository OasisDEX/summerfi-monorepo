import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import bannerStyles from './Banners.module.scss'

export const NonOwnerPositionBanner = ({
  isOwner,
  walletStateLoaded,
}: {
  isOwner: boolean
  walletStateLoaded: boolean
}) => {
  return (
    <div
      suppressHydrationWarning
      className={clsx(bannerStyles.bannerWrapper, bannerStyles.bannerWrapperWarning, {
        [bannerStyles.bannerWrapperVisible]: !isOwner && walletStateLoaded,
      })}
    >
      <Icon iconName="eye" />
      <Text variant="p4semi">
        This is not your position. You are viewing another users open position
      </Text>
    </div>
  )
}

export const NonOwnerPortfolioBanner = ({
  isOwner,
  walletStateLoaded,
}: {
  isOwner: boolean
  walletStateLoaded: boolean
}) => {
  return (
    <div
      suppressHydrationWarning
      className={clsx(bannerStyles.bannerWrapper, bannerStyles.bannerWrapperWarning, {
        [bannerStyles.bannerWrapperVisible]: !isOwner && walletStateLoaded,
      })}
    >
      <Icon iconName="eye" />
      <Text variant="p4semi">You are viewing other people’s portfolio</Text>
    </div>
  )
}
