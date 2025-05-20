import {
  type GenericMultiselectOption,
  getDisplayToken,
  getUniqueVaultId,
  networkIconByNetworkName,
  Risk,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'

const mapStrategiesToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] =>
  vaultsList.map((vault) => ({
    label: getDisplayToken(vault.inputToken.symbol),
    labelSuffix: (
      <Risk
        risk={vault.customFields?.risk ?? 'lower'}
        variant="p4semi"
        styles={{ lineHeight: 'unset' }}
      />
    ),
    token: getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList,
    networkIcon: networkIconByNetworkName[vault.protocol.network],
    value: getUniqueVaultId(vault),
  }))

export const mapTokensToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] => {
  const uniqueTokenSymbolList = [
    ...new Set(vaultsList.map((vault) => getDisplayToken(vault.inputToken.symbol))),
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
