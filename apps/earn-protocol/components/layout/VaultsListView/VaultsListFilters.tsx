'use client'

import { type CSSProperties, type MouseEventHandler, useMemo } from 'react'
import { useAuthModal, useUser } from '@account-kit/react'
import {
  Dropdown,
  GenericMultiselect,
  type GenericMultiselectOption,
  GenericMultiselectPill,
  isUserSmartAccount,
  networkNameIconNameMap,
  Text,
  ToggleButton,
  useMobileCheck,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type IconNamesList,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@summerfi/app-utils'
import { type Network } from '@summerfi/subgraph-manager-common'
import { capitalize } from 'lodash-es'
import { type ReadonlyURLSearchParams } from 'next/navigation'

import { VaultsSorting } from '@/components/layout/VaultsListView/types'
import {
  useVaultsListQueryParams,
  type VaultsListFiltersType,
} from '@/components/layout/VaultsListView/use-vaults-list-query-params'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { mapTokensToMultiselectOptions } from '@/features/latest-activity/table/filters/mappers'
import { filterOutNonSCACompatibleVaults } from '@/helpers/filter-out-non-sca-compatible-vaults'
import { isStablecoin } from '@/helpers/is-stablecoin'

import vaultsListViewStyles from './VaultsListView.module.css'

const sortingMethods = [
  {
    // default sorting method
    id: VaultsSorting.HIGHEST_APY,
    label: 'Highest APY',
  },
  {
    id: VaultsSorting.HIGHEST_REWARDS,
    label: 'Highest SUMR Rewards',
  },
  {
    id: VaultsSorting.HIGHEST_TVL,
    label: 'Highest TVL',
  },
]

const VaultsSortingItem = ({ label, style }: { label: string; style?: CSSProperties }) => {
  return (
    <Text variant="p3semi" style={style}>
      {label}
    </Text>
  )
}

const VaultsSortingItemV2 = ({ label, style }: { label: string; style?: CSSProperties }) => {
  return (
    <Text variant="p4semi" className={vaultsListViewStyles.pillShapedWrapper} style={style}>
      {label}
    </Text>
  )
}

export const VaultsListFiltersV1 = ({
  assetsList,
  vaultsNetworksList,
  tokenOptionGroups,
  vaultsNetworksOptionGroups,
  selectedSortingMethod,
  updateQueryParams,
  queryParams,
  filterAssets,
  filterNetworks,
}: {
  assetsList: GenericMultiselectOption[]
  vaultsNetworksList: {
    icon: IconNamesList
    value: Network
    label: string
  }[]
  tokenOptionGroups: {
    id: string
    key: string
    icon?: IconNamesList
    buttonStyle?: CSSProperties
    iconStyle?: CSSProperties
    options: string[]
  }[]
  vaultsNetworksOptionGroups: {
    id: string
    key: string
    icon?: IconNamesList
    buttonStyle?: CSSProperties
    iconStyle?: CSSProperties
    options: string[]
  }[]
  selectedSortingMethod: { id: string; label: string }
  updateQueryParams: (params: ReadonlyURLSearchParams, newFilters: VaultsListFiltersType) => void
  queryParams: ReadonlyURLSearchParams
  filterAssets: string[]
  filterNetworks: string[]
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  return (
    <>
      <div className={vaultsListViewStyles.leftHeaderRow}>
        <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          Choose a strategy
        </Text>
      </div>
      <div className={vaultsListViewStyles.leftHeaderFiltersRow}>
        <div className={vaultsListViewStyles.filtersGroup}>
          <GenericMultiselect
            options={assetsList}
            label="Tokens"
            onChange={(assets) => {
              updateQueryParams(queryParams, { assets })
            }}
            initialValues={filterAssets}
            optionGroups={tokenOptionGroups}
            style={{ width: isMobile ? '100%' : 'fit-content' }}
          />
          <GenericMultiselect
            options={vaultsNetworksList}
            label="Networks"
            onChange={(networks) => {
              updateQueryParams(queryParams, { networks })
            }}
            initialValues={filterNetworks}
            optionGroups={vaultsNetworksOptionGroups}
            style={{ width: isMobile ? '100%' : 'fit-content' }}
          />
        </div>
        <Dropdown
          dropdownChildrenStyle={{
            width: isMobile ? '100%' : 'fit-content',
          }}
          dropdownValue={{
            value: selectedSortingMethod.id,
            content: <VaultsSortingItem label={selectedSortingMethod.label} />,
          }}
          options={sortingMethods.map(({ id, label }) => ({
            value: id,
            content: <VaultsSortingItem label={label} />,
          }))}
          onChange={(sorting: DropdownRawOption) => {
            updateQueryParams(queryParams, { sorting })
          }}
          asPill
        >
          <VaultsSortingItem label={selectedSortingMethod.label} style={{ paddingLeft: '5px' }} />
        </Dropdown>
      </div>
    </>
  )
}

export const VaultsListFiltersV2 = ({
  assetsList,
  vaultsNetworksList,
  tokenOptionGroups,
  vaultsNetworksOptionGroups,
  selectedSortingMethod,
  updateQueryParams,
  queryParams,
  filterAssets,
  filterNetworks,
  filterWallet,
}: {
  assetsList: GenericMultiselectOption[]
  vaultsNetworksList: {
    icon: IconNamesList
    value: Network
    label: string
  }[]
  tokenOptionGroups: {
    id: string
    key: string
    icon?: IconNamesList
    buttonStyle?: CSSProperties
    iconStyle?: CSSProperties
    options: string[]
  }[]
  vaultsNetworksOptionGroups: {
    id: string
    key: string
    icon?: IconNamesList
    buttonStyle?: CSSProperties
    iconStyle?: CSSProperties
    options: string[]
  }[]
  selectedSortingMethod: { id: string; label: string }
  updateQueryParams: (params: ReadonlyURLSearchParams, newFilters: VaultsListFiltersType) => void
  queryParams: ReadonlyURLSearchParams
  filterAssets: string[]
  filterNetworks: string[]
  filterVaults: string[]
  filterWallet: string
}) => {
  const { openAuthModal } = useAuthModal()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const { userWalletAddress } = useUserWallet()

  const inWalletHandler: MouseEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault()
    if (!userWalletAddress) {
      openAuthModal()

      return
    }

    if (filterWallet) {
      updateQueryParams(queryParams, { walletAddress: [] })
    } else {
      updateQueryParams(queryParams, { walletAddress: [userWalletAddress] })
    }
  }

  return (
    <div className={vaultsListViewStyles.leftHeaderFiltersRow} style={{ marginBottom: 0 }}>
      <div className={vaultsListViewStyles.filtersGroup}>
        <div
          className={vaultsListViewStyles.pillWrapperGeneral}
          style={{ cursor: 'pointer' }}
          onClick={inWalletHandler}
        >
          <Text variant="p4semi" className={vaultsListViewStyles.pillShapedWrapper}>
            <span>In wallet</span>{' '}
            <ToggleButton
              checked={!!filterWallet}
              onChange={(ev) => {
                ev.stopPropagation()
              }}
              slideButtonWrapperStyle={{ margin: 0 }}
            />
          </Text>
        </div>
        <GenericMultiselectPill
          options={assetsList}
          label="Assets"
          title="Depositing"
          onChange={(assets) => {
            updateQueryParams(queryParams, { assets })
          }}
          initialValues={filterAssets}
          optionGroups={tokenOptionGroups}
          style={{ width: isMobile ? '100%' : 'fit-content' }}
        />
        <GenericMultiselectPill
          options={vaultsNetworksList}
          label="Networks"
          title="Depositing on"
          onChange={(networks) => {
            updateQueryParams(queryParams, { networks })
          }}
          initialValues={filterNetworks}
          optionGroups={vaultsNetworksOptionGroups}
          style={{ width: isMobile ? '100%' : 'fit-content' }}
        />
        <Dropdown
          dropdownChildrenStyle={{
            width: isMobile ? '100%' : 'fit-content',
          }}
          dropdownValue={{
            value: selectedSortingMethod.id,
            content: (
              <Text variant="p4semi" className={vaultsListViewStyles.pillShapedWrapper}>
                <span className={vaultsListViewStyles.pillShaped}>
                  {selectedSortingMethod.label}
                </span>
              </Text>
            ),
          }}
          options={sortingMethods.map(({ id, label }) => ({
            value: id,
            content: <VaultsSortingItemV2 label={label} />,
          }))}
          onChange={(sorting: DropdownRawOption) => {
            updateQueryParams(queryParams, { sorting })
          }}
          asSmallPill
        >
          <Text variant="p4semi" className={vaultsListViewStyles.pillShapedWrapper}>
            <span>Sort by</span>{' '}
            <span className={vaultsListViewStyles.pillShaped}>{selectedSortingMethod.label}</span>
          </Text>
        </Dropdown>
      </div>
    </div>
  )
}

export const VaultsFiltersIntermediary = ({
  vaultsList,
  sortingMethodId,
  daoManagedVaultsEnabled,
  queryParams,
  filterAssets,
  filterNetworks,
  filterVaults,
  filterWallet,
}: {
  vaultsList: SDKVaultsListType
  sortingMethodId: string | null
  daoManagedVaultsEnabled?: boolean
  queryParams: ReadonlyURLSearchParams
  filterAssets: string[]
  filterNetworks: string[]
  filterVaults: string[]
  filterWallet: string
}) => {
  const user = useUser()
  const userIsSmartAccount = isUserSmartAccount(user)

  const assetsList = useMemo(
    () =>
      mapTokensToMultiselectOptions(vaultsList).filter((option) => {
        return option.token !== 'USD₮0' // remove the fancy glyphs
      }),
    [vaultsList],
  )

  const { updateQueryParams } = useVaultsListQueryParams()
  const selectedSortingMethod = useMemo(() => {
    const sortingMethod = sortingMethods.find(({ id }) => id === sortingMethodId)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sortingMethod ?? sortingMethods.find(({ id }) => id === 'highest-apy')! // selecting the default one
  }, [sortingMethodId])

  const tokenOptionGroups = useMemo(
    () => [
      {
        id: 'all-assets',
        key: 'All assets',
        icon: 'earn_network_all' as IconNamesList,
        buttonStyle: {
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        options: assetsList.map(({ value }) => value),
      },
      {
        id: 'all-stables',
        key: 'All stables',
        icon: 'usd_circle' as IconNamesList,
        buttonStyle: {
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        iconStyle: {
          color: '#777576',
        },
        options: assetsList.map(({ value }) => value).filter(isStablecoin),
      },
    ],
    [assetsList],
  )

  const vaultsNetworksList = useMemo(
    () => [
      ...[
        ...new Set(
          vaultsList
            .filter((vault) => {
              if (userIsSmartAccount) {
                return filterOutNonSCACompatibleVaults([vault]).length > 0
              }

              return true
            })
            .map(({ protocol }) => protocol.network),
        ),
      ].map((network) => ({
        icon: networkNameIconNameMap[supportedSDKNetwork(network)] as IconNamesList,
        value: network,
        label: capitalize(sdkNetworkToHumanNetwork(supportedSDKNetwork(network))),
      })),
    ],
    [vaultsList, userIsSmartAccount],
  )
  const vaultsNetworksOptionGroups = useMemo(() => {
    return [
      {
        id: 'all-networks',
        key: 'All networks',
        icon: 'earn_network_all' as IconNamesList,
        buttonStyle: {
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        options: vaultsNetworksList.map(({ value }) => value),
      },
    ]
  }, [vaultsNetworksList])

  return daoManagedVaultsEnabled ? (
    <VaultsListFiltersV2
      assetsList={assetsList}
      vaultsNetworksList={vaultsNetworksList}
      tokenOptionGroups={tokenOptionGroups}
      vaultsNetworksOptionGroups={vaultsNetworksOptionGroups}
      selectedSortingMethod={selectedSortingMethod}
      updateQueryParams={updateQueryParams}
      queryParams={queryParams}
      filterAssets={filterAssets}
      filterNetworks={filterNetworks}
      filterVaults={filterVaults}
      filterWallet={filterWallet}
    />
  ) : (
    <VaultsListFiltersV1
      assetsList={assetsList}
      vaultsNetworksList={vaultsNetworksList}
      tokenOptionGroups={tokenOptionGroups}
      vaultsNetworksOptionGroups={vaultsNetworksOptionGroups}
      selectedSortingMethod={selectedSortingMethod}
      updateQueryParams={updateQueryParams}
      queryParams={queryParams}
      filterAssets={filterAssets}
      filterNetworks={filterNetworks}
    />
  )
}
