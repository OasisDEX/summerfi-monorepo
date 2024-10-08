'use client'

import { useMemo } from 'react'
import { DataBlock, SimpleGrid, StrategyCard, StrategyGrid } from '@summerfi/app-earn-ui'
import { type DropdownOption, type IconNamesList, type NetworkNames } from '@summerfi/app-types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import FormContainer from '@/components/organisms/Form/FormContainer'
import { strategiesList } from '@/constants/dev-strategies-list'
import { type FleetConfig } from '@/helpers/sdk/types'

type StrategiesListViewProps = {
  selectedNetwork?: NetworkNames | 'all-networks'
  selectedStrategy?: string
}

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const allNetworksOption = {
  iconName: 'ether_circle_color' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

const getStrategyLink = (
  strategy: (typeof strategiesList)[number],
  selectedNetwork?: StrategiesListViewProps['selectedNetwork'],
) => {
  return `/earn/${selectedNetwork ?? 'all-networks'}/${strategy.id}`
}

export const StrategiesListView = ({
  selectedNetwork,
  selectedStrategy,
}: StrategiesListViewProps) => {
  const { replace } = useRouter()
  const networkFilteredStrategies = useMemo(() => {
    return selectedNetwork && selectedNetwork !== 'all-networks'
      ? strategiesList.filter((strategy) => strategy.network === selectedNetwork)
      : strategiesList
  }, [selectedNetwork])
  const selectedNetworkOption = useMemo(() => {
    return selectedNetwork
      ? {
          iconName: 'ether_circle_color' as IconNamesList,
          label: selectedNetwork,
          value: selectedNetwork,
        }
      : allNetworksOption
  }, [selectedNetwork])
  const strategiesNetworksList = useMemo(() => {
    return [
      ...[...new Set(strategiesList.map(({ network }) => network))].map((network) => ({
        iconName: 'ether_circle_color' as IconNamesList,
        label: network,
        value: network,
      })),
      allNetworksOption,
    ]
  }, [])

  const selectedStrategyData = useMemo(() => {
    return strategiesList.find((strategy) => strategy.id === selectedStrategy)
  }, [selectedStrategy])

  const handleChangeNetwork = (selected: DropdownOption) => {
    if (selected.value === 'all-networks') {
      replace('/earn')

      return
    }
    replace(`/earn/${selected.value}`)
  }

  return (
    <StrategyGrid
      networksList={strategiesNetworksList}
      selectedNetwork={selectedNetworkOption}
      onChangeNetwork={handleChangeNetwork}
      topContent={
        <SimpleGrid columns={3} style={{ justifyItems: 'stretch' }} gap={170}>
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="$800,130,321"
          />
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="14.3b"
          />
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="6"
          />
        </SimpleGrid>
      }
      leftContent={networkFilteredStrategies.map((strategy) => (
        <Link key={strategy.id} href={getStrategyLink(strategy, selectedNetwork)}>
          <StrategyCard {...strategy} secondary selected={selectedStrategy === strategy.id} />
        </Link>
      ))}
      rightContent={
        <FormContainer selectedStrategyData={selectedStrategyData} fleetConfig={fleetConfig} />
      }
    />
  )
}
