'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  Card,
  getDisplayToken,
  InlineButtons,
  LoadingSpinner,
  Text,
  VaultTitleWithRisk,
} from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InlineButtonOption,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { getVaultNiceName, supportedSDKNetwork } from '@summerfi/app-utils'

import { YieldTrendChart } from '@/features/yield-trend/components/YieldTrendChart'

import yieldTrendViewStyles from './YieldTrendView.module.css'

interface YieldTrendDataCardProps {
  selectedVault: SDKVaultishType
  arksHistoricalChartData: ArksHistoricalChartData
  isLoading?: boolean
}

export const YieldTrendDataCard = ({
  selectedVault,
  arksHistoricalChartData,
  isLoading = false,
}: YieldTrendDataCardProps) => {
  const [activeFilter, setActiveFilter] = useState<InlineButtonOption<string>[]>([
    {
      title: 'All',
      key: 'all',
    },
  ])

  const [dataTabActive, setDataTabActive] = useState<'currentAllocations' | 'rebalanceHistory'>(
    'currentAllocations',
  )

  const summerVaultName = getVaultNiceName({ vault: selectedVault })

  const buttonOptions = useMemo(() => {
    return [
      {
        title: 'All',
        key: 'all',
      },
      {
        title: 'DeFi Median',
        key: 'defi-median',
      },
      {
        title: 'Summer.fi',
        key: summerVaultName,
      },
      ...arksHistoricalChartData.dataNames.map((arkNiceName) => ({
        title: arkNiceName,
        key: arkNiceName,
      })),
    ]
  }, [arksHistoricalChartData, summerVaultName])

  const handleButtonClick = useCallback(
    (option: InlineButtonOption<string>) => {
      setActiveFilter((prev) => {
        const isSelected = prev.some((opt) => opt.key === option.key)

        if (isSelected) {
          const filteredOptions = prev.filter((opt) => opt.key !== option.key)

          return filteredOptions.length === 0 ? [buttonOptions[0]] : filteredOptions
        }

        // If selecting a non-"All" option, remove "All" option and add the new option
        if (option.key !== 'all') {
          return [...prev.filter((opt) => opt.key !== 'all'), option]
        }

        // If selecting "All", remove all other options
        return [option]
      })
    },
    [buttonOptions],
  )

  return (
    <Card variant="cardSecondary" style={{ flexDirection: 'column' }}>
      <VaultTitleWithRisk
        symbol={getDisplayToken(selectedVault.inputToken.symbol)}
        risk={selectedVault.customFields?.risk ?? 'lower'}
        networkName={supportedSDKNetwork(selectedVault.protocol.network)}
        titleVariant="h4"
      />
      <div className={yieldTrendViewStyles.divider} style={{ marginTop: '32px' }} />
      <div className={yieldTrendViewStyles.chartTableHeader}>
        <Text variant="h5">Compare Historical DeFi Yield Performance</Text>
      </div>
      <div style={{ position: isLoading ? 'relative' : 'static' }}>
        <div className={yieldTrendViewStyles.chartStrategiesFilter}>
          <InlineButtons
            options={buttonOptions}
            currentOptions={activeFilter}
            handleOption={handleButtonClick}
            asButtons
            variant="p4semi"
          />
        </div>
        {isLoading && (
          <div className={yieldTrendViewStyles.loadingSpinnerOverlay}>
            <LoadingSpinner size={32} />
          </div>
        )}
        <YieldTrendChart
          chartData={arksHistoricalChartData}
          summerVaultName={summerVaultName}
          filters={activeFilter}
        />
      </div>
      <div className={yieldTrendViewStyles.dataTabs}>
        <Text
          variant="h5"
          className={
            dataTabActive === 'currentAllocations' ? yieldTrendViewStyles.dataTabActive : ''
          }
          onClick={() => setDataTabActive('currentAllocations')}
        >
          Current Allocations
        </Text>
        <Text
          variant="h5"
          className={dataTabActive === 'rebalanceHistory' ? yieldTrendViewStyles.dataTabActive : ''}
          onClick={() => setDataTabActive('rebalanceHistory')}
        >
          Rebalance History
        </Text>
      </div>
      <Text variant="p2" className={yieldTrendViewStyles.dataTabsDescription}>
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <Card>
        <Text variant="p2semi">Sources of Lazy Summer Protocol Yield</Text>
      </Card>
    </Card>
  )
}
