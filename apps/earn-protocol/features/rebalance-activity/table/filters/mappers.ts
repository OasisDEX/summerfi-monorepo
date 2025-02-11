import {
  type GenericMultiselectOption,
  getDisplayToken,
  getUniqueVaultId,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'

import { networkIconByNetworkName } from '@/constants/networkIcons'
import { getProtocolLabel } from '@/helpers/get-protocol-label'

const getProtocolIcon = (protocolLabel: string) => {
  const lowerCasedProtocolLabel = protocolLabel.toLowerCase()

  if (lowerCasedProtocolLabel.includes('morpho')) {
    return 'morpho_circle_color'
  }
  if (lowerCasedProtocolLabel.includes('aave')) {
    return 'aave_circle_color'
  }
  if (lowerCasedProtocolLabel.includes('compound')) {
    return 'compound_circle_color'
  }
  if (lowerCasedProtocolLabel.includes('spark')) {
    return 'spark_circle_color'
  }
  if (lowerCasedProtocolLabel.includes('sky')) {
    return 'sky'
  }
  if (lowerCasedProtocolLabel.includes('pendle')) {
    return 'pendle'
  }
  if (lowerCasedProtocolLabel.includes('fluid')) {
    return 'fluid'
  }
  if (lowerCasedProtocolLabel.includes('gearbox')) {
    return 'gearbox'
  }

  if (lowerCasedProtocolLabel.includes('buffer')) {
    return 'cog'
  }

  if (lowerCasedProtocolLabel.includes('euler')) {
    return 'euler'
  }

  return 'not_supported_icon'
}

const mapStrategiesToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] =>
  vaultsList.map((vault) => ({
    label: getDisplayToken(vault.inputToken.symbol),
    token: getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList,
    networkIcon: networkIconByNetworkName[vault.protocol.network],
    value: getUniqueVaultId(vault),
  }))

const mapTokensToMultiselectOptions = (
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

const mapProtocolsToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] => {
  const uniqueProtocolsList = [
    ...new Set(
      vaultsList.flatMap((vault) =>
        vault.arks.map((ark) => {
          const protocol = ark.name?.split('-') ?? ['n/a']

          return getProtocolLabel(protocol)
        }),
      ),
    ),
  ]

  return uniqueProtocolsList.map((protocol) => ({
    label: protocol,
    icon: getProtocolIcon(protocol),
    value: protocol,
  }))
}

export const mapMultiselectOptions = (vaultsList: SDKVaultsListType) => {
  return {
    strategiesOptions: mapStrategiesToMultiselectOptions(vaultsList),
    tokensOptions: mapTokensToMultiselectOptions(vaultsList),
    protocolsOptions: mapProtocolsToMultiselectOptions(vaultsList),
  }
}
