export interface AppConfigType {
  features: Features;
  parameters: Parameters;
  navigation: Navigation;
  rpcConfig: RpcConfig;
}

interface RpcConfig {
  skipCache: boolean;
  skipMulticall: boolean;
  skipGraph: boolean;
  stage: string;
  source: string;
}

interface Navigation {
  protocols: Protocols;
  tokens: Tokens;
}

interface Tokens {
  popular: string[];
  new: string[];
}

interface Protocols {
  ajna: Ajna;
  aave: Ajna;
  maker: Ajna;
  morphoBlue: Ajna;
  spark: Ajna;
}

interface Ajna {
  borrow: Borrow;
  multiply: Borrow;
  earn: Borrow;
  extra: Extra;
}

interface Extra {
  title: string;
  description: string;
  url: string;
}

interface Borrow {
  description: string;
}

interface Parameters {
  topBanner: TopBanner;
  locationBanner: LocationBanner;
  aaveLike: AaveLike;
  connectionMethods: ConnectionMethods;
  automation: Automation;
  walletRpc: WalletRpc;
  subgraphs: Subgraphs;
}

interface Subgraphs {
  baseUrl: string;
  baseShortUrl: string;
}

interface WalletRpc {
  '10': string;
  '8453': string;
  '42161': string;
}

interface Automation {
  minNetValueUSD: MinNetValueUSD;
  defaultMinValue: number;
}

interface MinNetValueUSD {
  mainnet: Mainnet;
  arbitrum: Arbitrum;
  optimism: Arbitrum;
  base: Arbitrum;
}

interface Arbitrum {
  aavev3: number;
}

interface Mainnet {
  aavev3: number;
  sparkv3: number;
}

interface ConnectionMethods {
  injected: boolean;
  walletConnect: boolean;
  walletLink: boolean;
  gnosis: boolean;
  ledger: boolean;
  trezor: boolean;
}

interface AaveLike {
  orderInformation: OrderInformation;
  closeDisabledFor: CloseDisabledFor;
  adjustDisabledFor: AdjustDisabledFor;
  flashLoanTokens: FlashLoanTokens;
  riskRatios: RiskRatios;
}

interface RiskRatios {
  minimum: number;
  default: number;
}

interface FlashLoanTokens {
  OPTIMISMMAINNET: string;
  BASEMAINNET: string;
}

interface AdjustDisabledFor {
  collateral: any[];
  strategyTypes: any[];
}

interface CloseDisabledFor {
  collateral: string[];
  strategyTypes: string[];
}

interface OrderInformation {
  showFlashloanInformation: boolean;
}

interface LocationBanner {
  GB: TopBanner;
}

interface TopBanner {
  enabled: boolean;
  closeable: boolean;
  name: string;
  url: string;
  message: string;
}

