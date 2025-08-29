import { type FC } from 'react'
import {
  Card,
  type CardVariant,
  getDisplayToken,
  SkeletonLine,
  Text,
  TokenWithNetworkIcon,
} from '@summerfi/app-earn-ui'
import {
  type PlatformLogo,
  type SupportedNetworkIds,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import capitalize from 'lodash-es/capitalize'
import Image from 'next/image'

import { platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationMiniCard.module.css'

export enum MigrationMiniCardType {
  FROM = 'from',
  TO = 'to',
}

interface MigrationMiniCardProps {
  description: string
  amount?: string
  change?: string
  token: TokenSymbolsList
  chainId: SupportedNetworkIds
  type: MigrationMiniCardType
  platformLogo: PlatformLogo
  isLoading?: boolean
}

const variantMap: { [key in MigrationMiniCardType]: CardVariant } = {
  [MigrationMiniCardType.FROM]: 'cardPrimarySmallPaddings',
  [MigrationMiniCardType.TO]: 'cardSecondarySmallPaddingsColorfulBorder',
}

export const MigrationMiniCard: FC<MigrationMiniCardProps> = ({
  description,
  amount,
  change,
  token,
  type,
  platformLogo,
  chainId,
  isLoading,
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
          <TokenWithNetworkIcon tokenName={token} chainId={chainId} />
        </div>
        <Text as="h5" variant="h5">
          {getDisplayToken(token)}
        </Text>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          {description}
        </Text>
      </div>
      <div
        className={classNames.divider}
        style={{
          backgroundColor:
            type === MigrationMiniCardType.FROM
              ? 'var(--earn-protocol-neutral-90)'
              : 'var(--earn-protocol-neutral-100)',
        }}
      />
      <div className={classNames.footer}>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Projected Earnings
        </Text>
        {isLoading ? (
          <SkeletonLine
            width="80px"
            height="14px"
            style={{ marginTop: '6px', marginBottom: 'var(--general-space-8)' }}
          />
        ) : amount ? (
          <Text as="p" variant="p1semi">
            {amount}{' '}
            {change && (
              <Text
                as="span"
                variant="p4semi"
                style={{
                  color: change.includes('-')
                    ? 'var(--earn-protocol-warning-100)'
                    : 'var(--earn-protocol-success-100)',
                }}
              >
                {change}
              </Text>
            )}
          </Text>
        ) : (
          <Text as="p" variant="p1semi">
            n/a
          </Text>
        )}
      </div>
    </Card>
  )
}
