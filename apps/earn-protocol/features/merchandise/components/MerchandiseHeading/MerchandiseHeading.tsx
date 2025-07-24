import { Icon, Text } from '@summerfi/app-earn-ui'
import capitalize from 'lodash-es/capitalize'
import Link from 'next/link'

import { type MerchandiseType } from '@/features/merchandise/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './MerchandiseHeading.module.css'

interface MerchandiseHeadingProps {
  type: MerchandiseType
  walletAddress: string
}

export const MerchandiseHeading = ({ type, walletAddress }: MerchandiseHeadingProps) => {
  return (
    <div className={classNames.merchandiseHeadingWrapper}>
      <Text variant="h5" as="h5">
        Claim your {capitalize(type)}
      </Text>
      <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.BEACH_CLUB}`}>
        <Icon
          iconName="arrow_backward"
          className={classNames.arrowBackIcon}
          size={24}
          color="var(--earn-protocol-secondary-70)"
        />
      </Link>
    </div>
  )
}
