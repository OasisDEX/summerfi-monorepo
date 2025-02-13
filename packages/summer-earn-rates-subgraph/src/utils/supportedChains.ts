import { subgraphNameByChainMap } from './subgraphNameByChainMap'

export const supportedChains = Object.keys(subgraphNameByChainMap).map((k) => parseInt(k))
