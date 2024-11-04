import type { GenericMultiselectOption } from '@summerfi/app-earn-ui'
import {
  type IconNamesList,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { networkIconByNetworkName } from '@/constants/networkIcons'
import { arkNameMap } from '@/features/rebalance-activity/table/mapper'

// it's handled like that for now until we will have protocol as property in subgraph
const notSupportedProtocolsForNow = ['ERC4626', 'BufferArk']

const protocolIconList: { [key: string]: IconNamesList } = {
  AaveV3: 'aave_circle_color',
  CompoundV3: 'compound_circle_color',
  // not sure if these below will have these exact keys
  Spark: 'spark_circle_color',
  Sky: 'sky',
  Morpho: 'morpho_circle_color',
  PendlePt: 'pendle',
}

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

const mapProtocolsToMultiselectOptions = (
  vaultsList: SDKVaultsListType,
): GenericMultiselectOption[] => {
  const uniqueProtocolsList = [
    ...new Set(vaultsList.flatMap((vault) => vault.arks.map((ark) => ark.name?.split('-')[0]))),
  ].filter((item) => item && !notSupportedProtocolsForNow.includes(item)) as string[]

  return uniqueProtocolsList.map((protocol) => ({
    label: arkNameMap[protocol],
    icon: protocolIconList[protocol] ?? 'not_supported_icon',
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