interface Features {
  AaveV3ArbitrumBorrow: boolean;
  AaveV3ArbitrumEarn: boolean;
  AaveV3EarncbETHeth: boolean;
  AaveV3EarnrETHeth: boolean;
  AaveV3History: boolean;
  AaveV3OptimismBorrow: boolean;
  AaveV3OptimismEarn: boolean;
  AaveV3Protection: boolean;
  AaveV3ProtectionWrite: boolean;
  AaveV3OptimizationEthereum: boolean;
  AaveV3OptimizationOptimism: boolean;
  AaveV3OptimizationArbitrum: boolean;
  AaveV3OptimizationBase: boolean;
  AaveV3ProtectionLambdaEthereum: boolean;
  AaveV3ProtectionLambdaOptimism: boolean;
  AaveV3ProtectionLambdaArbitrum: boolean;
  AaveV3ProtectionLambdaBase: boolean;
  AaveV3TrailingStopLossLambdaEthereum: boolean;
  AaveV3TrailingStopLossLambdaOptimism: boolean;
  AaveV3TrailingStopLossLambdaArbitrum: boolean;
  AaveV3TrailingStopLossLambdaBase: boolean;
  SparkOptimizationEthereum: boolean;
  SparkTrailingStopLossLambdaEthereum: boolean;
  SparkProtectionLambdaEthereum: boolean;
  AaveV3PartialTakeProfitLambdaEthereum: boolean;
  AaveV3PartialTakeProfitLambdaOptimism: boolean;
  AaveV3PartialTakeProfitLambdaArbitrum: boolean;
  AaveV3PartialTakeProfitLambdaBase: boolean;
  SparkPartialTakeProfitLambdaEthereum: boolean;
  AjnaBase: boolean;
  AjnaPoolFinder: boolean;
  AjnaSafetySwitch: boolean;
  AjnaSuppressValidation: boolean;
  MorphoSafetySwitch: boolean;
  MorphoSuppressValidation: boolean;
  AaveV2SafetySwitch: boolean;
  AaveV2SuppressValidation: boolean;
  AaveV3SafetySwitch: boolean;
  AaveV3SuppressValidation: boolean;
  AaveV3LambdaSuppressValidation: boolean;
  SparkSafetySwitch: boolean;
  SparkSuppressValidation: boolean;
  AnotherTestFeature: boolean;
  BaseNetworkEnabled: boolean;
  ConstantMultipleReadOnly: boolean;
  DaiSavingsRate: boolean;
  DisableSidebarScroll: boolean;
  FollowAAVEVaults: boolean;
  MorphoBlue: boolean;
  NewNavigation: boolean;
  ProxyCreationDisabled: boolean;
  ProxyReveal: boolean;
  ReadOnlyAutoTakeProfit: boolean;
  ReadOnlyBasicBS: boolean;
  Referrals: boolean;
  Sillyness: boolean;
  SparkProtocolStopLoss: boolean;
  SparkOptimization: boolean;
  StopLossOpenFlow: boolean;
  StopLossRead: boolean;
  StopLossWrite: boolean;
  TestFeature: boolean;
  UseNetworkSwitcherForks: boolean;
  UseNetworkSwitcherTestnets: boolean;
  UseRpcGateway: boolean;
  NewPortfolio: boolean;
  OmniPnlModal: boolean;
  MakerTenderly: boolean;
  SparkWBTCDAI: boolean;
  AaveLikeSimpleEarnSafetySwitch: boolean;
  AaveLikeSimpleEarnSuppressValidation: boolean;
  EnableMigrations: boolean;
  EnableRefinance: boolean;
  RefinanceSafetySwitch: boolean;
  RefinanceSuppressValidation: boolean;
  Erc4626Vaults: boolean;
  Erc4626VaultsSafetySwitch: boolean;
  Erc4626VaultsSuppressValidation: boolean;
  DsProxyMigrationEthereum: boolean;
  DsProxyMigrationOptimism: boolean;
  DsProxyMigrationArbitrum: boolean;
  DsProxyMigrationBase: boolean;
  UseOmniKitLinks: boolean;
  OmniKitDebug: boolean;
  ProductHubDebug: boolean;
  LambdaAutomations: LambdaAutomations;
  Rays: boolean;
}

interface LambdaAutomations {
  DisableNetValueCheck: boolean;
  AaveV3: AaveV3;
  MorphoBlue: AaveV3;
}

