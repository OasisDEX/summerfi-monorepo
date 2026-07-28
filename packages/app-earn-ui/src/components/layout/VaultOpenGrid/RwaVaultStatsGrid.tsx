'use client'

import { type FC } from 'react'
import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { Box } from '@/components/atoms/Box/Box'
import { Icon } from '@/components/atoms/Icon/Icon'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { NavPrice } from '@/components/molecules/NavPrice/NavPrice'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { getDisplayToken } from '@/helpers/get-display-token'

// Vault-wide true TVL (Fleet assets + pending deposits + claimable withdrawals), denominated in the
// Fleet input asset. Minimal structural shape of the SDK's `IRwaVaultMarketValue` (`.amount` is the
// human-readable decimal string) so this shared component stays decoupled from the SDK type.
export interface RwaVaultMarketValue {
  total: { amount: string }
  totalUsd: { amount: string }
}

interface RwaVaultStatsGridProps {
  vault: SDKVaultishType
  // When provided, the "Market Value" stat uses this broader TVL (including settling deposits)
  // instead of the subgraph TVL, which only reflects settled Fleet assets.
  rwaMarketValue?: RwaVaultMarketValue
  rwaMarketValueLoading?: boolean
  // Manage view: when provided, the first block renders as "Position Market Value" — the connected
  // user's current position value (token + USD) — instead of the vault-wide "Market Value".
  positionMarketValue?: { netValue: BigNumber; netValueUSD: BigNumber }
  isMobileOrTablet?: boolean
}

export const RwaVaultStatsGrid: FC<RwaVaultStatsGridProps> = ({
  vault,
  rwaMarketValue,
  rwaMarketValueLoading,
  positionMarketValue,
  isMobileOrTablet,
}) => {
  // Prefer the broader market value (includes not-yet-settled deposits); fall back to the subgraph
  // settled-only TVL until it loads.
  const marketValueToken = rwaMarketValue
    ? new BigNumber(rwaMarketValue.total.amount)
    : new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals))
  const marketValueUSD = rwaMarketValue
    ? new BigNumber(rwaMarketValue.totalUsd.amount)
    : new BigNumber(vault.totalValueLockedUSD)

  const totalValueLockedUSDParsed = formatCryptoBalance(marketValueUSD)
  const totalValueLockedTokenParsed = formatCryptoBalance(marketValueToken)

  return (
    <>
      <SimpleGrid
        columns={isMobileOrTablet ? 1 : 3}
        rows={isMobileOrTablet ? 3 : 1}
        gap="var(--general-space-16)"
        style={{ marginBottom: 'var(--general-space-16)' }}
      >
        <Box>
          {positionMarketValue ? (
            <DataBlock
              size="large"
              titleSize="small"
              title="Position Market Value"
              value={
                <>
                  {formatCryptoBalance(positionMarketValue.netValue)}
                  &nbsp;{getDisplayToken(vault.inputToken.symbol)}
                </>
              }
              subValue={`$${formatCryptoBalance(positionMarketValue.netValueUSD)}`}
              subValueSize="small"
            />
          ) : (
            <DataBlock
              size="large"
              titleSize="small"
              title="Market Value"
              value={
                <>
                  {rwaMarketValueLoading ? (
                    <SkeletonLine height={24} width={70} style={{ display: 'inline-block' }} />
                  ) : (
                    totalValueLockedTokenParsed
                  )}
                  &nbsp;{getDisplayToken(vault.inputToken.symbol)}
                </>
              }
              subValue={
                rwaMarketValueLoading ? (
                  <SkeletonLine height={20} width={50} />
                ) : (
                  `$${totalValueLockedUSDParsed}`
                )
              }
              subValueSize="small"
            />
          )}
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title={
              <Tooltip
                tooltipWrapperStyles={{
                  minWidth: '200px',
                }}
                tooltip={
                  <Text variant="p4" style={{ color: 'var(--color-text-primary)' }}>
                    Minimum amount required to enter this vault.
                  </Text>
                }
              >
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Text variant="p3semi" style={{ marginRight: 'var(--general-space-4)' }}>
                    Min&nbsp;Deposit
                  </Text>
                  <Icon iconName="info" size={16} />
                </div>
              </Tooltip>
            }
            value={
              vault.customFields?.minimumDeposit ? (
                <>
                  {formatCryptoBalance(vault.customFields.minimumDeposit)}&nbsp;
                  {getDisplayToken(vault.inputToken.symbol)}
                </>
              ) : (
                'n/a'
              )
            }
            subValue="No max"
            subValueSize="small"
          />
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="NAV Price"
            value={
              <NavPrice
                pricePerShare={vault.pricePerShare}
                inputTokenSymbol={vault.inputToken.symbol}
              />
            }
            subValue={
              vault.navPriceChange24h != null
                ? `${formatDecimalAsPercent(vault.navPriceChange24h, { plus: true, precision: 4 })} (24h)`
                : 'n/a'
            }
            subValueType={
              vault.navPriceChange24h == null || vault.navPriceChange24h === 0
                ? 'neutral'
                : vault.navPriceChange24h > 0
                  ? 'positive'
                  : 'negative'
            }
            subValueSize="small"
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid
        columns={isMobileOrTablet ? 1 : 3}
        rows={isMobileOrTablet ? 3 : 1}
        gap="var(--general-space-16)"
        style={{ marginBottom: 'var(--general-space-16)' }}
      >
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="30D Net APY"
            tooltipIconName="info"
            titleTooltip={
              vault.navApy30dPartialDays != null
                ? `Vault has been deployed recently and the value is calculated using the last ${vault.navApy30dPartialDays} days`
                : undefined
            }
            value={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text variant="h4" style={{ marginRight: 'var(--general-space-8)' }}>
                  {vault.navApy30d != null ? formatDecimalAsPercent(vault.navApy30d) : 'n/a'}
                </Text>
                <Icon iconName="stars_colorful" size={20} />
              </div>
            }
            subValueSize="small"
          />
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="Avg Redemption Time"
            value="n/a"
            subValueSize="small"
          />
        </Box>
        <Box>
          <DataBlock
            size="large"
            titleSize="small"
            title="Investor Type"
            value={vault.customFields?.bestFor ?? 'n/a'}
            valueSize="xsmall"
          />
        </Box>
      </SimpleGrid>
    </>
  )
}
