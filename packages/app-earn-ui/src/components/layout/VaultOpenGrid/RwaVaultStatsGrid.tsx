'use client'

import { type FC, type ReactNode } from 'react'
import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { Box } from '@/components/atoms/Box/Box'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { NavPrice } from '@/components/molecules/NavPrice/NavPrice'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { getDisplayToken } from '@/helpers/get-display-token'

interface RwaVaultStatsGridProps {
  vault: SDKVaultishType
  isMobileOrTablet?: boolean
  tooltipEventHandler: (tooltipName: string) => void
  apy30d: ReactNode
}

export const RwaVaultStatsGrid: FC<RwaVaultStatsGridProps> = ({
  vault,
  isMobileOrTablet,
  tooltipEventHandler,
  apy30d,
}) => {
  const totalValueLockedUSDParsed = formatCryptoBalance(new BigNumber(vault.totalValueLockedUSD))
  const totalValueLockedTokenParsed = formatCryptoBalance(
    new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
  )

  return (
    <>
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
            title="Market Value"
            value={
              <>
                {totalValueLockedTokenParsed}&nbsp;{getDisplayToken(vault.inputToken.symbol)}
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
            title={
              <Tooltip
                tooltipName="vault-open-rwa-min-deposit"
                onTooltipOpen={tooltipEventHandler}
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
            subValue="n/a"
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
            tooltipName="vault-open-30d-apy"
            onTooltipOpen={tooltipEventHandler}
            value={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text variant="h4" style={{ marginRight: 'var(--general-space-8)' }}>
                  {apy30d}
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
