'use client'

import { type FC, type ReactNode } from 'react'
import { type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { Box } from '@/components/atoms/Box/Box'
import { ChartBar } from '@/components/atoms/ChartBar/ChartBar'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { getDisplayToken } from '@/helpers/get-display-token'
import { isVaultAtLeastDaysOld } from '@/helpers/is-vault-at-least-days-old'
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'
import { useHoldAlt } from '@/hooks/use-hold-alt'

interface StandardVaultStatsGridProps {
  vault: SDKVaultishType
  vaultApyData: VaultApyData
  medianDefiYield?: number
  isMobileOrTablet?: boolean
  apy30d: ReactNode
}

export const StandardVaultStatsGrid: FC<StandardVaultStatsGridProps> = ({
  vault,
  vaultApyData,
  medianDefiYield,
  isMobileOrTablet,
  apy30d,
}) => {
  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault, days: 30 })
  const isAltPressed = useHoldAlt()
  const apyUpdatedAt = useApyUpdatedAt({ vaultApyData })
  const apyCurrent = vaultApyData.apy ? formatDecimalAsPercent(vaultApyData.apy) : 'New strategy'

  const totalValueLockedUSDParsed = formatCryptoBalance(new BigNumber(vault.totalValueLockedUSD))
  const totalValueLockedTokenParsed = formatCryptoBalance(
    new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
  )
  const withdrawableTotalAssetsUSDParsed = formatCryptoBalance(
    new BigNumber(vault.withdrawableTotalAssetsUSD.toString()),
  )
  const withdrawableTotalAssetsParsed = formatCryptoBalance(
    new BigNumber(vault.withdrawableTotalAssets.toString()).div(ten.pow(vault.inputToken.decimals)),
  )
  const withdrawablePercentage = new BigNumber(vault.withdrawableTotalAssets.toString())
    .div(vault.inputTokenBalance.toString())
    .toFixed(8)

  const depositCapInToken = new BigNumber(vault.depositCap.toString()).div(
    ten.pow(vault.inputToken.decimals),
  )
  const depositCapUsed = new BigNumber(vault.inputTokenBalance.toString())
    .div(ten.pow(vault.inputToken.decimals))
    .div(depositCapInToken)

  const medianBN = medianDefiYield ? new BigNumber(medianDefiYield) : null
  const medianDefiYield30DDifference =
    medianBN && vaultApyData.sma30d
      ? new BigNumber(vaultApyData.sma30d * 100).minus(medianBN)
      : null
  const medianDefiYieldLiveDifference =
    medianBN && vaultApyData.apy ? new BigNumber(vaultApyData.apy * 100).minus(medianBN) : null

  return (
    <>
      <SimpleGrid
        columns={isMobileOrTablet ? 1 : 3}
        rows={isMobileOrTablet ? 2 : 1}
        gap="var(--general-space-16)"
        style={{ marginBottom: 'var(--general-space-16)' }}
      >
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="Assets in vault"
            value={
              <>
                {totalValueLockedTokenParsed}&nbsp;
                {getDisplayToken(vault.inputToken.symbol)}
              </>
            }
            subValue={`$${totalValueLockedUSDParsed}`}
            subValueSize="small"
          />
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="Instant liquidity"
            value={
              <>
                {withdrawableTotalAssetsParsed}&nbsp;
                {getDisplayToken(vault.inputToken.symbol)}
              </>
            }
            subValue={`$${withdrawableTotalAssetsUSDParsed} (${formatDecimalAsPercent(
              withdrawablePercentage,
              {
                plus: false,
              },
            )})`}
            subValueSize="small"
          />
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="Deposit Cap"
            value={
              <>
                {formatCryptoBalance(depositCapInToken)}&nbsp;
                {getDisplayToken(vault.inputToken.symbol)}
              </>
            }
            subValue={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--general-space-20)',
                  flexWrap: 'wrap',
                }}
              >
                {formatDecimalAsPercent(BigNumber.min(depositCapUsed, 1))} filled
                <ChartBar value={formatDecimalAsPercent(depositCapUsed)} />
              </div>
            }
            subValueSize="small"
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid
        columns={isMobileOrTablet ? 1 : 2}
        rows={isMobileOrTablet ? 2 : 1}
        gap="var(--general-space-16)"
        style={{ marginBottom: 'var(--general-space-16)' }}
      >
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="30d Native Yield APY"
            value={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text variant="h4" style={{ marginRight: 'var(--general-space-8)' }}>
                  {apy30d}
                </Text>
                <Icon iconName="stars_colorful" size={20} />
              </div>
            }
            subValue={
              medianBN && medianDefiYield30DDifference && isVaultAtLeast30dOld ? (
                <Tooltip
                  tooltip={
                    <>
                      Median&nbsp;DeFi&nbsp;Yield:&nbsp;
                      {formatDecimalAsPercent(medianBN.div(100))}
                    </>
                  }
                >
                  <div>
                    {`${medianDefiYield30DDifference.gt(0) ? '+' : ''}${formatDecimalAsPercent(
                      medianDefiYield30DDifference.div(100),
                    )} vs Median DeFi Yield`}
                  </div>
                </Tooltip>
              ) : null
            }
            subValueType={medianDefiYield30DDifference?.gt(0) ? 'positive' : 'neutral'}
            subValueSize="small"
          />
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
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
                    variant="p3semi"
                    style={{
                      marginRight: 'var(--general-space-4)',
                    }}
                  >
                    Live&nbsp;Native&nbsp;APY&nbsp;(
                    {apyUpdatedAt.apyUpdatedAtLabel})
                  </Text>
                  <Icon iconName="info" size={16} />
                </div>
              </Tooltip>
            }
            value={apyCurrent}
            subValue={
              medianBN && medianDefiYieldLiveDifference ? (
                <Tooltip
                  tooltip={
                    <>
                      Median&nbsp;DeFi&nbsp;Yield:&nbsp;
                      {formatDecimalAsPercent(medianBN.div(100))}
                    </>
                  }
                >
                  <div>
                    {`${medianDefiYieldLiveDifference.gt(0) ? '+' : ''}${formatDecimalAsPercent(
                      medianDefiYieldLiveDifference.div(100),
                    )} vs Median DeFi Yield`}
                  </div>
                </Tooltip>
              ) : null
            }
            subValueType={medianDefiYieldLiveDifference?.gt(0) ? 'positive' : 'neutral'}
            subValueSize="small"
          />
        </Box>
      </SimpleGrid>
    </>
  )
}
