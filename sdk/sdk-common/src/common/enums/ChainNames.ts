// Make sure the names are unique

// TODO: rethink the family enums / hierachy if we need to separate them into separate familiites or independant list of chains
export enum ChainFamilyName {
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Optimism = 'Optimism',
  Base = 'Base',
}

export enum EthereumChainNames {
  Mainnet = 'Mainnet',
  Goerli = 'Goerli',
}

export enum ArbitrumChainNames {
  ArbitrumOne = 'ArbitrumOne',
}

export enum OptimismChainNames {
  Optimism = 'Optimism',
}

export enum BaseChainNames {
  Mainnet = 'Base',
}

export type ChainNames =
  | EthereumChainNames
  | ArbitrumChainNames
  | OptimismChainNames
  | BaseChainNames
