import {
  EthereumChainNames,
  type ChainInfo,
  ArbitrumChainNames,
  BaseChainNames,
  ChainFamilyName,
  OptimismChainNames,
  ChainId,
} from '@summerfi/sdk-common/common'

/**
 * Chain definition per family
 */
const EthereumFamily: Record<EthereumChainNames, ChainInfo> = {
  [EthereumChainNames.Mainnet]: {
    chainId: ChainId.Mainnet,
    name: EthereumChainNames.Mainnet,
  },
  [EthereumChainNames.Goerli]: {
    chainId: ChainId.Goerli,
    name: EthereumChainNames.Goerli,
  },
}

const ArbitrumFamily: Record<ArbitrumChainNames, ChainInfo> = {
  [ArbitrumChainNames.ArbitrumOne]: {
    chainId: ChainId.Arbitrum,
    name: ArbitrumChainNames.ArbitrumOne,
  },
}

const OptimismFamily: Record<OptimismChainNames, ChainInfo> = {
  [OptimismChainNames.Optimism]: {
    chainId: ChainId.Optimism,
    name: OptimismChainNames.Optimism,
  },
}

const BaseFamily: Record<BaseChainNames, ChainInfo> = {
  [BaseChainNames.Mainnet]: {
    chainId: ChainId.Base,
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

// ==== NOT STRICTLY NECESSARY FOR THIS PR
// ==== MIGHT BE USEFUL FOR TOKENSERVICE?

/**
 * @type Record<ChainId, ChainInfo>
 * @description Utility function to merge all chain families into a single map
 */
function createChainIdToChainInfoMap(): Record<ChainId, ChainInfo> {
  const allFamilies = { ...EthereumFamily, ...ArbitrumFamily, ...OptimismFamily, ...BaseFamily }
  const chainIdToChainInfoMap: Record<number, ChainInfo> = {}

  for (const chainInfo of Object.values(allFamilies)) {
    chainIdToChainInfoMap[chainInfo.chainId] = chainInfo
  }

  return chainIdToChainInfoMap
}

const chainIdToChainInfoMap = createChainIdToChainInfoMap()

export function getChainInfoByChainId(chainId: ChainId): ChainInfo | undefined {
  return chainIdToChainInfoMap[chainId]
}
