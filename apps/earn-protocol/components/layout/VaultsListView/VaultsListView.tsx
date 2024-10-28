'use client'

import { useMemo, useState } from 'react'
import {
  DataBlock,
  SimpleGrid,
  VaultCard,
  VaultGrid,
  VaultSimulationForm,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type IconNamesList,
  type SDKNetwork,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { formatCryptoBalance, zero } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { networkIconByNetworkName } from '@/constants/networkIcons'

type VaultsListViewProps = {
  vaultsList: SDKVaultsListType
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

export const VaultsListView = ({ selectedNetwork, vaultsList }: VaultsListViewProps) => {
  const [localVaultNetwork, setLocalVaultNetwork] =
    useState<VaultsListViewProps['selectedNetwork']>(selectedNetwork)

  const networkFilteredVaults = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? vaultsList.filter((vault) => vault.protocol.network === localVaultNetwork)
        : vaultsList,
    [localVaultNetwork, vaultsList],
  )

  const [vaultId, setVaultId] = useState<string | undefined>(networkFilteredVaults[0].id)

  const selectedNetworkOption = useMemo(
    () =>
      localVaultNetwork
        ? {
            iconName:
              localVaultNetwork !== 'all-networks'
                ? (networkIconByNetworkName[localVaultNetwork] as IconNamesList)
                : 'network_ethereum',
            label: capitalize(localVaultNetwork),
            value: localVaultNetwork,
          }
        : allNetworksOption,
    [localVaultNetwork],
  )
  const vaultsNetworksList = useMemo(
    () => [
      ...[...new Set(vaultsList.map(({ protocol }) => protocol.network))].map((network) => ({
        iconName: networkIconByNetworkName[network] as IconNamesList,
        label: network,
        value: network,
      })),
      allNetworksOption,
    ],
    [vaultsList],
  )

  const selectedVaultData = useMemo(
    () => vaultsList.find((vault) => vault.id === vaultId),
    [vaultsList, vaultId],
  )

  const handleChangeNetwork = (selected: DropdownRawOption) => {
    setLocalVaultNetwork(selected.value as VaultsListViewProps['selectedNetwork'])
    switch (selected.value) {
      case 'all-networks':
        softRouterPush('/earn')

        break

      default:
        if (selectedVaultData && selectedVaultData.protocol.network !== selected.value) {
          setVaultId(undefined)
        }
        softRouterPush(`/earn/${selected.value}`)

        break
    }
  }

  const handleChangeVault = (nextVaultId: string) => {
    setVaultId(nextVaultId)
  }

  const formattedTotalAssets = useMemo(() => {
    return formatCryptoBalance(
      vaultsList.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
    )
  }, [vaultsList])

  return (
    <VaultGrid
      networksList={vaultsNetworksList}
      selectedNetwork={selectedNetworkOption}
      onChangeNetwork={handleChangeNetwork}
      topContent={
        <SimpleGrid columns={3} style={{ justifyItems: 'stretch' }} gap={170}>
          {/** TODO: fill data */}
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value={`$${formattedTotalAssets}`}
          />
          {/** TODO: fill data */}
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="14.3b"
          />
          {/** TODO: fill data */}
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="6"
          />
        </SimpleGrid>
      }
      leftContent={networkFilteredVaults.map((vault, vaultIndex) => (
        <VaultCard
          key={vault.id}
          {...vault}
          secondary
          withHover
          selected={vaultId === vault.id || (!vaultId && vaultIndex === 0)}
          onClick={handleChangeVault}
        />
      ))}
      rightContent={
        <VaultSimulationForm vaultData={selectedVaultData ?? networkFilteredVaults[0]} />
      }
    />
  )
}
