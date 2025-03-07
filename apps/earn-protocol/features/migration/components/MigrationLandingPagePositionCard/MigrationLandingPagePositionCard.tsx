import { type CSSProperties, type FC } from 'react'
import { Card, DataBlock, Icon, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import { formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import clsx from 'clsx'
import Image from 'next/image'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { type MigrationEarningsData } from '@/features/migration/types'
import { platformLogoMap, platformLogoMapByMigrationType } from '@/helpers/platform-logo-map'

import classNames from './MigrationLandingPagePositionCard.module.scss'

interface MigrationLandingPagePositionCardProps {
  position: MigratablePosition
  onSelectPosition: (id: string) => void
  isActive: boolean
  earningsData: MigrationEarningsData
  wrapperStyle?: CSSProperties
}

export const MigrationLandingPagePositionCard: FC<MigrationLandingPagePositionCardProps> = ({
  position,
  onSelectPosition,
  isActive,
  earningsData,
  wrapperStyle,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const checkmarkComponent = (
    <div
      className={clsx(classNames.positionCardHeaderIcon, {
        [classNames.positionCardHeaderIconActive]: isActive,
      })}
    >
      <Icon
        iconName="checkmark"
        size={13}
        style={{
          color: isActive ? 'var(--earn-protocol-success-100)' : 'var(--earn-protocol-neutral-40)',
        }}
      />
    </div>
  )

  return (
    <Card
      variant={isActive ? 'cardPrimaryColorfulBorder' : 'cardPrimary'}
      className={classNames.migrationLandingPagePositionCardWrapper}
      onClick={() => onSelectPosition(position.id)}
      style={wrapperStyle}
    >
      <div className={classNames.iconTextualWrapper}>
        <div className={classNames.iconValueWrapper}>
          <Icon
            tokenName={
              position.underlyingTokenAmount.token.symbol.toUpperCase() as TokenSymbolsList
            }
            size={40}
          />
          <div className={classNames.valuePlatformWrapper}>
            <Text as="h4" variant="h4">
              ${formatFiatBalance(position.usdValue.amount)}{' '}
              <Text
                as="span"
                variant="p3semi"
                style={{
                  color: 'var(--earn-protocol-secondary-60)',
                  paddingBottom: '2px',
                }}
              >
                deposited
              </Text>
            </Text>
            <Image
              src={
                platformLogoMap[
                  platformLogoMapByMigrationType[position.migrationType] as PlatformLogo
                ]
              }
              alt={position.migrationType}
              height={20}
            />
          </div>
        </div>
        {isMobile && checkmarkComponent}
      </div>
      <div className={classNames.dataBlocksWrapper}>
        <DataBlock title="Current APY" value={formatDecimalAsPercent(position.apy)} />
        <DataBlock
          title="Lazy Summer Current APY"
          value={formatDecimalAsPercent(earningsData.lazySummerCurrentApy)}
        />
        <DataBlock
          title="Lazy Summer 30d APY"
          value={formatDecimalAsPercent(earningsData.lazySummer30dApy)}
        />
      </div>
      {!isMobile && checkmarkComponent}
    </Card>
  )
}
