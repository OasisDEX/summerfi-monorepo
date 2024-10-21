'use client'

import { useMemo, useState } from 'react'
import {
  DataBlock,
  SimpleGrid,
  StrategyCard,
  StrategyGrid,
  StrategySimulationForm,
} from '@summerfi/app-earn-ui'
import { type DropdownRawOption, type IconNamesList, type NetworkNames } from '@summerfi/app-types'

import { strategiesList } from '@/constants/dev-strategies-list'

type StrategiesListViewProps = {
  selectedNetwork?: NetworkNames | 'all-networks'
  selectedStrategyId?: string
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
  selectedStrategyId,
}: StrategiesListViewProps) => {
  const [localStrategyNetwork, setLocalStrategyNetwork] =
    useState<StrategiesListViewProps['selectedNetwork']>(selectedNetwork)

  const [localStrategyId, setLocalStrategyId] = useState<string | undefined>(selectedStrategyId)

  const networkFilteredStrategies = useMemo(
    () =>
      localStrategyNetwork && localStrategyNetwork !== 'all-networks'
        ? strategiesList.filter((strategy) => strategy.network === localStrategyNetwork)
        : strategiesList,
    [localStrategyNetwork],
  )

  const selectedNetworkOption = useMemo(
    () =>
      localStrategyNetwork
        ? {
            iconName: 'ether_circle_color' as IconNamesList,
            label: localStrategyNetwork,
            value: localStrategyNetwork,
          }
        : allNetworksOption,
    [localStrategyNetwork],
  )
  const strategiesNetworksList = useMemo(
    () => [
      ...[...new Set(strategiesList.map(({ network }) => network))].map((network) => ({
        iconName: 'ether_circle_color' as IconNamesList,
        label: network,
        value: network,
      })),
      allNetworksOption,
    ],
    [],
  )

  const selectedStrategyData = useMemo(
    () => strategiesList.find((strategy) => strategy.id === localStrategyId),
    [localStrategyId],
  )

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalStrategyNetwork(selected.value as StrategiesListViewProps['selectedNetwork'])
    switch (selected.value) {
      case 'all-networks':
        // if its all networks we must check if the selected strategy is from the same network
        // then we can "redirect" to the selected strategy page with the network
        softRouterPush(
          selectedStrategyData ? `/earn/all-networks/${selectedStrategyData.id}` : '/earn',
        )

        break

      default:
        // if its a specific network we must check if the selected strategy is from the same network
        // then we can "redirect" to the selected strategy page with the network
        // if not we just go to the network page and clear the selected strategy (if not available in the new view)
        if (selectedStrategyData && selectedStrategyData.network !== selected.value) {
          setLocalStrategyId(undefined)
        }
        softRouterPush(
          selectedStrategyData && selectedStrategyData.network === selected.value
            ? `/earn/${selected.value}/${selectedStrategyData.id}`
            : `/earn/${selected.value}`,
        )

        break
    }
  }

  const handleChangeStrategy = (strategyId: string) => {
    setLocalStrategyId(strategyId)
    softRouterPush(`/earn/${localStrategyNetwork ?? 'all-networks'}/${strategyId}`)
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
          selected={localStrategyId === strategy.id || (!localStrategyId && strategyIndex === 0)}
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
