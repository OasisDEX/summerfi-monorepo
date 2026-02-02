import { useCallback } from 'react'
import { type DropdownRawOption } from '@summerfi/app-types'
import { type ReadonlyURLSearchParams, useRouter } from 'next/navigation'

import { useHandleDropdownChangeEvent } from '@/hooks/use-mixpanel-event'

export type VaultsListFiltersType = {
  assets?: string[]
  networks?: string[]
  vaults?: string
  sorting?: DropdownRawOption
  walletAddress?: string
}

export const useVaultsListQueryParams = () => {
  const dropdownChangeHandler = useHandleDropdownChangeEvent()
  const { push } = useRouter()

  const routerPush = useCallback(
    (url: string, isSoftPush: boolean) => {
      if (isSoftPush) {
        window.history.pushState(null, '', url)
      } else {
        push(url, { scroll: false })
      }
    },
    [push],
  )

  const updateQueryParams = useCallback(
    (params: ReadonlyURLSearchParams, newFilters: VaultsListFiltersType) => {
      // we want a hard reload when walletAddress filter is changed
      const isSoftPush = !(params.get('walletAddress') ?? newFilters.walletAddress)
      // use soft router push to update the URL without reloading the page, except for walletAddress filter which requires full reload
      const newQueryParams = {
        ...(newFilters.assets && { assets: newFilters.assets.join(',') }),
        ...(newFilters.networks && { networks: newFilters.networks.join(',') }),
        ...(newFilters.walletAddress && { walletAddress: newFilters.walletAddress }),
        ...(newFilters.vaults && {
          vaults: newFilters.vaults !== 'risk-managed' ? newFilters.vaults : '', // if its the default one its gonna be deleted below
        }),
        ...(newFilters.sorting && {
          sort: newFilters.sorting.value !== 'highest-apy' ? newFilters.sorting.value : '', // if its the default one its gonna be deleted below
        }),
      }

      const nextQueryParams = new URLSearchParams(newQueryParams)
      const currentQueryParams = new URLSearchParams(params.toString())
      const mergedQueryParams = new URLSearchParams({
        ...Object.fromEntries(currentQueryParams.entries()),
        ...Object.fromEntries(nextQueryParams.entries()),
      })

      for (const param of ['assets', 'networks', 'sort', 'vaults', 'walletAddress']) {
        if (mergedQueryParams.get(param) === null || mergedQueryParams.get(param) === '') {
          mergedQueryParams.delete(param)
        }
      }

      const isAssetsChange = newFilters.assets !== undefined
      const isNetworksChange = newFilters.networks !== undefined
      const isSortingChange = newFilters.sorting !== undefined
      const isVaultsChange = newFilters.vaults !== undefined
      const isWalletAddressChange = newFilters.walletAddress !== ''
      const dropdownName = isAssetsChange
        ? 'vaults-list-view-assets'
        : isNetworksChange
          ? 'vaults-list-view-networks'
          : isSortingChange
            ? 'vaults-list-view-sorting'
            : isVaultsChange
              ? 'vaults-list-view-vaults'
              : isWalletAddressChange
                ? 'vaults-list-view-walletAddress'
                : ''

      dropdownChangeHandler({
        inputName: dropdownName,
        value:
          newFilters.assets?.join(',') ??
          newFilters.networks?.join(',') ??
          newFilters.vaults ??
          newFilters.walletAddress ??
          newFilters.sorting?.value ??
          'unknown',
      })

      const newUrl = isSoftPush
        ? `/earn?${mergedQueryParams.toString()}`
        : `/?${mergedQueryParams.toString()}`

      routerPush(newUrl, isSoftPush)
    },
    [dropdownChangeHandler, routerPush],
  )

  return {
    updateQueryParams,
  }
}
