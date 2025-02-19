'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  getArksWeightedApy,
  sdkNetworkToHumanNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultUrl } from '@/helpers/get-vault-url'

import vaultOpenGridStyles from './VaultOpenGrid.module.scss'

interface VaultOpenGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  displaySimulationGraph?: boolean
  simulationGraph: ReactNode
  detailsContent: ReactNode
  sidebarContent: ReactNode
  isMobile?: boolean
  medianDefiYield?: number
  sumrPrice?: number
  onRefresh?: (chainName?: string, vaultId?: string, walletAddress?: string) => void
}

export const VaultOpenGrid: FC<VaultOpenGridProps> = ({
  vault,
  vaults,
  displaySimulationGraph,
  simulationGraph,
  detailsContent,
  sidebarContent,
  isMobile,
  medianDefiYield,
  sumrPrice,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displaySimulationGraphStaggered, setDisplaySimulationGraphStaggered] =
    useState(displaySimulationGraph)

  const isVaultAtLeast30dOld = vault.createdTimestamp
    ? dayjs().diff(dayjs(Number(vault.createdTimestamp) * 1000), 'day') > 30
    : false
  const apr30d = isVaultAtLeast30dOld
    ? formatDecimalAsPercent(new BigNumber(vault.apr30d).div(100))
    : 'New strategy'
  const aprCurrent = formatDecimalAsPercent(getArksWeightedApy(vault))
  const totalValueLockedUSDParsed = formatCryptoBalance(new BigNumber(vault.totalValueLockedUSD))
  const totalValueLockedTokenParsed = formatCryptoBalance(
    new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
  )

  const medianBN = medianDefiYield ? new BigNumber(medianDefiYield) : null
  const medianDefiYieldDifference = medianBN
    ? new BigNumber(vault.calculatedApr).minus(medianBN)
    : null

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplaySimulationGraphStaggered(false)
    }, 1000)

    if (displaySimulationGraph) {
      clearInterval(timer)
      setDisplaySimulationGraphStaggered(true)
    }

    return () => {
      clearInterval(timer)
    }
  }, [displaySimulationGraph])

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus(
    vault.rewardTokens,
    vault.rewardTokenEmissionsAmount,
    sumrPrice,
    vault.totalValueLockedUSD,
  )

  const handleUserRefresh = () => {
    onRefresh?.(sdkNetworkToHumanNetwork(vault.protocol.network), vault.id)
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  return (
    <>
      <div className={vaultOpenGridStyles.vaultOpenGridBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn / &nbsp;
            </Text>
          </Link>
          <Text as="span" variant="p3" color="white">
            {vault.customFields?.name ?? vault.id}
          </Text>
          <div
            onClick={handleUserRefresh}
            className={clsx(vaultOpenGridStyles.refreshWrapper, {
              [vaultOpenGridStyles.refreshing]: isRefreshing,
            })}
          >
            <Icon iconName="refresh" size={16} />
          </div>
        </div>
      </div>
      <div className={vaultOpenGridStyles.vaultOpenGridPositionWrapper}>
        <div>
          <div className={vaultOpenGridStyles.vaultOpenGridTopLeftWrapper}>
            <Dropdown
              options={vaults.map((item) => ({
                value: getVaultUrl(item),
                content: <VaultTitleDropdownContent vault={item} link={getVaultUrl(item)} />,
              }))}
              dropdownValue={{
                value: getVaultUrl(vault),
                content: <VaultTitleDropdownContent vault={vault} link={getVaultUrl(vault)} />,
              }}
            >
              <VaultTitleWithRisk
                symbol={getDisplayToken(vault.inputToken.symbol)}
                // TODO: fill data
                risk={vault.customFields?.risk ?? 'lower'}
                networkName={vault.protocol.network}
              />
            </Dropdown>
            {Number(rawSumrTokenBonus) > 0 && (
              <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                <BonusLabel tokenBonus={sumrTokenBonus} withTokenBonus />
              </Text>
            )}
          </div>
          <AnimateHeight id="simulation-graph" scale show={displaySimulationGraphStaggered}>
            {simulationGraph}
          </AnimateHeight>
          <SimpleGrid
            columns={2}
            rows={2}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="30d APY"
                value={apr30d}
                subValue={
                  isVaultAtLeast30dOld ? `Current APY: ${aprCurrent}` : 'Requires more data'
                }
                subValueType={isVaultAtLeast30dOld ? 'neutral' : 'positive'}
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Current APY"
                value={aprCurrent}
                subValue={
                  medianBN ? (
                    <Tooltip
                      tooltip={
                        <>
                          Median&nbsp;DeFi&nbsp;Yield:&nbsp;$
                          {formatDecimalAsPercent(medianBN.div(100))}
                        </>
                      }
                    >
                      <div>
                        {medianDefiYieldDifference
                          ? `${medianDefiYieldDifference.gt(0) ? '+' : ''}${formatDecimalAsPercent(
                              medianDefiYieldDifference.div(100),
                            )} vs Median DeFi Yield`
                          : ''}
                      </div>
                    </Tooltip>
                  ) : null
                }
                subValueType={medianDefiYieldDifference?.gt(0) ? 'positive' : 'neutral'}
                subValueSize="medium"
              />
            </Box>
            <Box
              style={{
                gridColumn: '1/3',
              }}
            >
              <DataBlock
                size="large"
                titleSize="small"
                title="Assets in vault"
                value={`${totalValueLockedTokenParsed} ${getDisplayToken(vault.inputToken.symbol)}`}
                subValue={`$${totalValueLockedUSDParsed}`}
                subValueSize="medium"
              />
            </Box>
          </SimpleGrid>
          <Box className={vaultOpenGridStyles.leftBlock}>{detailsContent}</Box>
        </div>
        <div className={vaultOpenGridStyles.rightBlockWrapper}>
          <div className={vaultOpenGridStyles.rightBlock}>{sidebarContent}</div>
        </div>
      </div>
      {isMobile && <div className={vaultOpenGridStyles.rightBlockMobile}>{sidebarContent}</div>}
    </>
  )
}
