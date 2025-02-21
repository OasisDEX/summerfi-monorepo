import { type FC } from 'react'
import { Card, type CardVariant, Text, TokenWithNetworkIcon } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'
import Image from 'next/image'

import { type PlatformLogoMap, platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationMiniCard.module.scss'

interface MigrationMiniCardProps {
  description: string
  amount: string
  change: string
  token: TokenSymbolsList
  network: string
  type: 'from' | 'to'
  platformLogo: PlatformLogoMap
}

const variantMap: { [key in MigrationMiniCardProps['type']]: CardVariant } = {
  from: 'cardPrimarySmallPaddings',
  to: 'cardSecondarySmallPaddingsColorfulBorder',
}

export const MigrationMiniCard: FC<MigrationMiniCardProps> = ({
  description,
  amount,
  change,
  token,
  type,
  platformLogo,
}) => {
  return (
    <Card
      variant={variantMap[type]}
      className={classNames.miniCardWrapper}
      style={{ padding: 'var(--general-space-16)' }}
    >
      <div className={classNames.heading}>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {capitalize(type)}
        </Text>
        <Image src={platformLogoMap[platformLogo]} alt={platformLogo} height={17} />
      </div>
      <div className={classNames.content}>
        <div className={classNames.iconWrapper}>
          <TokenWithNetworkIcon tokenName={token} chainId={1} />
        </div>
        <Text as="h5" variant="h5">
          {token}
        </Text>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          {description}
        </Text>
      </div>
      <div
        className={classNames.divider}
        style={{
          backgroundColor:
            type === 'from'
              ? 'var(--earn-protocol-neutral-90)'
              : 'var(--earn-protocol-neutral-100)',
        }}
      />
      <div className={classNames.footer}>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Projected Earnings
        </Text>
        <Text as="p" variant="p1semi">
          {amount}{' '}
          <Text as="span" variant="p4semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
            {change}
          </Text>
        </Text>
      </div>
    </Card>
  )
}
