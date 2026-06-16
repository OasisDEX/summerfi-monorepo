'use client'

import { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  type DropdownRawOption,
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SupportedNetworkIds,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatAddress,
  formatDecimalAsPercent,
  sdkNetworkToHumanNetwork,
  slugifyVault,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Box } from '@/components/atoms/Box/Box'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getManagementFee } from '@/helpers/get-management-fee'
import { getRewardsTokenBonus } from '@/helpers/get-reward-token-bonus'
import { getVaultUrl } from '@/helpers/get-vault-url'
import { isVaultAtLeastDaysOld } from '@/helpers/is-vault-at-least-days-old'

import { type RwaVaultMarketValue, RwaVaultStatsGrid } from './RwaVaultStatsGrid'
import { StandardVaultStatsGrid } from './StandardVaultStatsGrid'

import vaultOpenGridStyles from './VaultOpenGrid.module.css'

interface VaultOpenGridProps {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  // RWA-only: vault-wide true TVL (incl. settling deposits) for the "Market Value" stat.
  rwaMarketValue?: RwaVaultMarketValue
  rwaMarketValueLoading?: boolean
  displaySimulationGraph?: boolean
  simulationGraph: ReactNode
  detailsContent: ReactNode
  sidebarContent: ReactNode
  isMobileOrTablet?: boolean
  medianDefiYield?: number
  rewardTokenPrices: RewardTokenPrices
  onRefresh?: (params: {
    chainName?: string
    vaultId?: string
    walletAddress?: string
    vaultToken?: string
  }) => void
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
  rwaMarketValue,
  rwaMarketValueLoading,
  vaults,
  displaySimulationGraph,
  simulationGraph,
  detailsContent,
  sidebarContent,
  isMobileOrTablet,
  medianDefiYield,
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
  rewardTokenPrices,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [displaySimulationGraphStaggered, setDisplaySimulationGraphStaggered] =
    useState(displaySimulationGraph)

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault, days: 30 })

  const { totalAnnualRewardsPerToken } = getRewardsTokenBonus({
    merklRewards: vaultInfo?.merklRewards,
    tokensPriceMap: rewardTokenPrices,
    totalValueLockedUSD: vault.totalValueLockedUSD,
  })

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
  // RWA (rounds-based) vaults accrue value as NAV per share, not a yield APY, so the "Live APY"
  // slot shows NAV Price instead. `vault.isRwaVault` is reliable here (open view receives the RWA
  // detail vault, which the fleet-config decoration flags).
  const isRwaVault = vault.isRwaVault ?? false

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

  const handleUserRefresh = () => {
    buttonClickEventHandler(`vault-open-refresh-button`)
    onRefresh?.({
      chainName: sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
      vaultId: vault.id,
      vaultToken: vault.inputToken.symbol,
    })
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 5000)
  }

  const vaultInceptionDate = dayjs(Number(vault.createdTimestamp) * 1000)
  const isNewVault = dayjs().diff(vaultInceptionDate, 'day') <= 30

  const mapVaultToDropdownItem = useCallback(
    (item: SDKVaultishType) => ({
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
    }),
    [disableDropdownOptionsByChainId, dropdownChangeHandler, getOptionUrl],
  )

  const vaultsDropdownOptions: DropdownRawOption[] = useMemo(() => {
    const regularVaults = vaults.filter((v) => !v.isDaoManaged && !v.isRwaVault)
    const daoManagedVaults = vaults.filter((v) => v.isDaoManaged)
    const rwaVaults = vaults.filter((v) => v.isRwaVault)

    return [
      ...(daoManagedVaults.length > 0
        ? [
            {
              value: 'dao-managed-vaults',
              content: (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--earn-protocol-secondary-100)',
                  }}
                >
                  DAO Risk-Managed Vaults
                </div>
              ),
              isSeparator: true,
            },
            ...daoManagedVaults.map(mapVaultToDropdownItem),
          ]
        : []),
      ...(regularVaults.length > 0
        ? [
            {
              value: 'other-vaults',
              content: (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--earn-protocol-secondary-100)',
                  }}
                >
                  Risk-Managed&nbsp;by&nbsp;Block&nbsp;Analitica
                </div>
              ),
              isSeparator: true,
            },
            ...regularVaults.map(mapVaultToDropdownItem),
          ]
        : []),
      ...(rwaVaults.length > 0
        ? [
            {
              value: 'permissioned-rwa-vaults',
              content: (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--earn-protocol-secondary-100)',
                  }}
                >
                  Permissioned&nbsp;RWA&nbsp;Vaults
                </div>
              ),
              isSeparator: true,
            },
            ...rwaVaults.map(mapVaultToDropdownItem),
          ]
        : []),
    ]
  }, [mapVaultToDropdownItem, vaults])

  // Prefer the on-chain fee decorated server-side; fall back to the token-symbol heuristic.
  const managementFee = vault.managementFee ?? getManagementFee(vault.inputToken.symbol)

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
            {vault.customFields?.name ?? formatAddress(vault.id)}
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
              options={vaultsDropdownOptions}
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
                isRwaVault={vault.isRwaVault}
              />
            </Dropdown>
            <div className={vaultOpenGridStyles.vaultBonusWrapper}>
              <BonusLabel
                apy={vaultApyData.apy}
                managementFee={managementFee}
                externalTokenBonus={vault.customFields?.bonus}
                tooltipName="vault-open-bonus-label"
                onTooltipOpen={tooltipEventHandler}
                totalAnnualRewardsPerToken={totalAnnualRewardsPerToken}
              />
            </div>
          </div>
          <AnimateHeight id="simulation-graph" scale show={displaySimulationGraphStaggered}>
            {simulationGraph}
          </AnimateHeight>
          {isRwaVault ? (
            <RwaVaultStatsGrid
              vault={vault}
              rwaMarketValue={rwaMarketValue}
              rwaMarketValueLoading={rwaMarketValueLoading}
              isMobileOrTablet={isMobileOrTablet}
              tooltipEventHandler={tooltipEventHandler}
            />
          ) : (
            <StandardVaultStatsGrid
              vault={vault}
              vaultApyData={vaultApyData}
              medianDefiYield={medianDefiYield}
              isMobileOrTablet={isMobileOrTablet}
              tooltipEventHandler={tooltipEventHandler}
              apy30d={apy30d}
            />
          )}
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
