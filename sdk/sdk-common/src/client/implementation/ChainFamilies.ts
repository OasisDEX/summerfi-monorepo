import {
  EthereumChainNames,
  ArbitrumChainNames,
  OptimismChainNames,
  BaseChainNames,
  ChainFamilyName,
} from '~sdk-common/common/enums'
import type { ChainInfo } from '~sdk-common/common/implementation'

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
