import { type ReactNode } from 'react'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getVaultPositionUrl } from '@/helpers/get-vault-url'

import portfolioPositionStyles from './PortfolioPosition.module.scss'

type PortfolioPositionProps = {
  position: {
    positionData: IArmadaPosition
    vaultData: SDKVaultishType
  }
  positionGraph: ReactNode
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

export const PortfolioPosition = ({ position, positionGraph }: PortfolioPositionProps) => {
  const {
    inputToken,
    protocol,
    apr30d,
    calculatedApr,
    totalValueLockedUSD,
    id: vaultId,
    inputTokenPriceUSD,
    customFields,
  } = position.vaultData
  const {
    amount,
    id: {
      user: {
        wallet: {
          address: { value: walletAddress },
        },
      },
    },
    deposits,
    withdrawals,
  } = position.positionData
  const currentApr = formatDecimalAsPercent(new BigNumber(calculatedApr).div(100))
  const apr30dParsed = formatDecimalAsPercent(new BigNumber(apr30d).div(100))
  const marketValue = formatCryptoBalance(totalValueLockedUSD)
  const netContribution = formatCryptoBalance(new BigNumber(amount.amount))

  const totalDepositedInToken = deposits.reduce(
    (acc, deposit) => acc.plus(deposit.amount),
    new BigNumber(0),
  )

  const totalWithdrawnInToken = withdrawals.reduce(
    (acc, withdrawal) => acc.plus(withdrawal.amount),
    new BigNumber(0),
  )

  const earnedInToken = new BigNumber(amount.amount).minus(
    totalDepositedInToken.minus(totalWithdrawnInToken),
  )
  const earnedInUSD = formatCryptoBalance(earnedInToken.times(inputTokenPriceUSD ?? 0))

  return (
    <Card variant="cardPrimary" style={{ marginTop: 'var(--general-space-20)' }}>
      <div className={portfolioPositionStyles.positionWrapper}>
        <div className={portfolioPositionStyles.basicInfoWrapper}>
          <div style={{ width: '100%' }}>
            <VaultTitleWithRisk
              symbol={inputToken.symbol}
              risk={customFields?.risk ?? 'medium'}
              networkName={protocol.network}
            />
          </div>
          <PortfolioPositionHeaderValue
            titleVariant="p3semiColorful"
            title={
              <>
                $SUMR&nbsp;
                <Icon iconName="stars_colorful" size={24} style={{ display: 'inline' }} />
              </>
            }
            value="TBD%"
          />
          <PortfolioPositionHeaderValue title="30d APY" value={apr30dParsed} />
          <PortfolioPositionHeaderValue title="Current APY" value={currentApr} />
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
        </div>
        <div className={portfolioPositionStyles.graphWrapper}>
          {positionGraph}
          <div className={portfolioPositionStyles.statsWrapper}>
            <DataBlock
              accent="var(--color-background-interactive)"
              title="Market Value"
              size="small"
              valueStyle={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--general-space-4)',
              }}
              value={
                <>
                  <Icon tokenName={inputToken.symbol as TokenSymbolsList} size={20} />${marketValue}
                </>
              }
            />
            <DataBlock
              accent="#FF80BF"
              title="Net Contributions"
              size="small"
              valueStyle={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--general-space-4)',
              }}
              value={
                <>
                  <Icon tokenName={inputToken.symbol as TokenSymbolsList} size={20} />$
                  {netContribution}
                </>
              }
            />
            <DataBlock
              accent="var(--color-background-interactive-disabled)"
              title="Earnings to Date"
              size="small"
              valueStyle={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--general-space-4)',
              }}
              value={
                <>
                  <Icon tokenName={inputToken.symbol as TokenSymbolsList} size={20} />${earnedInUSD}
                </>
              }
            />
            <DataBlock
              accent="var(--color-text-primary)"
              title="$SUMR Earned"
              size="small"
              valueStyle={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--general-space-4)',
              }}
              value={
                <>
                  <Icon tokenName="SUMR" size={20} />
                  TBD
                </>
              }
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
