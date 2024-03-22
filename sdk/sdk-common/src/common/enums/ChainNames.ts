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
  Mainnet = 'Mainnet',
}

export type ChainNames =
  | EthereumChainNames
  | ArbitrumChainNames
  | OptimismChainNames
  | BaseChainNames
