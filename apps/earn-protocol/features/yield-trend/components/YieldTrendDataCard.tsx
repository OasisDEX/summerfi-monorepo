import { useMemo, useState } from 'react'
import { Button, Card, getDisplayToken, Text, VaultTitleWithRisk } from '@summerfi/app-earn-ui'
import { getArkNiceName } from '@summerfi/app-earn-ui/src/helpers/get-ark-nice-name'
import { type SDKVaultishType } from '@summerfi/app-types'

import { YieldTrendChart } from '@/features/yield-trend/components/YieldTrendChart'

import yieldTrendViewStyles from './YieldTrendView.module.css'

export const YieldTrendDataCard = ({ selectedVault }: { selectedVault: SDKVaultishType }) => {
  const properArksList = useMemo(() => {
    return selectedVault.arks.filter((ark) => !ark.name?.includes('Buffer'))
  }, [selectedVault.arks])

  const [activeFilter, setActiveFilter] = useState<string[]>([
    ...properArksList.map(({ id }) => id),
  ])

  const [dataTabActive, setDataTabActive] = useState<'currentAllocations' | 'rebalanceHistory'>(
    'currentAllocations',
  )

  return (
    <Card variant="cardSecondary" style={{ flexDirection: 'column' }}>
      <VaultTitleWithRisk
        symbol={getDisplayToken(selectedVault.inputToken.symbol)}
        risk={selectedVault.customFields?.risk ?? 'lower'}
        networkName={selectedVault.protocol.network}
        titleVariant="h4"
      />
      <div className={yieldTrendViewStyles.divider} style={{ marginTop: '32px' }} />
      <div className={yieldTrendViewStyles.chartTableHeader}>
        <Text variant="h5">Compare Historical DeFi Yield Performance</Text>
      </div>
      <div className={yieldTrendViewStyles.chartStrategiesFilter}>
        <Button
          key="ArkFilterButtonAll"
          variant={
            activeFilter.length === properArksList.length ? 'primarySmall' : 'secondarySmall'
          }
          onClick={() => {
            if (activeFilter.length === properArksList.length) {
              setActiveFilter([])
            } else {
              setActiveFilter([...properArksList.map((ark) => ark.id)])
            }
          }}
        >
          All
        </Button>
        {properArksList.map((ark) => (
          <Button
            key={`ArkFilterButton-${ark.id}`}
            variant={activeFilter.includes(ark.id) ? 'primarySmall' : 'secondarySmall'}
            onClick={() => {
              if (activeFilter.includes(ark.id)) {
                setActiveFilter(activeFilter.filter((id) => id !== ark.id))
              } else {
                setActiveFilter([...activeFilter, ark.id])
              }
            }}
          >
            {getArkNiceName(ark)}
          </Button>
        ))}
      </div>
      <YieldTrendChart />
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