interface AaveV3 {
  autoBuy: boolean;
  autoSell: boolean;
  partialTakeProfit: boolean;
  stopLoss: boolean;
  trailingStopLoss: boolean;
}
export enum FeaturesEnum {
  AaveV3ArbitrumBorrow = 'AaveV3ArbitrumBorrow',
  AaveV3ArbitrumEarn = 'AaveV3ArbitrumEarn',
  AaveV3EarncbETHeth = 'AaveV3EarncbETHeth',
  AaveV3EarnrETHeth = 'AaveV3EarnrETHeth',
  AaveV3History = 'AaveV3History',
  AaveV3OptimismBorrow = 'AaveV3OptimismBorrow',
  AaveV3OptimismEarn = 'AaveV3OptimismEarn',
  AaveV3Protection = 'AaveV3Protection',
  AaveV3ProtectionWrite = 'AaveV3ProtectionWrite',
  AaveV3OptimizationEthereum = 'AaveV3OptimizationEthereum',
  AaveV3OptimizationOptimism = 'AaveV3OptimizationOptimism',
  AaveV3OptimizationArbitrum = 'AaveV3OptimizationArbitrum',
  AaveV3OptimizationBase = 'AaveV3OptimizationBase',
  AaveV3ProtectionLambdaEthereum = 'AaveV3ProtectionLambdaEthereum',
  AaveV3ProtectionLambdaOptimism = 'AaveV3ProtectionLambdaOptimism',
  AaveV3ProtectionLambdaArbitrum = 'AaveV3ProtectionLambdaArbitrum',
  AaveV3ProtectionLambdaBase = 'AaveV3ProtectionLambdaBase',
  AaveV3TrailingStopLossLambdaEthereum = 'AaveV3TrailingStopLossLambdaEthereum',
  AaveV3TrailingStopLossLambdaOptimism = 'AaveV3TrailingStopLossLambdaOptimism',
  AaveV3TrailingStopLossLambdaArbitrum = 'AaveV3TrailingStopLossLambdaArbitrum',
  AaveV3TrailingStopLossLambdaBase = 'AaveV3TrailingStopLossLambdaBase',
  SparkOptimizationEthereum = 'SparkOptimizationEthereum',
  SparkTrailingStopLossLambdaEthereum = 'SparkTrailingStopLossLambdaEthereum',
  SparkProtectionLambdaEthereum = 'SparkProtectionLambdaEthereum',
  AaveV3PartialTakeProfitLambdaEthereum = 'AaveV3PartialTakeProfitLambdaEthereum',
  AaveV3PartialTakeProfitLambdaOptimism = 'AaveV3PartialTakeProfitLambdaOptimism',
  AaveV3PartialTakeProfitLambdaArbitrum = 'AaveV3PartialTakeProfitLambdaArbitrum',
  AaveV3PartialTakeProfitLambdaBase = 'AaveV3PartialTakeProfitLambdaBase',
  SparkPartialTakeProfitLambdaEthereum = 'SparkPartialTakeProfitLambdaEthereum',
  AjnaBase = 'AjnaBase',
  AjnaPoolFinder = 'AjnaPoolFinder',
  AjnaSafetySwitch = 'AjnaSafetySwitch',
  AjnaSuppressValidation = 'AjnaSuppressValidation',
  MorphoSafetySwitch = 'MorphoSafetySwitch',
  MorphoSuppressValidation = 'MorphoSuppressValidation',
  AaveV2SafetySwitch = 'AaveV2SafetySwitch',
  AaveV2SuppressValidation = 'AaveV2SuppressValidation',
  AaveV3SafetySwitch = 'AaveV3SafetySwitch',
  AaveV3SuppressValidation = 'AaveV3SuppressValidation',
  AaveV3LambdaSuppressValidation = 'AaveV3LambdaSuppressValidation',
  SparkSafetySwitch = 'SparkSafetySwitch',
  SparkSuppressValidation = 'SparkSuppressValidation',
  AnotherTestFeature = 'AnotherTestFeature',
  BaseNetworkEnabled = 'BaseNetworkEnabled',
  ConstantMultipleReadOnly = 'ConstantMultipleReadOnly',
  DaiSavingsRate = 'DaiSavingsRate',
  DisableSidebarScroll = 'DisableSidebarScroll',
  FollowAAVEVaults = 'FollowAAVEVaults',
  MorphoBlue = 'MorphoBlue',
  NewNavigation = 'NewNavigation',
  ProxyCreationDisabled = 'ProxyCreationDisabled',
  ProxyReveal = 'ProxyReveal',
  ReadOnlyAutoTakeProfit = 'ReadOnlyAutoTakeProfit',
  ReadOnlyBasicBS = 'ReadOnlyBasicBS',
  Referrals = 'Referrals',
  Sillyness = 'Sillyness',
  SparkProtocolStopLoss = 'SparkProtocolStopLoss',
  SparkOptimization = 'SparkOptimization',
  StopLossOpenFlow = 'StopLossOpenFlow',
  StopLossRead = 'StopLossRead',
  StopLossWrite = 'StopLossWrite',
  TestFeature = 'TestFeature',
  UseNetworkSwitcherForks = 'UseNetworkSwitcherForks',
  UseNetworkSwitcherTestnets = 'UseNetworkSwitcherTestnets',
  UseRpcGateway = 'UseRpcGateway',
  NewPortfolio = 'NewPortfolio',
  OmniPnlModal = 'OmniPnlModal',
  MakerTenderly = 'MakerTenderly',
  SparkWBTCDAI = 'SparkWBTCDAI',
  AaveLikeSimpleEarnSafetySwitch = 'AaveLikeSimpleEarnSafetySwitch',
  AaveLikeSimpleEarnSuppressValidation = 'AaveLikeSimpleEarnSuppressValidation',
  EnableMigrations = 'EnableMigrations',
  EnableRefinance = 'EnableRefinance',
  RefinanceSafetySwitch = 'RefinanceSafetySwitch',
  RefinanceSuppressValidation = 'RefinanceSuppressValidation',
  Erc4626Vaults = 'Erc4626Vaults',
  Erc4626VaultsSafetySwitch = 'Erc4626VaultsSafetySwitch',
  Erc4626VaultsSuppressValidation = 'Erc4626VaultsSuppressValidation',
  DsProxyMigrationEthereum = 'DsProxyMigrationEthereum',
  DsProxyMigrationOptimism = 'DsProxyMigrationOptimism',
  DsProxyMigrationArbitrum = 'DsProxyMigrationArbitrum',
  DsProxyMigrationBase = 'DsProxyMigrationBase',
  UseOmniKitLinks = 'UseOmniKitLinks',
  OmniKitDebug = 'OmniKitDebug',
  ProductHubDebug = 'ProductHubDebug',
  LambdaAutomations = 'LambdaAutomations',
  Rays = 'Rays',
}
export const emptyConfig = {
  features: {
    "AaveV3ArbitrumBorrow": false,
    "AaveV3ArbitrumEarn": false,
    "AaveV3EarncbETHeth": false,
    "AaveV3EarnrETHeth": false,
    "AaveV3History": false,
    "AaveV3OptimismBorrow": false,
    "AaveV3OptimismEarn": false,
    "AaveV3Protection": false,
    "AaveV3ProtectionWrite": false,
    "AaveV3OptimizationEthereum": false,
    "AaveV3OptimizationOptimism": false,
    "AaveV3OptimizationArbitrum": false,
    "AaveV3OptimizationBase": false,
    "AaveV3ProtectionLambdaEthereum": false,
    "AaveV3ProtectionLambdaOptimism": false,
    "AaveV3ProtectionLambdaArbitrum": false,
    "AaveV3ProtectionLambdaBase": false,
    "AaveV3TrailingStopLossLambdaEthereum": false,
    "AaveV3TrailingStopLossLambdaOptimism": false,
    "AaveV3TrailingStopLossLambdaArbitrum": false,
    "AaveV3TrailingStopLossLambdaBase": false,
    "SparkOptimizationEthereum": false,
    "SparkTrailingStopLossLambdaEthereum": false,
    "SparkProtectionLambdaEthereum": false,
    "AaveV3PartialTakeProfitLambdaEthereum": false,
    "AaveV3PartialTakeProfitLambdaOptimism": false,
    "AaveV3PartialTakeProfitLambdaArbitrum": false,
    "AaveV3PartialTakeProfitLambdaBase": false,
    "SparkPartialTakeProfitLambdaEthereum": false,
    "AjnaBase": false,
    "AjnaPoolFinder": false,
    "AjnaSafetySwitch": false,
    "AjnaSuppressValidation": false,
    "MorphoSafetySwitch": false,
    "MorphoSuppressValidation": false,
    "AaveV2SafetySwitch": false,
    "AaveV2SuppressValidation": false,
    "AaveV3SafetySwitch": false,
    "AaveV3SuppressValidation": false,
    "AaveV3LambdaSuppressValidation": false,
    "SparkSafetySwitch": false,
    "SparkSuppressValidation": false,
    "AnotherTestFeature": false,
    "BaseNetworkEnabled": false,
    "ConstantMultipleReadOnly": false,
    "DaiSavingsRate": false,
    "DisableSidebarScroll": false,
    "FollowAAVEVaults": false,
    "MorphoBlue": false,
    "NewNavigation": false,
    "ProxyCreationDisabled": false,
    "ProxyReveal": false,
    "ReadOnlyAutoTakeProfit": false,
    "ReadOnlyBasicBS": false,
    "Referrals": false,
    "Sillyness": false,
    "SparkProtocolStopLoss": false,
    "SparkOptimization": false,
    "StopLossOpenFlow": false,
    "StopLossRead": false,
    "StopLossWrite": false,
    "TestFeature": false,
    "UseNetworkSwitcherForks": false,
    "UseNetworkSwitcherTestnets": false,
    "UseRpcGateway": false,
    "NewPortfolio": false,
    "OmniPnlModal": false,
    "MakerTenderly": false,
    "SparkWBTCDAI": false,
    "AaveLikeSimpleEarnSafetySwitch": false,
    "AaveLikeSimpleEarnSuppressValidation": false,
    "EnableMigrations": false,
    "EnableRefinance": false,
    "RefinanceSafetySwitch": false,
    "RefinanceSuppressValidation": false,
    "Erc4626Vaults": false,
    "Erc4626VaultsSafetySwitch": false,
    "Erc4626VaultsSuppressValidation": false,
    "DsProxyMigrationEthereum": false,
    "DsProxyMigrationOptimism": false,
    "DsProxyMigrationArbitrum": false,
    "DsProxyMigrationBase": false,
    "UseOmniKitLinks": false,
    "OmniKitDebug": false,
    "ProductHubDebug": false,
    "LambdaAutomations": {
        "DisableNetValueCheck": false,
        "AaveV3": {
            "autoBuy": false,
            "autoSell": false,
            "partialTakeProfit": false,
            "stopLoss": false,
            "trailingStopLoss": false
        },
        "MorphoBlue": {
            "autoBuy": false,
            "autoSell": false,
            "partialTakeProfit": false,
            "stopLoss": false,
            "trailingStopLoss": false
        }
    },
    "Rays": false
},
    parameters: {},
    navigation: {},
    rpcConfig: {},
} as AppConfigType & {
  error?: string
}