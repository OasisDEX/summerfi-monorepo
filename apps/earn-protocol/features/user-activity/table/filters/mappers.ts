import type { GenericMultiselectOption } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'

import { networkIconByNetworkName } from '@/constants/networkIcons'

const mapStrategiesToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] =>
  vaultsList.map((vault) => ({
    label: vault.inputToken.symbol,
    token: vault.inputToken.symbol as TokenSymbolsList,
    networkIcon: networkIconByNetworkName[vault.protocol.network],
    value: vault.id,
  }))

const mapTokensToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] => {
  const uniqueTokenSymbolList = [
    ...new Set(vaultsList.map((vault) => vault.inputToken.symbol)),
  ] as TokenSymbolsList[]

  return uniqueTokenSymbolList.map((symbol) => ({
    label: symbol,
    token: symbol,
    value: symbol,
  }))
}

export const mapMultiselectOptions = (vaultsList: SDKVaultsListType) => {
  return {
    strategiesOptions: mapStrategiesToMultiselectOptions(vaultsList),
    tokensOptions: mapTokensToMultiselectOptions(vaultsList),
  }
}
