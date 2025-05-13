// Make sure the names are unique

// TODO: rethink the family enums / hierachy if we need to separate them into separate familiites or independant list of chains
export enum ChainFamilyName {
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Optimism = 'Optimism',
  Base = 'Base',
  Sonic = 'Sonic',
}

export enum EthereumChainNames {
  Mainnet = 'Mainnet',
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

export enum SonicChainNames {
  Sonic = 'Sonic',
}

export type ChainNames =
  | EthereumChainNames
  | ArbitrumChainNames
  | OptimismChainNames
  | BaseChainNames
  | SonicChainNames
