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
  const protocolsMap = new Map<string, { label: string; value: string }>()

  vaultsList.forEach((vault) => {
    vault.arks.forEach((ark) => {
      const protocol = ark.name?.split('-') ?? ['n/a']
      const label = getProtocolLabel(protocol)
      const value = ark.name ?? ''

      protocolsMap.set(label, { label, value }) // Changed key to label instead of value
    })
  })

  return Array.from(protocolsMap.values()).map((item) => ({
    label: item.label,
    icon: getProtocolIcon(item.label),
    value: item.value.replace(/-\d+$/u, ''),
  }))
}

export const mapMultiselectOptions = (vaultsList: SDKVaultsListType) => {
  return {
    strategiesOptions: mapStrategiesToMultiselectOptions(vaultsList),
    tokensOptions: mapTokensToMultiselectOptions(vaultsList),
    protocolsOptions: mapProtocolsToMultiselectOptions(vaultsList),
  }
}
