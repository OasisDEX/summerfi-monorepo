import { AutomationFeature, EarnStrategies } from '@summerfi/app-db'
import { NetworkNames } from '@summerfi/serverless-shared'
import { OmniProductType } from '../omni-kit'
import { TranslatableType } from '../translatable'
import { LendingProtocol } from '../lending-protocol'

export type ProductHubMultiplyStrategyType = 'long' | 'short'
export type ProductHubManagementType = 'active' | 'passive'

export type ProductHubSupportedNetworks =
  | NetworkNames.ethereumMainnet
  | NetworkNames.arbitrumMainnet
  | NetworkNames.optimismMainnet
  | NetworkNames.baseMainnet

export enum ProductHubCategory {
  All = 'all',
  Restaking = 'restaking',
  StakingRewards = 'staking-rewards',
  TokenFarming = 'token-farming',
  YieldLoops = 'yield-loops',
}

export enum ProductHubTag {
  BluechipAssets = 'bluechip-assets',
  EasiestToManage = 'easiest-to-manage',
  EthDerivativeYieldLoops = 'eth-derivative-yield-loops',
  Gt1BTvl = 'gt-1b-tvl',
  IsolatedPairs = 'isolated-pairs',
  Long = 'long',
  Longevity = 'longevity',
  LpOnly = 'lp-only',
  Memecoins = 'memecoins',
  MoreCapitalEfficient = 'more-capital-efficient',
  NonStablecoinCollateral = 'non-stablecoin-collateral',
  Short = 'short',
  StablecoinStrategies = 'stablecoin-strategies',
}

export type ProductHubColumnKey =
  | '7DayNetApy'
  | 'action'
  | 'borrowRate'
  | 'collateralDebt'
  | 'depositToken'
  | 'liquidity'
  | 'management'
  | 'maxLtv'
  | 'maxMultiple'
  | 'protocolNetwork'
  | 'strategy'
  | 'automation'

export interface ProductHubItemBasics {
  label: string
  network: ProductHubSupportedNetworks
  primaryToken: string
  primaryTokenAddress: string
  primaryTokenGroup?: string
  product: OmniProductType[]
  protocol: unknown
  secondaryToken: string
  secondaryTokenAddress: string
  secondaryTokenGroup?: string
}

export interface ProductHubItemDetails {
  automationFeatures?: AutomationFeature[]
  depositToken?: string
  earnStrategy?: EarnStrategies
  earnStrategyDescription?: string
  // borrow rate
  fee?: string
  hasRewards?: boolean
  liquidity?: string
  managementType?: ProductHubManagementType
  maxLtv?: string
  maxMultiply?: string
  multiplyStrategy?: string
  multiplyStrategyType?: ProductHubMultiplyStrategyType
  reverseTokens?: boolean
  weeklyNetApy?: string
}

export type ProductHubTooltipType = {
  content: {
    title?: {
      key: string
      props?: {
        [key: string]: string
      }
    }
    description: {
      key: string
      props?: {
        [key: string]: string
      }
    }
  }
  icon: unknown
  iconColor?: string
}

interface AssetsTableTooltipProps {
  content: {
    title?: TranslatableType
    description: TranslatableType
  }
  icon: ProductHubTooltipType['icon']
  iconColor?: string
}

export interface ProductHubItemTooltips {
  tooltips?: {
    [key in
      | keyof Omit<ProductHubItemDetails, 'depositToken' | 'multiplyStrategyType'>
      | 'asset']?: AssetsTableTooltipProps
  }
}

export type ProductHubItemData = ProductHubItemBasics & ProductHubItemDetails
export type ProductHubItem = ProductHubItemData & ProductHubItemTooltips
export type ProductHubItemWithoutAddress = Omit<
  ProductHubItem,
  'primaryTokenAddress' | 'secondaryTokenAddress'
>

export type ProductHubItemWithFlattenTooltip = Omit<ProductHubItem, 'tooltips'> & {
  tooltips: string
}

export interface ProductHubData {
  table: ProductHubItem[]
}
export interface ProductHubFilters {
  [key: string]: string[]
}

export type ProductHubCategories = {
  [key in OmniProductType]: {
    icon: string
    id: ProductHubCategory
  }[]
}

export type ProductHubTags = {
  [key in OmniProductType]: ProductHubTag[]
}

export interface ProductHubFeaturedFilters
  extends Partial<
    Omit<ProductHubItemData, 'automationFeatures' | 'hasRewards' | 'product' | 'reverseTokens'>
  > {
  network: ProductHubSupportedNetworks
  primaryToken: string
  product: OmniProductType
  protocol: LendingProtocol
  secondaryToken: string
}

export type ProductHubDatabaseQuery = Partial<ProductHubFeaturedFilters>

export type ProductHubFeaturedProducts = {
  isTagged?: boolean
  isHighlighted?: boolean
  isPromoted?: boolean
  isStickied?: boolean
  limit?: number
  products: ProductHubFeaturedFilters[]
}
