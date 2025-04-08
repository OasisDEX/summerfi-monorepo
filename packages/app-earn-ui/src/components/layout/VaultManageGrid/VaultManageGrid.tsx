'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type SDKVaultsListType,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import { AdditionalBonusLabel } from '@/components/atoms/AdditionalBonusLabel/AdditionalBonusLabel'
import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getPositionValues } from '@/helpers/get-position-values'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { isVaultAtLeastDaysOld } from '@/helpers/is-vault-at-least-days-old'

import vaultManageGridStyles from './VaultManageGrid.module.scss'

interface VaultManageGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  detailsContent: ReactNode[]
  sidebarContent: ReactNode
  connectedWalletAddress?: string
  viewWalletAddress: string
  isMobile?: boolean
  displaySimulationGraph?: boolean
  simulationGraph: ReactNode
  sumrPrice?: number
  onRefresh?: (chainName?: string, vaultId?: string, walletAddress?: string) => void
  vaultApyData: VaultApyData
  rightExtraContent?: ReactNode
}

export const VaultManageGrid: FC<VaultManageGridProps> = ({
  vault,
  vaultApyData,
  vaults,
  detailsContent,
  sidebarContent,
  position,
  connectedWalletAddress,
  viewWalletAddress,
  isMobile,
  simulationGraph,
  displaySimulationGraph,
  sumrPrice,
  onRefresh,
  rightExtraContent,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displaySimulationGraphStaggered, setDisplaySimulationGraphStaggered] =
    useState(displaySimulationGraph)

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault, days: 30 })

  const apy30d = isVaultAtLeast30dOld
    ? vaultApyData.sma30d
      ? formatDecimalAsPercent(vaultApyData.sma30d)
      : 'n/a'
    : 'New strategy'
  const aprCurrent = vaultApyData.apy ? formatDecimalAsPercent(vaultApyData.apy) : 'New strategy'

  const noOfDeposits = position.deposits.length.toString()

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

  const { netDeposited, netEarnings, netValue } = getPositionValues({
    position,
    vault,
  })

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus(
    vault.rewardTokens,
    vault.rewardTokenEmissionsAmount,
    sumrPrice,
    vault.totalValueLockedUSD,
  )
  const handleUserRefresh = () => {
    onRefresh?.(sdkNetworkToHumanNetwork(vault.protocol.network), vault.id, viewWalletAddress)
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  return (
    <>
      <div className={vaultManageGridStyles.vaultManageGridBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn
            </Text>
          </Link>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <Link href={getVaultUrl(vault)} style={{ color: 'white' }}>
            <Text as="span" variant="p3">
              {vault.customFields?.name ?? vault.id}
            </Text>
          </Link>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <Text as="span" variant="p3" color="white">
            {viewWalletAddress.toLowerCase() === connectedWalletAddress?.toLowerCase()
              ? 'Your'
              : viewWalletAddress}{' '}
            Position
            <div
              onClick={handleUserRefresh}
              className={clsx(vaultManageGridStyles.refreshManageWrapper, {
                [vaultManageGridStyles.refreshingManage]: isRefreshing,
              })}
            >
              <Icon iconName="refresh" size={16} />
            </div>
          </Text>
        </div>
      </div>
      <div className={vaultManageGridStyles.vaultManageGridPositionWrapper}>
        <div>
          <div className={vaultManageGridStyles.vaultManageGridTopLeftWrapper}>
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
                risk={vault.customFields?.risk ?? 'lower'}
                networkName={vault.protocol.network}
              />
            </Dropdown>
            <div className={vaultManageGridStyles.vaultBonusWrapper}>
              {Number(rawSumrTokenBonus) > 0 && (
                <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  <BonusLabel
                    tokenBonus={sumrTokenBonus}
                    withTokenBonus={Number(rawSumrTokenBonus) > 0}
                  />
                </Text>
              )}
              <AdditionalBonusLabel bonus={vault.customFields?.bonus} />
            </div>
          </div>
          <AnimateHeight id="simulation-graph" scale show={displaySimulationGraphStaggered}>
            {simulationGraph}
          </AnimateHeight>
          <SimpleGrid
            columns={isMobile ? 1 : 3}
            rows={isMobile ? 3 : 1}
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
                    {formatCryptoBalance(netValue)}&nbsp;{getDisplayToken(vault.inputToken.symbol)}
                  </>
                }
                subValue={
                  <>
                    Earned:&nbsp;
                    {formatCryptoBalance(netEarnings)}&nbsp;
                    {getDisplayToken(vault.inputToken.symbol)}
                  </>
                }
                subValueType={netEarnings.isPositive() ? 'positive' : 'negative'}
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Net Contribution"
                value={
                  <>
                    {formatCryptoBalance(netDeposited)}&nbsp;
                    {getDisplayToken(vault.inputToken.symbol)}
                  </>
                }
                subValue={`# of Deposits: ${noOfDeposits}`}
                subValueSize="medium"
                subValueStyle={{ color: 'var(--earn-protocol-success-100)' }}
              />
            </Box>
            <Box>
              {isVaultAtLeast30dOld ? (
                <DataBlock
                  size="large"
                  titleSize="small"
                  title="30d APY"
                  value={apy30d}
                  subValue={`Current APY: ${aprCurrent}`}
                  subValueType="neutral"
                  subValueSize="medium"
                />
              ) : (
                <DataBlock size="large" titleSize="small" title="Current APY" value={aprCurrent} />
              )}
            </Box>
          </SimpleGrid>
          {isMobile && rightExtraContent && (
            <div className={vaultManageGridStyles.rightExtraBlockMobileWrapper}>
              {rightExtraContent}
            </div>
          )}
          {Array.isArray(detailsContent) && detailsContent.length > 0 ? (
            detailsContent.map((content, index) => (
              <Box
                key={index}
                className={vaultManageGridStyles.leftBlock}
                style={{ marginBottom: 'var(--general-space-20)' }}
              >
                {content}
              </Box>
            ))
          ) : (
            <Box className={vaultManageGridStyles.leftBlock}>{detailsContent}</Box>
          )}
        </div>
        <div className={vaultManageGridStyles.rightBlockWrapper}>
          <div className={vaultManageGridStyles.rightBlock}>
            {sidebarContent}
            {rightExtraContent && rightExtraContent}
          </div>
        </div>
      </div>
      {isMobile && <div className={vaultManageGridStyles.rightBlockMobile}>{sidebarContent}</div>}
    </>
  )
}
