'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import {
  type IArmadaPosition,
  type IArmadaVaultInfo,
  type SDKVaultishType,
  type SDKVaultsListType,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  formatWithSeparators,
  sdkNetworkToHumanNetwork,
  slugifyVault,
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
import { getPositionValues } from '@/helpers/get-position-values'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { isVaultAtLeastDaysOld } from '@/helpers/is-vault-at-least-days-old'
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'
import { useHoldAlt } from '@/hooks/use-hold-alt'
import { useSumrRewardsToDate } from '@/hooks/use-sumr-rewards-to-date'

import vaultManageGridStyles from './VaultManageGrid.module.css'

interface VaultManageGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  position: IArmadaPosition
  detailsContent: ReactNode[] | ReactNode
  sidebarContent: ReactNode
  connectedWalletAddress?: string
  viewWalletAddress: string
  isMobile?: boolean
  displaySimulationGraph?: boolean
  simulationGraph: ReactNode
  sumrPrice?: number
  onRefresh?: (params: { chainName?: string; vaultId?: string; walletAddress?: string }) => void
  vaultApyData: VaultApyData
  rightExtraContent?: ReactNode
  tooltipEventHandler: (tooltipName: string) => void
  buttonClickEventHandler: (buttonName: string) => void
  dropdownChangeHandler: ({ inputName, value }: { inputName: string; value: string }) => void
  noOfDeposits: number
  isDaoManaged?: boolean
}

