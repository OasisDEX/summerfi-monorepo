import { type ReactNode } from 'react'
import { type IArmadaPosition, type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getVaultPositionUrl } from '@/helpers/get-vault-url'

import portfolioPositionStyles from './PortfolioPosition.module.scss'

type PortfolioPositionProps = {
  position: {
    positionData: IArmadaPosition
    vaultData: SDKVaultsListType[number]
  }
  positionGraph: ReactNode
}

export const PortfolioPosition = ({ position, positionGraph }: PortfolioPositionProps) => {
  const {
    inputToken,
    protocol,
    name: vaultName,
    apr30d,
    apr365d,
    totalValueLockedUSD,
    id: vaultId,
    inputTokenPriceUSD,
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
  const apr30dParsed = formatDecimalAsPercent(new BigNumber(apr30d).div(100))
  // TODO: fill data
  const aprAllTime = formatDecimalAsPercent(new BigNumber(apr365d).div(100))
  const marketValue = formatCryptoBalance(totalValueLockedUSD)
  const netContribution = new BigNumber(amount.amount)

  const totalDepositedInToken = deposits.reduce(
    (acc, deposit) => acc.plus(deposit.amount),
    new BigNumber(0),
  )

  const totalWithdrawnInToken = withdrawals.reduce(
    (acc, withdrawal) => acc.plus(withdrawal.amount),
    new BigNumber(0),
  )

  const earnedInToken = netContribution.minus(totalDepositedInToken.minus(totalWithdrawnInToken))
  const earnedInUSD = earnedInToken.times(inputTokenPriceUSD || 0)

  return (
    <Card variant="cardSecondary" style={{ marginTop: 'var(--general-space-20)' }}>
      <div>
        <SimpleGrid columns={3}>
          <div className={portfolioPositionStyles.basicInfoWrapper}>
            <VaultTitleWithRisk
              symbol={inputToken.symbol}
              // TODO: fill data
              risk="low"
              networkName={protocol.network}
            />
            <Text
              style={{
                color: 'var(--earn-protocol-secondary-100)',
                marginLeft: 'var(--general-space-16)',
              }}
            >
              <BonusLabel
                // TODO: fill data
                rays="1,111"
              />
            </Text>
          </div>
          <div className={portfolioPositionStyles.strategyInfoTopWrapper}>
            <Text variant="p3semi" className={portfolioPositionStyles.header}>
              Strategy
            </Text>
            <Text variant="h4" className={portfolioPositionStyles.value}>
              {vaultName}
            </Text>
            <Text variant="p3semi" className={portfolioPositionStyles.subValue}>
              xxx
            </Text>
          </div>
          <div className={portfolioPositionStyles.strategyInfoTopWrapper}>
            <Text variant="p3semi" className={portfolioPositionStyles.header}>
              Earnings
            </Text>
            <Text variant="h4" className={portfolioPositionStyles.value}>
              {formatCryptoBalance(earnedInToken)}&nbsp;{inputToken.symbol}
            </Text>
            <Text variant="p3semi" className={portfolioPositionStyles.subValue}>
              {`$${formatCryptoBalance(earnedInUSD)}`}
            </Text>
          </div>
        </SimpleGrid>
        {positionGraph}
        <SimpleGrid columns={5}>
          <DataBlock
            accent="var(--color-background-interactive)"
            title="Market Value"
            size="small"
            value={`$${marketValue}`}
          />
          <DataBlock
            accent="var(--color-background-interactive-hover)"
            title="Net Contributions"
            size="small"
            value={`$${netContribution}`}
          />
          <DataBlock title="30d APY" size="small" value={apr30dParsed} />
          <DataBlock title="All time APY" size="small" value={aprAllTime} />
          <div>
            <Link
              href={getVaultPositionUrl({
                network: protocol.network,
                vaultId,
                walletAddress,
              })}
            >
              <Button variant="secondarySmall" style={{ width: 'fit-content', margin: '0 auto' }}>
                View position
              </Button>
            </Link>
          </div>
        </SimpleGrid>
      </div>
    </Card>
  )
}
