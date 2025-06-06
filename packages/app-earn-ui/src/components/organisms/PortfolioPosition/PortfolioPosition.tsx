import { type ReactNode } from 'react'
import { type IArmadaPosition, type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import dayjs from 'dayjs'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultPositionUrl } from '@/helpers/get-vault-url'
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'
import { useHoldAlt } from '@/hooks/use-hold-alt'

import portfolioPositionStyles from './PortfolioPosition.module.css'

type PortfolioPositionProps = {
  portfolioPosition: {
    position: IArmadaPosition
    vault: SDKVaultishType
  }
  positionGraph: ReactNode
  sumrPrice?: number
  vaultApyData: VaultApyData
  isMobile?: boolean
}

const PortfolioPositionHeaderValue = ({
  title,
  titleVariant,
  value,
}: {
  title: ReactNode
  titleVariant?: 'p3semi' | 'p3semiColorful'
  value: ReactNode
}) => (
  <div className={portfolioPositionStyles.strategyInfoTopWrapper}>
    <Text variant={titleVariant ?? 'p3semi'} className={portfolioPositionStyles.header}>
      {title}
    </Text>
    <Text variant="h4" className={portfolioPositionStyles.value}>
      {value}
    </Text>
  </div>
)

export const PortfolioPosition = ({
  portfolioPosition,
  positionGraph,
  sumrPrice,
  vaultApyData,
  isMobile,
}: PortfolioPositionProps): React.ReactNode => {
  const {
    inputToken,
    protocol,
    totalValueLockedUSD,
    id: vaultId,
    customFields,
    rewardTokenEmissionsAmount,
    rewardTokenEmissionsFinish,
    rewardTokens,
    createdTimestamp,
  } = portfolioPosition.vault
  const {
    id: {
      user: {
        wallet: {
          address: { value: walletAddress },
        },
      },
    },
  } = portfolioPosition.position
  const isVaultAtLeast30dOld = createdTimestamp
    ? dayjs().diff(dayjs(Number(createdTimestamp) * 1000), 'day') > 30
    : false
  const apyCurrent = vaultApyData.apy ? formatDecimalAsPercent(vaultApyData.apy) : 'New strategy'
  const apyUpdatedAt = useApyUpdatedAt({
    vaultApyData,
  })
  const isAltPressed = useHoldAlt()
  const apy30dParsed = isVaultAtLeast30dOld
    ? vaultApyData.sma30d
      ? formatDecimalAsPercent(vaultApyData.sma30d)
      : 'n/a'
    : 'New Strategy'

  const { sumrTokenBonus } = getSumrTokenBonus(
    rewardTokens,
    rewardTokenEmissionsAmount,
    sumrPrice,
    totalValueLockedUSD,
    rewardTokenEmissionsFinish,
  )

  const linkToPosition = (
    <Link
      href={getVaultPositionUrl({
        network: protocol.network,
        vaultId: customFields?.slug ?? vaultId,
        walletAddress,
      })}
    >
      <Button variant="primarySmall" style={{ width: 'fit-content', margin: '0 auto' }}>
        View&nbsp;position
      </Button>
    </Link>
  )

  return (
    <Card variant="cardPrimary" className={portfolioPositionStyles.positionWrapperCard}>
      <div className={portfolioPositionStyles.positionWrapper}>
        <div className={portfolioPositionStyles.basicInfoWrapper}>
          <div className={portfolioPositionStyles.titleWithRisk}>
            <VaultTitleWithRisk
              symbol={getDisplayToken(inputToken.symbol)}
              risk={customFields?.risk ?? 'lower'}
              networkName={protocol.network}
              titleVariant="h3"
              isVaultCard
            />
            {isMobile && linkToPosition}
          </div>
          <PortfolioPositionHeaderValue
            titleVariant="p3semiColorful"
            title={
              <>
                $SUMR&nbsp;
                <Icon iconName="stars_colorful" size={24} style={{ display: 'inline' }} />
              </>
            }
            value={sumrTokenBonus}
          />
          <PortfolioPositionHeaderValue title="30d APY" value={apy30dParsed} />
          <PortfolioPositionHeaderValue
            title={
              <Tooltip
                tooltip={
                  <LiveApyInfo
                    apyCurrent={apyCurrent}
                    apyUpdatedAt={apyUpdatedAt}
                    isAltPressed={isAltPressed}
                  />
                }
                tooltipWrapperStyles={{
                  maxWidth: '455px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Text
                    variant="p4semi"
                    style={{
                      marginRight: 'var(--general-space-4)',
                    }}
                  >
                    Live&nbsp;APY&nbsp;(
                    {apyUpdatedAt.apyUpdatedAtLabel})
                  </Text>
                  <Icon iconName="info" size={16} />
                </div>
              </Tooltip>
            }
            value={apyCurrent}
          />
          {!isMobile && linkToPosition}
        </div>
        <div className={portfolioPositionStyles.graphWrapper}>{positionGraph}</div>
      </div>
    </Card>
  )
}