export const VaultManageGrid: FC<VaultManageGridProps> = ({
  vault,
  vaultApyData,
  vaults,
  vaultInfo,
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
  buttonClickEventHandler,
  tooltipEventHandler,
  dropdownChangeHandler,
  noOfDeposits,
  isDaoManaged,
}) => {
  const isAltPressed = useHoldAlt()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displaySimulationGraphStaggered, setDisplaySimulationGraphStaggered] =
    useState(displaySimulationGraph)

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault, days: 30 })

  const withdrawableTotalAssetsUSDParsed = formatCryptoBalance(
    new BigNumber(vault.withdrawableTotalAssetsUSD.toString()),
  )
  const withdrawableTotalAssetsParsed = formatCryptoBalance(
    new BigNumber(vault.withdrawableTotalAssets.toString()).div(ten.pow(vault.inputToken.decimals)),
  )

  const withdrawablePercentage = new BigNumber(vault.withdrawableTotalAssets.toString())
    .div(vault.inputTokenBalance.toString())
    .toFixed(8)

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

  const { netDeposited, netEarnings, netValue, netValueUSD, netEarningsUSD } = getPositionValues({
    position,
    vault,
  })

  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus({
    merklRewards: vaultInfo?.merklRewards,
    sumrPrice,
    totalValueLockedUSD: vault.totalValueLockedUSD,
  })
  const handleUserRefresh = () => {
    buttonClickEventHandler(`vault-manage-refresh-button`)
    onRefresh?.({
      chainName: sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
      vaultId: vault.id,
      walletAddress: viewWalletAddress,
    })
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  const sumrRewards = useSumrRewardsToDate(position)
  const vaultInceptionDate = dayjs(Number(vault.createdTimestamp) * 1000)
  const isNewVault = dayjs().diff(vaultInceptionDate, 'day') <= 30

  return (
    <>
      <div className={vaultManageGridStyles.vaultManageGridBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/" onClick={() => buttonClickEventHandler(`vault-manage-header-link`)}>
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn
            </Text>
          </Link>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <Link
            href={getVaultUrl(vault)}
            style={{ color: 'white' }}
            onClick={() => buttonClickEventHandler(`vault-manage-header-link-vault`)}
          >
            <Text as="span" variant="p3">
              {vault.customFields?.name ?? vault.id}
            </Text>
          </Link>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <Text as="span" variant="p3" color="white">
            <Link
              href={`/portfolio/${viewWalletAddress}`}
              style={{ color: 'white' }}
              onClick={() => buttonClickEventHandler(`vault-manage-header-link-portfolio`)}
            >
              {viewWalletAddress.toLowerCase() === connectedWalletAddress?.toLowerCase()
                ? 'Your'
                : viewWalletAddress}{' '}
              Position
            </Link>
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
                content: (
                  <VaultTitleDropdownContent
                    vault={item}
                    link={getVaultUrl(item)}
                    linkOnClick={() =>
                      dropdownChangeHandler({
                        inputName: 'vault-manage-vault-dropdown',
                        value: slugifyVault(item),
                      })
                    }
                  />
                ),
              }))}
              dropdownValue={{
                value: getVaultUrl(vault),
                content: <VaultTitleDropdownContent vault={vault} link={getVaultUrl(vault)} />,
              }}
            >
              <VaultTitleWithRisk
                symbol={getDisplayToken(vault.inputToken.symbol)}
                risk={vault.customFields?.risk ?? 'lower'}
                networkName={supportedSDKNetwork(vault.protocol.network)}
                tooltipName="vault-manage-risk-label"
                onTooltipOpen={tooltipEventHandler}
                isNewVault={isNewVault}
                isDaoManagedVault={isDaoManaged}
              />
            </Dropdown>
            <div className={vaultManageGridStyles.vaultBonusWrapper}>
              {Number(rawSumrTokenBonus) > 0 && (
                <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  <BonusLabel
                    tokenBonus={sumrTokenBonus}
                    withTokenBonus={Number(rawSumrTokenBonus) > 0}
                    totalSumrEarned={formatCryptoBalance(sumrRewards)}
                    tooltipName="vault-manage-bonus-label"
                    onTooltipOpen={tooltipEventHandler}
                  />
                </Text>
              )}
              <AdditionalBonusLabel
                externalTokenBonus={vault.customFields?.bonus}
                tooltipName="vault-manage-additional-bonus-label"
                onTooltipOpen={tooltipEventHandler}
              />
            </div>
          </div>
          <AnimateHeight id="simulation-graph" scale show={displaySimulationGraphStaggered}>
            {simulationGraph}
          </AnimateHeight>
          <SimpleGrid
            columns={isMobile ? 1 : 2}
            rows={isMobile ? 4 : 2}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Market Value"
                value={
                  <Tooltip
                    tooltip={
                      <>USD&nbsp;Market&nbsp;Value:&nbsp;${formatFiatBalance(netValueUSD)}</>
                    }
                    onTooltipOpen={tooltipEventHandler}
                    tooltipName="vault-manage-market-value-label"
                    tooltipWrapperStyles={{
                      maxWidth: '455px',
                    }}
                  >
                    <>
                      {formatCryptoBalance(netValue)}&nbsp;
                      {getDisplayToken(vault.inputToken.symbol)}
                    </>
                  </Tooltip>
                }
                subValue={
                  <Tooltip
                    tooltip={<>USD&nbsp;Earned:&nbsp;${formatFiatBalance(netEarningsUSD)}</>}
                    tooltipWrapperStyles={{
                      maxWidth: '455px',
                    }}
                    onTooltipOpen={tooltipEventHandler}
                    tooltipName="vault-manage-usd-earned-label"
                  >
                    <>
                      Earned:&nbsp;
                      {formatWithSeparators(netEarnings, {
                        precision: 2,
                      })}
                      &nbsp;
                      {getDisplayToken(vault.inputToken.symbol)}
                    </>
                  </Tooltip>
                }
                subValueType={netEarnings.isPositive() ? 'positive' : 'negative'}
                subValueSize="small"
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
                subValueSize="small"
                subValueStyle={{ color: 'var(--earn-protocol-success-100)' }}
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="30d APY"
                value={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text variant="h4" style={{ marginRight: 'var(--general-space-8)' }}>
                      {apy30d}
                    </Text>
                    <Icon iconName="stars_colorful" size={20} />
                  </div>
                }
                subValue={
                  <Tooltip
                    tooltip={
                      <LiveApyInfo
                        apyCurrent={apyCurrent}
                        apyUpdatedAt={apyUpdatedAt}
                        isAltPressed={isAltPressed}
                      />
                    }
                    tooltipName="vault-manage-live-apy-info"
                    onTooltipOpen={tooltipEventHandler}
                    tooltipWrapperStyles={{
                      maxWidth: '455px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <Text
                        variant="p4semi"
                        style={{
                          marginRight: 'var(--general-space-4)',
                          color: 'var(--color-text-success)',
                        }}
                      >
                        Live&nbsp;APY:&nbsp;{apyCurrent}&nbsp;(
                        {apyUpdatedAt.apyUpdatedAtLabel})
                      </Text>
                      <Icon iconName="info" size={16} color="var(--color-text-success)" />
                    </div>
                  </Tooltip>
                }
                subValueSize="small"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Instant liquidity"
                value={`${withdrawableTotalAssetsParsed} ${getDisplayToken(vault.inputToken.symbol)}`}
                subValue={`$${withdrawableTotalAssetsUSDParsed} (${formatDecimalAsPercent(
                  withdrawablePercentage,
                  {
                    plus: false,
                  },
                )})`}
                subValueSize="small"
              />
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
