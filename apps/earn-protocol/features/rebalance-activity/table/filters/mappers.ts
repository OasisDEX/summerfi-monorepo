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
  const protocolsMap = new Map<string, { label: string; values: string[] }>()

  vaultsList.forEach((vault) =>
    vault.arks.forEach((ark) => {
      if (!ark.name) return

      const protocol = ark.name.split('-')
      const label = getProtocolLabel(protocol)

      if (!protocolsMap.has(label)) {
        protocolsMap.set(label, { label, values: [] })
      }
      protocolsMap.get(label)?.values.push(ark.name)
    }),
  )

  return Array.from(protocolsMap.values()).map(({ label, values }) => ({
    label,
    icon: getProtocolIcon(label),
    value: [...new Set(values)].join(','),
  }))
}

export const mapMultiselectOptions = (vaultsList: SDKVaultsListType) => {
  return {
    strategiesOptions: mapStrategiesToMultiselectOptions(vaultsList),
    tokensOptions: mapTokensToMultiselectOptions(vaultsList),
    protocolsOptions: mapProtocolsToMultiselectOptions(vaultsList),
  }
}

export const parseProtocolFilter = (protocolFilter: string[] | undefined) => {
  return protocolFilter?.reduce((acc: string[], protocol: string) => {
    const [baseProtocol] = protocol.split('-')
    const existingProtocol = acc.find((p) => p.startsWith(baseProtocol))

    if (existingProtocol) {
      const index = acc.indexOf(existingProtocol)

      acc[index] = `${existingProtocol},${protocol}`
    } else {
      acc.push(protocol)
    }

    return [...new Set(acc)]
  }, [])
}
