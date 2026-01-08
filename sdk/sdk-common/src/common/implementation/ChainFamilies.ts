import { ChainInfo } from './ChainInfo'
import { ChainIds, LegacyChainIds } from './ChainIds'
import type { ChainId } from '../types/ChainId'

// Make sure the names are unique

// TODO: rethink the family enums / hierachy if we need to separate them into separate familiites or independant list of chains
export enum ChainFamilyName {
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Optimism = 'Optimism',
  Base = 'Base',
  Sonic = 'Sonic',
  Hyperliquid = 'Hyperliquid',
}

/**
 * Chain definition per family
 */
const EthereumFamily: Record<'Mainnet', ChainInfo> = {
  ['Mainnet']: ChainInfo.createFrom({
    chainId: ChainIds.Mainnet,
    name: 'Mainnet',
  }),
}

const ArbitrumFamily: Record<'ArbitrumOne', ChainInfo> = {
  ['ArbitrumOne']: ChainInfo.createFrom({
    chainId: ChainIds.ArbitrumOne,
    name: 'ArbitrumOne',
  }),
}

const OptimismFamily: Record<'Optimism', ChainInfo> = {
  ['Optimism']: ChainInfo.createFrom({
    chainId: LegacyChainIds.Optimism as ChainId,
    name: 'Optimism',
  }),
}

const BaseFamily: Record<'Base', ChainInfo> = {
  ['Base']: ChainInfo.createFrom({
    chainId: ChainIds.Base,
    name: 'Base',
  }),
}

const SonicFamily: Record<'Sonic', ChainInfo> = {
  ['Sonic']: ChainInfo.createFrom({
    chainId: ChainIds.Sonic,
    name: 'Sonic',
  }),
}

const HyperliquidFamily: Record<'Hyperliquid', ChainInfo> = {
  ['Hyperliquid']: ChainInfo.createFrom({
    chainId: ChainIds.Hyperliquid,
    name: 'Hyperliquid',
  }),
}

/**
 * @type ChainFamilyMap
 * @description A map of chain family names to chain families. It can be used to
 *              retrieve the ChainId of a chain family + chain combination
 */
export const ChainFamilyMap = {
  [ChainFamilyName.Ethereum]: EthereumFamily,
  [ChainFamilyName.Arbitrum]: ArbitrumFamily,
  [ChainFamilyName.Optimism]: OptimismFamily,
  [ChainFamilyName.Base]: BaseFamily,
  [ChainFamilyName.Sonic]: SonicFamily,
  [ChainFamilyName.Hyperliquid]: HyperliquidFamily,
}

export type ChainFamilyInfo = {
  familyName: ChainFamilyName
  chainInfo: ChainInfo
}

export type ChainFamilyInfoById = Record<number, ChainFamilyInfo>

/**
 * @type Record<ChainId, ChainInfo>
 * @description Utility function to merge all chain families into a single map
 */
function createChainIdToChainFamilyInfoMap(): ChainFamilyInfoById {
  return Object.entries(ChainFamilyMap).reduce((acc, [familyName, family]) => {
    Object.entries(family).reduce((acc, [, chainInfo]) => {
      acc[chainInfo.chainId] = {
        familyName: familyName as ChainFamilyName,
        chainInfo: chainInfo,
      }
      return acc
    }, acc)
    return acc
  }, {} as ChainFamilyInfoById)
}

const chainIdToChainFamilyInfoMap = createChainIdToChainFamilyInfoMap()

/**
 * @method getChainFamilyInfoByChainId
 * @description Retrieves the ChainFamilyInfo for a given chainId
 *
 * @param chainId The chainId to retrieve the ChainFamilyInfo for
 *
 * @throws Error if the chainId is not supported
 *
 * @returns The ChainFamilyInfo for the given chainId
 */
export function getChainFamilyInfoByChainId(chainId: number): ChainFamilyInfo {
  const maybe = chainIdToChainFamilyInfoMap[chainId]
  if (!maybe) {
    throw new Error(`Chain with id ${chainId} not supported`)
  }
  return maybe
}

/**
 * @method getChainInfoByChainId
 * @description Retrieves the ChainInfo for a given chainId
 *
 * @param chainId The chainId to retrieve the ChainInfo for
 *
 * @throws Error if the chainId is not supported
 *
 * @returns The ChainInfo for the given chainId
 */
export function getChainInfoByChainId(chainId: number): ChainInfo {
  const chainFamilyInfo = getChainFamilyInfoByChainId(chainId)
  return chainFamilyInfo.chainInfo
}

export function valuesOfChainFamilyMap(families: ChainFamilyName[]): ChainInfo[] {
  return families.flatMap((family) => {
    const familyMap = ChainFamilyMap[family]
    return Object.values(familyMap)
  })
}
