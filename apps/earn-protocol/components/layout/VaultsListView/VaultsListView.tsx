'use client'

import { useMemo, useState } from 'react'
import {
  DataBlock,
  SimpleGrid,
  Text,
  useMobileCheck,
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
import { formatCryptoBalance, sdkNetworkToHumanNetwork, zero } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

type VaultsListViewProps = {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
}

const allNetworksOption = {
  iconName: 'earn_network_all' as IconNamesList,
  label: 'All Networks',
  value: 'all-networks',
}

const softRouterPush = (url: string) => {
  window.history.pushState(null, '', url)
}

export const VaultsListView = ({ selectedNetwork, vaultsList }: VaultsListViewProps) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [localVaultNetwork, setLocalVaultNetwork] =
    useState<VaultsListViewProps['selectedNetwork']>(selectedNetwork)

  const networkFilteredVaults = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? vaultsList.filter(({ protocol }) => protocol.network === localVaultNetwork)
        : vaultsList,
    [localVaultNetwork, vaultsList],
  )

  const [vaultId, setVaultId] = useState<string | undefined>(networkFilteredVaults[0].id)

  const selectedNetworkOption = useMemo(
    () =>
      localVaultNetwork && localVaultNetwork !== 'all-networks'
        ? {
            iconName: networkIconByNetworkName[localVaultNetwork] as IconNamesList,
            value: localVaultNetwork,
            label: capitalize(sdkNetworkToHumanNetwork(localVaultNetwork)),
          }
        : allNetworksOption,
    [localVaultNetwork],
  )
  const vaultsNetworksList = useMemo(
    () => [
      ...[...new Set(vaultsList.map(({ protocol }) => protocol.network))].map((network) => ({
        iconName: networkIconByNetworkName[network] as IconNamesList,
        value: network,
        label: capitalize(sdkNetworkToHumanNetwork(network)),
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
        softRouterPush(`/earn/${sdkNetworkToHumanNetwork(selected.value as SDKNetwork)}`)

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
      isMobile={isMobile}
      networksList={vaultsNetworksList}
      selectedNetwork={selectedNetworkOption}
      onChangeNetwork={handleChangeNetwork}
      topContent={
        <SimpleGrid
          columns={isMobile ? 1 : 3}
          rows={isMobile ? 3 : 1}
          style={{ justifyItems: 'stretch' }}
          gap={isMobile ? 16 : 170}
        >
          <DataBlock
            title="Total Assets"
            // TODO: fill data
            titleTooltip="Tooltip about assets or something"
            size="large"
            value={`$${formattedTotalAssets}`}
          />

          <DataBlock
            title="Total Liquidity"
            // TODO: fill data
            titleTooltip="Tooltip about liquidity or something"
            size="large"
            // TODO: fill data
            value="14.3b"
          />
          <DataBlock
            title="Protocols Supported"
            // TODO: fill data
            titleTooltip="Tooltip about protocols or something"
            size="large"
            // TODO: fill data
            value="6"
          />
        </SimpleGrid>
      }
      leftContent={
        <>
          <div>
            <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Choose a strategy
            </Text>
          </div>
          {networkFilteredVaults.map((vault, vaultIndex) => (
            <VaultCard
              key={vault.id}
              {...vault}
              withHover
              selected={vaultId === vault.id || (!vaultId && vaultIndex === 0)}
              onClick={handleChangeVault}
            />
          ))}
        </>
      }
      rightContent={
        <VaultSimulationForm
          vaultData={selectedVaultData ?? networkFilteredVaults[0]}
          isMobile={isMobile}
        />
      }
    />
  )
}
