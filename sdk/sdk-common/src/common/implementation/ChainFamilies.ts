import {
  ArbitrumChainNames,
  BaseChainNames,
  ChainFamilyName,
  EthereumChainNames,
  OptimismChainNames,
} from '../enums/ChainNames'
import { ChainInfo } from './ChainInfo'
import { ChainId } from '../aliases/ChainId'

/**
 * Chain definition per family
 */
const EthereumFamily: Record<EthereumChainNames, ChainInfo> = {
  [EthereumChainNames.Mainnet]: {
    chainId: 1,
    name: EthereumChainNames.Mainnet,
  },
  [EthereumChainNames.Goerli]: {
    chainId: 5,
    name: EthereumChainNames.Goerli,
  },
}

const ArbitrumFamily: Record<ArbitrumChainNames, ChainInfo> = {
  [ArbitrumChainNames.ArbitrumOne]: {
    chainId: 42161,
    name: ArbitrumChainNames.ArbitrumOne,
  },
}

const OptimismFamily: Record<OptimismChainNames, ChainInfo> = {
  [OptimismChainNames.Optimism]: {
    chainId: 10,
    name: OptimismChainNames.Optimism,
  },
}

const BaseFamily: Record<BaseChainNames, ChainInfo> = {
  [BaseChainNames.Mainnet]: {
    chainId: 8453,
    name: BaseChainNames.Mainnet,
  },
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
}

export type ChainFamilyInfo = {
  familyName: ChainFamilyName
  chainId: ChainId
  name: string
}

export type ChainFamilyInfoById = Record<ChainId, ChainFamilyInfo>

/**
 * @type Record<ChainId, ChainInfo>
 * @description Utility function to merge all chain families into a single map
 */
function createChainIdToChainInfoMap(): ChainFamilyInfoById {
  return Object.entries(ChainFamilyMap).reduce((acc, [familyName, family]) => {
    Object.entries(family).reduce((acc, [, chainInfo]) => {
      acc[chainInfo.chainId] = {
        familyName: familyName as ChainFamilyName,
        chainId: chainInfo.chainId,
        name: chainInfo.name,
      }
      return acc
    }, acc)
    return acc
  }, {} as ChainFamilyInfoById)
}

const chainIdToChainInfoMap = createChainIdToChainInfoMap()

export function getChainInfoByChainId(chainId: ChainId): ChainInfo | undefined {
  return chainIdToChainInfoMap[chainId]
}

export function valuesOfChainFamilyMap(families: ChainFamilyName[]): ChainInfo[] {
  return families.flatMap((family) => {
    const familyMap = ChainFamilyMap[family]
    return Object.values(familyMap)
  })
}
