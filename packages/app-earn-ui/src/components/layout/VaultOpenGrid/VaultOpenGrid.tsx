'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import {
  type IArmadaVaultInfo,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SupportedNetworkIds,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  sdkNetworkToHumanNetwork,
  slugifyVault,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'

import { AdditionalBonusLabel } from '@/components/atoms/AdditionalBonusLabel/AdditionalBonusLabel'
import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { ChartBar } from '@/components/atoms/ChartBar/ChartBar'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { isVaultAtLeastDaysOld } from '@/helpers/is-vault-at-least-days-old'
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'
import { useHoldAlt } from '@/hooks/use-hold-alt'

import vaultOpenGridStyles from './VaultOpenGrid.module.css'

interface VaultOpenGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  displaySimulationGraph?: boolean
  simulationGraph: ReactNode
  detailsContent: ReactNode
  sidebarContent: ReactNode
  isMobileOrTablet?: boolean
  medianDefiYield?: number
  sumrPrice?: number
  onRefresh?: (params: { chainName?: string; vaultId?: string; walletAddress?: string }) => void
  vaultApyData: VaultApyData
  rightExtraContent?: ReactNode
  headerLink?: {
    label: string
    href: string
  }
  disableDropdownOptionsByChainId?: SupportedNetworkIds
  getOptionUrl?: (option: SDKVaultishType) => string
  tooltipEventHandler: (tooltipName: string) => void
  buttonClickEventHandler: (buttonName: string) => void
  dropdownChangeHandler: ({ inputName, value }: { inputName: string; value: string }) => void
}

