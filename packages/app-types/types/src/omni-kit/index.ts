import { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import { ChainId, ProtocolId } from '@summerfi/serverless-shared'
import { AutomationFeatures } from '../automation'

const omniSupportedNetworkIds = [
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.MAINNET,
  ChainId.OPTIMISM,
] as const

export type OmniSupportedNetworkIds = (typeof omniSupportedNetworkIds)[number]

const omniSupportedProtocols = [
  ProtocolId.AJNA,
  ProtocolId.MORPHO_BLUE,
  ProtocolId.AAVE_V2,
  ProtocolId.AAVE_V3,
  ProtocolId.AAVE3,
  ProtocolId.SPARK,
] as const

export type NetworkIdsWithValues<T> = {
  [key in OmniSupportedNetworkIds]?: T
}

export type OmniSupportedProtocols = (typeof omniSupportedProtocols)[number]

export type OmniGenericPosition = unknown

export enum OmniProductType {
  Borrow = 'borrow',
  Multiply = 'multiply',
  Earn = 'earn',
}

export type OmniProductBorrowishType = OmniProductType.Borrow | OmniProductType.Multiply

export enum OmniSidebarStep {
  Dpm = 'dpm',
  Manage = 'manage',
  Risk = 'risk',
  Setup = 'setup',
  Transaction = 'transaction',
  Transition = 'transition',
}

export enum OmniSidebarAutomationStep {
  Manage = 'manage',
  Transaction = 'transaction',
}

export type OmniSidebarEditingStep = Extract<
  OmniSidebarStep,
  OmniSidebarStep.Setup | OmniSidebarStep.Manage
>

export type OmniSidebarAutomationEditingStep = Extract<
  OmniSidebarAutomationStep,
  OmniSidebarAutomationStep.Manage
>

export type OmniSidebarStepsSet = {
  [ProductKey in OmniProductType]: {
    setup: OmniSidebarStep[]
    manage: OmniSidebarStep[]
  }
}

export interface OmniProtocolSettings {
  entryTokens?: NetworkIdsWithValues<{ [pair: string]: string }>
  pullTokens?: NetworkIdsWithValues<string[]>
  rawName: NetworkIdsWithValues<string>
  returnTokens?: NetworkIdsWithValues<string[]>
  steps: OmniSidebarStepsSet
  supportedMainnetNetworkIds: OmniSupportedNetworkIds[]
  supportedMultiplyTokens: NetworkIdsWithValues<string[]>
  supportedSDKNetworkIds: OmniSupportedNetworkIds[]
  supportedProducts: OmniProductType[]
  availableAutomations: NetworkIdsWithValues<AutomationFeatures[]>
  markets?: NetworkIdsWithValues<{ [key: string]: string[] }>
}

export type OmniProtocolsSettings = {
  [key in OmniSupportedProtocols]: OmniProtocolSettings
}

export interface OmniTokensPrecision {
  collateralDigits: number
  collateralPrecision: number
  quoteDigits: number
  quotePrecision: number
}

export interface OmniProtocolHookProps {
  collateralToken: string
  dpmPositionData?: unknown
  label?: string
  networkId: OmniSupportedNetworkIds
  pairId: number
  product?: OmniProductType
  protocol: OmniSupportedProtocols
  quoteToken: string
  tokenPriceUSDData?: unknown
  tokensPrecision?: OmniTokensPrecision
}

export type OmniCloseTo = 'collateral' | 'quote'

export enum OmniSidebarBorrowPanel {
  Adjust = 'adjust',
  Close = 'close',
  Collateral = 'collateral',
  Quote = 'quote',
  Switch = 'switch',
}

export enum OmniSidebarEarnPanel {
  Adjust = 'adjust',
  ClaimCollateral = 'claimCollateral',
  Liquidity = 'liquidity',
}

export enum OmniMultiplyPanel {
  Adjust = 'adjust',
  Close = 'close',
  Collateral = 'collateral',
  Quote = 'quote',
  Switch = 'switch',
}

export enum OmniBorrowFormAction {
  AdjustBorrow = 'adjustBorrow',
  CloseBorrow = 'closeBorrow',
  DepositBorrow = 'depositBorrow',
  GenerateBorrow = 'generateBorrow',
  OpenBorrow = 'openBorrow',
  PaybackBorrow = 'paybackBorrow',
  SwitchBorrow = 'switchBorrow',
  WithdrawBorrow = 'withdrawBorrow',
}

export enum OmniEarnFormAction {
  OpenEarn = 'openEarn',
  DepositEarn = 'depositEarn',
  WithdrawEarn = 'withdrawEarn',
  ClaimEarn = 'claimEarn',
}

export enum OmniMultiplyFormAction {
  OpenMultiply = 'openMultiply',
  AdjustMultiply = 'adjustMultiply',
  DepositCollateralMultiply = 'depositCollateralMultiply',
  DepositQuoteMultiply = 'depositQuoteMultiply',
  GenerateMultiply = 'denerateMultiply',
  PaybackMultiply = 'paybackMultiply',
  WithdrawMultiply = 'withdrawMultiply',
  SwitchMultiply = 'switchMultiply',
  CloseMultiply = 'closeMultiply',
}

export type OmniFormAction = OmniBorrowFormAction | OmniEarnFormAction | OmniMultiplyFormAction
export type OmniFormState = unknown
export interface OmniProductPage {
  collateralToken: string
  label?: string
  networkId: OmniSupportedNetworkIds
  pairId: number
  positionId?: string
  productType: OmniProductType
  protocol: OmniSupportedProtocols
  quoteToken: string
  version?: string
}

export interface OmniValidationItem {
  message: {
    translationKey?: string
    component?: React.JSX.Element
    params?: { [key: string]: string }
  }
}

export type OmniValidations = {
  errors: OmniValidationItem[]
  hasErrors: boolean
  isFormFrozen: boolean
  isFormValid: boolean
  notices: OmniValidationItem[]
  successes: OmniValidationItem[]
  warnings: OmniValidationItem[]
}

export type OmniPartialValidations = {
  localErrors: OmniValidationItem[]
  localWarnings: OmniValidationItem[]
}

export interface GetOmniValidationResolverParams {
  customErrors?: OmniValidationItem[]
  customNotices?: OmniValidationItem[]
  customSuccesses?: OmniValidationItem[]
  customWarnings?: OmniValidationItem[]
  earnIsFormValid?: boolean
  isFormFrozen: boolean
  protocolLabel: unknown
  safetySwitchOn: boolean
}

export interface OmniSimulationCommon {
  errors: { name: string; data?: { [key: string]: string } }[]
  notices: { name: string; data?: { [key: string]: string } }[]
  successes: { name: string; data?: { [key: string]: string } }[]
  warnings: { name: string; data?: { [key: string]: string } }[]
  getValidations: (params: GetOmniValidationResolverParams) => OmniValidations
}

export type OmniSimulationSwap = unknown

export interface OmniFormDefaults {
  borrow: unknown
  earn: unknown
  multiply: unknown
}

export interface OmniFlowStateFilterParams {
  collateralAddress: string
  event: unknown
  filterConsumed?: boolean
  pairId: number
  productType: OmniProductType
  protocol: ProtocolId
  protocolRaw?: string
  quoteAddress: string
}

type SimulationValidations = { name: string; data?: { [key: string]: string } }[]

export interface GetOmniValidationsParams {
  collateralBalance: unknown
  collateralToken: string
  currentStep: OmniSidebarStep
  customErrors?: OmniValidationItem[]
  customWarnings?: OmniValidationItem[]
  ethBalance: unknown
  ethPrice: unknown
  gasEstimationUsd?: unknown
  isOpening: boolean
  poolId?: string
  position: OmniGenericPosition
  positionTriggers: unknown
  productType: OmniProductType
  protocol: ProtocolId
  quoteBalance: unknown
  quoteToken: string
  simulation?: OmniGenericPosition
  simulationErrors?: SimulationValidations
  simulationNotices?: SimulationValidations
  simulationSuccesses?: SimulationValidations
  simulationWarnings?: SimulationValidations
  state: OmniFormState
  txError?: unknown
}

export type OmniNotificationCallbackWithParams<P> = (params: P) => unknown

export type OmniEntryToken = {
  address: string
  balance: unknown
  digits: number
  icon: string
  precision: number
  price: unknown
  symbol: string
}

export interface OmniSwapToken {
  address: string
  balance: unknown
  digits: number
  precision: number
  price: unknown
  token: string
}

export interface OmniExtraTokenData {
  [key: string]: {
    balance: unknown
    price: unknown
  }
}

interface OmniFeatureToggles {
  safetySwitch: boolean
  suppressValidation: boolean
}

export interface OmniFiltersParameters {
  event: unknown
  filterConsumed?: boolean
}

interface OmniFilters {
  omniProxyFilter: ({ event, filterConsumed }: OmniFiltersParameters) => Promise<boolean>
}

interface CommonMetadata {
  featureToggles: OmniFeatureToggles
  filters: OmniFilters
  notifications: unknown[]
  validations: OmniValidations
}

export interface OmniLendingMetadataHandlers {}

export interface OmniSupplyMetadataHandlers {
  txSuccessEarnHandler?: () => void
  customReset?: () => void
}

export interface ProductContextAutomationForms {
  stopLoss: unknown
  trailingStopLoss: unknown
  autoSell: unknown
  autoBuy: unknown
  partialTakeProfit: unknown
  autoTakeProfit: unknown
  constantMultiple: unknown
}

export type ProductContextAutomationForm =
  ProductContextAutomationForms[keyof ProductContextAutomationForms]

export type OmniAutomationSimulationResponse = unknown

export type AutomationMetadataValuesSimulation = unknown

export interface AutomationMetadataValues {
  flags: {
    isStopLossEnabled: boolean
    isTrailingStopLossEnabled: boolean
    isAutoSellEnabled: boolean
    isAutoBuyEnabled: boolean
    isPartialTakeProfitEnabled: boolean
  }
  triggers: {
    [AutomationFeatures.STOP_LOSS]?: unknown
    [AutomationFeatures.TRAILING_STOP_LOSS]?: unknown
    [AutomationFeatures.AUTO_SELL]?: unknown
    [AutomationFeatures.AUTO_BUY]?: unknown
    [AutomationFeatures.PARTIAL_TAKE_PROFIT]?: unknown
    [AutomationFeatures.CONSTANT_MULTIPLE]?: unknown
    [AutomationFeatures.AUTO_TAKE_PROFIT]?: unknown
  }
  resolved: {
    activeUiDropdown: AutomationFeatures
    activeForm: ProductContextAutomationForm
    isProtection: boolean
    isOptimization: boolean
    isFormEmpty: boolean
  }
  simulation: AutomationMetadataValuesSimulation
}

interface CommonMetadataValues {
  footerColumns: number
  headline?: string
  headlineDetails?: unknown[]
  isHeadlineDetailsLoading?: boolean
  interestRate: unknown
  isFormEmpty: boolean
  sidebarTitle?: string
  automation?: AutomationMetadataValues
}
interface CommonMetadataElements {
  faq: ReactNode
  overviewBanner?: ReactNode
  positionBanner?: ReactNode
  overviewContent: ReactNode
  overviewFooter: ReactNode
  overviewWithSimulation?: boolean
  sidebarContent?: ReactNode
  riskSidebar?: ReactNode
}

export type ShouldShowDynamicLtvMetadata = (params: { includeCache: boolean }) => boolean

export type LendingMetadata = CommonMetadata & {
  handlers?: OmniLendingMetadataHandlers
  values: CommonMetadataValues & {
    afterAvailableToBorrow: unknown | undefined
    afterBuyingPower: unknown | undefined
    afterPositionDebt: unknown | undefined
    changeVariant: 'positive' | 'negative'
    withdrawMax: unknown
    debtMax: unknown
    debtMin: unknown
    paybackMax: unknown
    shouldShowDynamicLtv: ShouldShowDynamicLtvMetadata
    maxSliderAsMaxLtv?: boolean
  }
  elements: CommonMetadataElements & {
    highlighterOrderInformation?: ReactNode
  }
  theme?: unknown
}

export type SupplyMetadata = CommonMetadata & {
  handlers: OmniSupplyMetadataHandlers
  values: CommonMetadataValues & {
    earnAfterWithdrawMax?: unknown
    earnWithdrawMax: unknown
    extraDropdownItems?: unknown[]
    withAdjust?: boolean
  }
  elements: CommonMetadataElements & {
    earnExtraUiDropdownContent?: ReactNode
    earnFormOrder: ReactNode
    earnFormOrderAsElement: FC
    extraEarnInput?: ReactNode
    extraEarnInputDeposit?: ReactNode
    extraEarnInputWithdraw?: ReactNode
  }
  theme?: unknown
}

export interface OmniPositionSet<Position> {
  position: Position
  simulation?: Position
}

export interface OmniValidationMessage {
  name: string
  data?: { [key: string]: string | number }
}

export type OmniSimulationData = unknown & {
  errors: OmniValidationMessage[]
  warnings: OmniValidationMessage[]
  notices: OmniValidationMessage[]
  successes: OmniValidationMessage[]
}

interface ProductContextPosition<Position, Auction> {
  cachedPosition?: OmniPositionSet<Position>
  currentPosition: OmniPositionSet<Position>
  swap?: {
    current?: OmniSimulationSwap
    cached?: OmniSimulationSwap
  }
  isSimulationLoading?: boolean
  openFlowResolvedDpmId?: string
  setCachedPosition: (positionSet: OmniPositionSet<OmniGenericPosition>) => void
  setIsLoadingSimulation: Dispatch<SetStateAction<boolean>>
  setSimulation: Dispatch<SetStateAction<undefined>>
  setCachedSwap: (swap: OmniSimulationSwap) => void
  positionAuction: Auction
  history: unknown[]
  simulationCommon: OmniSimulationCommon
}

export interface ProductContextAutomation {
  positionTriggers: unknown
  automationForms: ProductContextAutomationForms
  commonForm: unknown
  simulationData?: OmniAutomationSimulationResponse
  isSimulationLoading?: boolean
  setIsLoadingSimulation: Dispatch<SetStateAction<boolean>>
  setSimulation: Dispatch<SetStateAction<OmniAutomationSimulationResponse | undefined>>
  cachedOrderInfoItems?: unknown[]
  setCachedOrderInfoItems: Dispatch<SetStateAction<unknown[] | undefined>>
}

export interface GenericProductContext<Position, Form, Auction, Metadata> {
  form: Form
  position: ProductContextPosition<Position, Auction>
  dynamicMetadata: Metadata
  automation: ProductContextAutomation
}

export type ProductContextWithBorrow = GenericProductContext<
  unknown,
  unknown,
  unknown,
  LendingMetadata
>

export type ProductContextWithEarn = GenericProductContext<
  unknown,
  unknown,
  unknown,
  SupplyMetadata
>

export type ProductContextWithMultiply = GenericProductContext<
  unknown,
  unknown,
  unknown,
  LendingMetadata
>

export type OmniMetadataParams =
  | Omit<ProductContextWithBorrow, 'dynamicMetadata'>
  | Omit<ProductContextWithEarn, 'dynamicMetadata'>
  | Omit<ProductContextWithMultiply, 'dynamicMetadata'>

export type GetOmniMetadata = (_: OmniMetadataParams) => LendingMetadata | SupplyMetadata

export interface WithAutomation {
  automationFormReducto: unknown
  automationFormDefaults: unknown
  positionTriggers: unknown
}

export interface ProductContextProviderPropsWithBorrow extends WithAutomation {
  formDefaults: unknown
  formReducto: unknown
  getDynamicMetadata: GetOmniMetadata
  position: unknown
  positionAuction: unknown
  positionHistory: unknown[]
  productType: OmniProductType.Borrow
}

export interface ProductContextProviderPropsWithEarn extends WithAutomation {
  formDefaults: unknown
  formReducto: unknown
  getDynamicMetadata: GetOmniMetadata
  position: unknown
  positionAuction: unknown
  positionHistory: unknown[]
  productType: OmniProductType.Earn
}

export interface ProductContextProviderPropsWithMultiply extends WithAutomation {
  formDefaults: unknown
  formReducto: unknown
  getDynamicMetadata: GetOmniMetadata
  position: unknown
  positionAuction: unknown
  positionHistory: unknown[]
  productType: OmniProductType.Multiply
}

export type ProductDetailsContextProviderProps =
  | ProductContextProviderPropsWithBorrow
  | ProductContextProviderPropsWithEarn
  | ProductContextProviderPropsWithMultiply
