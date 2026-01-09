export type Address = `0x${string}`
export type PoolId = `0x${string}`

export enum Network {
  MAINNET = 'mainnet',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  BASE = 'base',
  SEPOLIA = 'sepolia',
  SONIC = 'sonic',
  HYPERLIQUID = 'hyperliquid',
}

export enum NetworkNames {
  ethereumMainnet = 'ethereum',
  arbitrumMainnet = 'arbitrum',
  polygonMainnet = 'polygon',
  optimismMainnet = 'optimism',
  baseMainnet = 'base',
  sonicMainnet = 'sonic',
  hyperliquidMainnet = 'hyperliquid',
}

export enum ChainId {
  MAINNET = 1,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  BASE = 8453,
  SEPOLIA = 11155111,
  SONIC = 146,
  HYPERLIQUID = 999,
}

export const isChainId = (chainId: unknown): chainId is ChainId => {
  if (typeof chainId !== 'number') {
    return false
  }
  return Object.values(ChainId).includes(chainId)
}

export const NetworkByChainID: Record<ChainId, Network> = {
  [ChainId.MAINNET]: Network.MAINNET,
  [ChainId.ARBITRUM]: Network.ARBITRUM,
  [ChainId.OPTIMISM]: Network.OPTIMISM,
  [ChainId.BASE]: Network.BASE,
  [ChainId.SEPOLIA]: Network.SEPOLIA,
  [ChainId.SONIC]: Network.SONIC,
  [ChainId.HYPERLIQUID]: Network.HYPERLIQUID,
}

export const ChainIDByNetwork: Record<Network, ChainId> = {
  [Network.MAINNET]: ChainId.MAINNET,
  [Network.ARBITRUM]: ChainId.ARBITRUM,
  [Network.OPTIMISM]: ChainId.OPTIMISM,
  [Network.BASE]: ChainId.BASE,
  [Network.SEPOLIA]: ChainId.SEPOLIA,
  [Network.SONIC]: ChainId.SONIC,
  [Network.HYPERLIQUID]: ChainId.HYPERLIQUID,
}

export enum ProtocolId {
  AAVE_V2 = 'aave-v2',
  AAVE_V3 = 'aave-v3',
  AAVE3 = 'aave3',
  SPARK = 'spark',
  AJNA = 'ajna',
  MORPHO_BLUE = 'morphoblue',
  MAKER = 'maker',
  /** @deprecated Please use ProtocolId.MORPHO_BLUE */
  MORPHO_BLUE_DEPRECATED = 'morpho-blue',
}

export const isProtocolId = (protocolId: unknown): protocolId is ProtocolId => {
  if (typeof protocolId !== 'string') {
    return false
  }
  return Object.values(ProtocolId).includes(protocolId as ProtocolId)
}

export type Token = {
  symbol: string
  decimals: bigint
  address: Address
}

export type DetailsType =
  | 'netValue'
  | 'netValueEarnActivePassive'
  | 'pnl'
  | 'liquidationPrice'
  | 'ltv'
  | 'multiple'
  | 'collateralLocked'
  | 'totalDebt'
  | 'borrowRate'
  | 'lendingRange'
  | 'earnings'
  | 'apy'
  | '90dApy'
  | 'suppliedToken'
  | 'suppliedTokenBalance'
  | 'borrowedToken'
  | 'borrowedTokenBalance'

export type PortfolioOverviewResponse = {
  suppliedUsdValue: number
  suppliedPercentageChange: number
  borrowedUsdValue: number
  borrowedPercentageChange: number
  summerUsdValue: number
  summerPercentageChange: number
  allAssetsUsdValue: number
}

export type PortfolioWalletAsset = {
  id: string
  name: string
  network: NetworkNames
  symbol: string
  priceUSD: number
  price24hChange?: number
  balance: number
  balanceUSD: number
}

export type PortfolioAssetsResponse = {
  totalAssetsUsdValue: number
  totalAssetsPercentageChange: number
  assets: PortfolioWalletAsset[]
}

export type PortfolioMigrationAsset = {
  symbol: string
  balance: bigint
  balanceDecimals: bigint
  price: bigint
  priceDecimals: bigint
  usdValue: number
}

export type PortfolioMigrationAddressType = 'EOA' | 'DS_PROXY'

export type PortfolioMigration = {
  chainId: ChainId
  protocolId: ProtocolId
  collateralAsset: PortfolioMigrationAsset
  debtAsset: PortfolioMigrationAsset
  positionAddress: Address
  walletAddress: Address
  positionAddressType: PortfolioMigrationAddressType
}

export type PortfolioMigrationsResponse = {
  // only migrations for EOAs - need that for compatibility with the UI.
  migrations: PortfolioMigration[]
  // migrations from EOA and DS_PROXY
  migrationsV2: PortfolioMigration[]
}
