'use client'

import { useMemo, useState } from 'react'
import {
  DataBlock,
  SimpleGrid,
  StrategyCard,
  StrategyGrid,
  StrategySimulationForm,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type IconNamesList,
  type SDKNetwork,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { networkIconByNetworkName } from '@/constants/networkIcons'

type StrategiesListViewProps = {
  strategiesList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
}

const allNetworksOption = {
  iconName: 'ether_circle_color' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

const softRouterPush = (url: string) => {
  window.history.pushState(null, '', url)
}

export const StrategiesListView = ({
  selectedNetwork,
  strategiesList,
}: StrategiesListViewProps) => {
  const [localStrategyNetwork, setLocalStrategyNetwork] =
    useState<StrategiesListViewProps['selectedNetwork']>(selectedNetwork)

  const networkFilteredStrategies = useMemo(
    () =>
      localStrategyNetwork && localStrategyNetwork !== 'all-networks'
        ? strategiesList.filter((strategy) => strategy.protocol.network === localStrategyNetwork)
        : strategiesList,
    [localStrategyNetwork, strategiesList],
  )

  const [strategyId, setStrategyId] = useState<string | undefined>(networkFilteredStrategies[0].id)

  const selectedNetworkOption = useMemo(
    () =>
      localStrategyNetwork
        ? {
            iconName:
              localStrategyNetwork !== 'all-networks'
                ? (networkIconByNetworkName[localStrategyNetwork] as IconNamesList)
                : 'network_ethereum',
            label: capitalize(localStrategyNetwork),
            value: localStrategyNetwork,
          }
        : allNetworksOption,
    [localStrategyNetwork],
  )
  const strategiesNetworksList = useMemo(
    () => [
      ...[...new Set(strategiesList.map(({ protocol }) => protocol.network))].map((network) => ({
        iconName: networkIconByNetworkName[network] as IconNamesList,
        label: network,
        value: network,
      })),
      allNetworksOption,
    ],
    [strategiesList],
  )

  const selectedStrategyData = useMemo(
    () => strategiesList.find((strategy) => strategy.id === strategyId),
    [strategiesList, strategyId],
  )

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalStrategyNetwork(selected.value as StrategiesListViewProps['selectedNetwork'])
    switch (selected.value) {
      case 'all-networks':
        softRouterPush('/earn')

        break

      default:
        if (selectedStrategyData && selectedStrategyData.protocol.network !== selected.value) {
          setStrategyId(undefined)
        }
        softRouterPush(`/earn/${selected.value}`)

        break
    }
  }

  const handleChangeStrategy = (nextStrategyId: string) => {
    setStrategyId(nextStrategyId)
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
      leftContent={networkFilteredStrategies.map((strategy, strategyIndex) => (
        <StrategyCard
          key={strategy.id}
          {...strategy}
          secondary
          withHover
          selected={strategyId === strategy.id || (!strategyId && strategyIndex === 0)}
          onClick={handleChangeStrategy}
        />
      ))}
      rightContent={
        <StrategySimulationForm
          strategyData={selectedStrategyData ?? networkFilteredStrategies[0]}
        />
      }
    />
  )
}
