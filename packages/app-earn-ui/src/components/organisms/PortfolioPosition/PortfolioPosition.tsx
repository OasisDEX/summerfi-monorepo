import { type ReactNode } from 'react'
import { type IArmadaPosition, type SDKVaultishType } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultPositionUrl } from '@/helpers/get-vault-url'

import portfolioPositionStyles from './PortfolioPosition.module.scss'

type PortfolioPositionProps = {
  portfolioPosition: {
    position: IArmadaPosition
    vault: SDKVaultishType
  }
  positionGraph: ReactNode
  sumrPrice?: number
  apy?: number
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
  apy,
  isMobile,
}: PortfolioPositionProps) => {
  const {
    inputToken,
    protocol,
    apr30d,
    totalValueLockedUSD,
    id: vaultId,
    customFields,
    rewardTokenEmissionsAmount,
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
  const currentApr = formatDecimalAsPercent(apy ?? 0)
  const apr30dParsed = isVaultAtLeast30dOld
    ? formatDecimalAsPercent(new BigNumber(apr30d).div(100))
    : 'New Strategy'

  const { sumrTokenBonus } = getSumrTokenBonus(
    rewardTokens,
    rewardTokenEmissionsAmount,
    sumrPrice,
    totalValueLockedUSD,
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
    <Card variant="cardPrimary" style={{ marginTop: 'var(--general-space-20)' }}>
      <div className={portfolioPositionStyles.positionWrapper}>
        <div className={portfolioPositionStyles.basicInfoWrapper}>
          <div className={portfolioPositionStyles.titleWithRisk}>
            <VaultTitleWithRisk
              symbol={getDisplayToken(inputToken.symbol)}
              risk={customFields?.risk ?? 'lower'}
              networkName={protocol.network}
              titleVariant="h3"
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
          <PortfolioPositionHeaderValue title="30d APY" value={apr30dParsed} />
          <PortfolioPositionHeaderValue title="Current APY" value={currentApr} />
          {!isMobile && linkToPosition}
        </div>
        <div className={portfolioPositionStyles.graphWrapper}>{positionGraph}</div>
      </div>
    </Card>
  )
}