export const VaultOpenGrid: FC<VaultOpenGridProps> = ({
  vault,
  vaultInfo,
  vaults,
  displaySimulationGraph,
  simulationGraph,
  detailsContent,
  sidebarContent,
  isMobileOrTablet,
  medianDefiYield,
  sumrPrice,
  onRefresh,
  vaultApyData,
  rightExtraContent,
  headerLink = {
    label: 'Earn',
    href: '/',
  },
  disableDropdownOptionsByChainId,
  getOptionUrl,
  buttonClickEventHandler,
  tooltipEventHandler,
  dropdownChangeHandler,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displaySimulationGraphStaggered, setDisplaySimulationGraphStaggered] =
    useState(displaySimulationGraph)

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault, days: 30 })
  const isAltPressed = useHoldAlt()

  const apy30d = isVaultAtLeast30dOld ? (
    vaultApyData.sma30d ? (
      formatDecimalAsPercent(vaultApyData.sma30d)
    ) : (
      'n/a'
    )
  ) : (
    <Tooltip
      tooltip={
        <Text variant="p4" style={{ color: 'var(--color-text-primary)' }}>
          This vault is only {dayjs().diff(dayjs(Number(vault.createdTimestamp) * 1000), 'day')}{' '}
          days old. 30d APY will be available after 30 days.
        </Text>
      }
      tooltipWrapperStyles={{
        width: '300px',
      }}
    >
      <span>New&nbsp;strategy</span>
    </Tooltip>
  )
  const apyCurrent = vaultApyData.apy ? formatDecimalAsPercent(vaultApyData.apy) : 'New strategy'
  const apyUpdatedAt = useApyUpdatedAt({
    vaultApyData,
  })
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

  const medianBN = medianDefiYield ? new BigNumber(medianDefiYield) : null
  const medianDefiYield30DDifference =
    medianBN && vaultApyData.sma30d
      ? new BigNumber(vaultApyData.sma30d * 100).minus(medianBN)
      : null
  const medianDefiYieldLiveDifference =
    medianBN && vaultApyData.apy ? new BigNumber(vaultApyData.apy * 100).minus(medianBN) : null

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

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus({
    merklRewards: vaultInfo?.merklRewards,
    sumrPrice,
    totalValueLockedUSD: vault.totalValueLockedUSD,
  })

  const handleUserRefresh = () => {
    buttonClickEventHandler(`vault-open-refresh-button`)
    onRefresh?.({
      chainName: sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
      vaultId: vault.id,
    })
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  const depositCapInToken = new BigNumber(vault.depositCap.toString()).div(
    ten.pow(vault.inputToken.decimals),
  )

  const depositCapUsed = new BigNumber(vault.inputTokenBalance.toString())
    .div(ten.pow(vault.inputToken.decimals))
    .div(depositCapInToken)

  const vaultInceptionDate = dayjs(Number(vault.createdTimestamp) * 1000)
  const isNewVault = dayjs().diff(vaultInceptionDate, 'day') <= 30

  return (
    <>
      <div className={vaultOpenGridStyles.vaultOpenGridBreadcrumbsWrapper}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            href={headerLink.href}
            onClick={() => buttonClickEventHandler(`vault-open-header-link`)}
          >
            <Text as="p" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              {headerLink.label} / &nbsp;
            </Text>
          </Link>
          <Text as="p" variant="p3" color="white" className={vaultOpenGridStyles.vaultId}>
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
                content: (
                  <VaultTitleDropdownContent
                    vault={item}
                    link={getOptionUrl?.(item) ?? getVaultUrl(item)}
                    linkOnClick={() =>
                      dropdownChangeHandler({
                        inputName: 'vault-open-vault-dropdown',
                        value: slugifyVault(item),
                      })
                    }
                    isDisabled={
                      disableDropdownOptionsByChainId &&
                      subgraphNetworkToSDKId(supportedSDKNetwork(item.protocol.network)) !==
                        disableDropdownOptionsByChainId
                    }
                    isDaoManaged={item.isDaoManaged}
                  />
                ),
              }))}
              dropdownValue={{
                value: getVaultUrl(vault),
                content: (
                  <VaultTitleDropdownContent
                    vault={vault}
                    link={getOptionUrl?.(vault) ?? getVaultUrl(vault)}
                    isDisabled={
                      disableDropdownOptionsByChainId &&
                      subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)) !==
                        disableDropdownOptionsByChainId
                    }
                    isDaoManaged={vault.isDaoManaged}
                  />
                ),
              }}
            >
              <VaultTitleWithRisk
                symbol={getDisplayToken(vault.inputToken.symbol)}
                risk={vault.customFields?.risk ?? 'lower'}
                networkName={supportedSDKNetwork(vault.protocol.network)}
                tooltipName="vault-open-risk-label"
                onTooltipOpen={tooltipEventHandler}
                isNewVault={isNewVault}
                isDaoManagedVault={vault.isDaoManaged}
              />
            </Dropdown>
            <div className={vaultOpenGridStyles.vaultBonusWrapper}>
              {Number(rawSumrTokenBonus) > 0 && (
                <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  <BonusLabel
                    tokenBonus={sumrTokenBonus}
                    withTokenBonus
                    tooltipName="vault-open-bonus-label"
                    onTooltipOpen={tooltipEventHandler}
                  />
                </Text>
              )}
              <AdditionalBonusLabel
                externalTokenBonus={vault.customFields?.bonus}
                tooltipName="vault-open-additional-bonus-label"
                onTooltipOpen={tooltipEventHandler}
              />
            </div>
          </div>
          <AnimateHeight id="simulation-graph" scale show={displaySimulationGraphStaggered}>
            {simulationGraph}
          </AnimateHeight>
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
                title="30d APY"
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
                subValue={
                  medianBN && medianDefiYield30DDifference && isVaultAtLeast30dOld ? (
                    <Tooltip
                      tooltipName="vault-open-30d-apy-median"
                      onTooltipOpen={tooltipEventHandler}
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
                tooltipName="vault-open-live-apy"
                onTooltipOpen={tooltipEventHandler}
                title={
                  <Tooltip
                    tooltipName="vault-open-live-apy-info"
                    onTooltipOpen={tooltipEventHandler}
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
                        Live&nbsp;APY&nbsp;(
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
                      tooltipName="vault-open-live-apy-median"
                      onTooltipOpen={tooltipEventHandler}
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
          {isMobileOrTablet && rightExtraContent && (
            <div className={vaultOpenGridStyles.rightExtraBlockMobileWrapper}>
              {rightExtraContent}
            </div>
          )}
          <Box className={vaultOpenGridStyles.leftBlock}>{detailsContent}</Box>
        </div>
        <div className={vaultOpenGridStyles.rightBlockWrapper}>
          <div className={vaultOpenGridStyles.rightBlock}>
            {sidebarContent}
            {rightExtraContent && rightExtraContent}
          </div>
        </div>
      </div>
      {isMobileOrTablet && (
        <div className={vaultOpenGridStyles.rightBlockMobile}>{sidebarContent}</div>
      )}
    </>
  )
}
