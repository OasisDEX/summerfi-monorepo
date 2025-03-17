import {
  ArbitrumChainNames,
  BaseChainNames,
  ChainFamilyName,
  EthereumChainNames,
  OptimismChainNames,
  SonicChainNames,
} from '../enums/ChainNames'
import { ChainInfo } from './ChainInfo'
import { ChainId } from '../types/ChainId'
import { ChainIds } from './ChainIds'

/**
 * Chain definition per family
 */
const EthereumFamily: Record<EthereumChainNames, ChainInfo> = {
  [EthereumChainNames.Mainnet]: ChainInfo.createFrom({
    chainId: ChainIds.Mainnet,
    name: EthereumChainNames.Mainnet,
  }),
  [EthereumChainNames.Goerli]: ChainInfo.createFrom({
    chainId: 5,
    name: EthereumChainNames.Goerli,
  }),
}

const ArbitrumFamily: Record<ArbitrumChainNames, ChainInfo> = {
  [ArbitrumChainNames.ArbitrumOne]: ChainInfo.createFrom({
    chainId: ChainIds.ArbitrumOne,
    name: ArbitrumChainNames.ArbitrumOne,
  }),
}

const OptimismFamily: Record<OptimismChainNames, ChainInfo> = {
  [OptimismChainNames.Optimism]: ChainInfo.createFrom({
    chainId: ChainIds.Optimism,
    name: OptimismChainNames.Optimism,
  }),
}

const BaseFamily: Record<BaseChainNames, ChainInfo> = {
  [BaseChainNames.Mainnet]: ChainInfo.createFrom({
    chainId: ChainIds.Base,
    name: BaseChainNames.Mainnet,
  }),
}

const SonicFamily: Record<SonicChainNames, ChainInfo> = {
  [SonicChainNames.Sonic]: ChainInfo.createFrom({
    chainId: ChainIds.Sonic,
    name: BaseChainNames.Mainnet,
  }),
}

/**
 * Complex type to allow Typescript to figure out the type of the value when
 * using a ChainFamilyName as a key
 */
export type ChainFamily = {
  [key in ChainFamilyName]: key extends ChainFamilyName.Ethereum
    ? typeof EthereumFamily
    : key extends ChainFamilyName.Arbitrum
      ? typeof ArbitrumFamily
      : key extends ChainFamilyName.Optimism
        ? typeof OptimismFamily
        : key extends ChainFamilyName.Base
          ? typeof BaseFamily
          : key extends ChainFamilyName.Sonic
            ? typeof SonicFamily
            : never
}

/**
 * @type ChainFamilyMap
 * @description A map of chain family names to chain families. It can be used to
 *              retrieve the ChainId of a chain family + chain combination
 */
export const ChainFamilyMap: ChainFamily = {
  [ChainFamilyName.Ethereum]: EthereumFamily,
  [ChainFamilyName.Arbitrum]: ArbitrumFamily,
  [ChainFamilyName.Optimism]: OptimismFamily,
  [ChainFamilyName.Base]: BaseFamily,
  [ChainFamilyName.Sonic]: SonicFamily,
}

export type ChainFamilyInfo = {
  familyName: ChainFamilyName
  chainInfo: ChainInfo
}

export type ChainFamilyInfoById = Record<ChainId, ChainFamilyInfo>

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

export function getChainFamilyInfoByChainId(chainId: ChainId): ChainFamilyInfo {
  const maybe = chainIdToChainFamilyInfoMap[chainId]
  if (!maybe) {
    throw new Error(`Chain with id ${chainId} not supported`)
  }
  return maybe
}

export function getChainInfoByChainId(chainId: ChainId): ChainInfo {
  const chainFamilyInfo = getChainFamilyInfoByChainId(chainId)
  const maybeChainInfo = chainFamilyInfo?.chainInfo
  if (!maybeChainInfo) {
    throw new Error(`Chain with id ${chainId} not supported`)
  }
  return maybeChainInfo
}

export function valuesOfChainFamilyMap(families: ChainFamilyName[]): ChainInfo[] {
  return families.flatMap((family) => {
    const familyMap = ChainFamilyMap[family]
    return Object.values(familyMap)
  })
}
