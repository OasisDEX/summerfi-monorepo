export enum EarnProtocolEventNames {
  // Page & Session
  PageViewed = 'EP_PageViewed',
  Scrolled = 'EP_Scrolled',

  // Wallet / Account
  WalletConnected = 'EP_WalletConnected',
  AccountChanged = 'EP_AccountChanged',
  WalletDisconnected = 'EP_WalletDisconnected',

  // Position Management
  ViewPosition = 'EP_ViewPosition',
  TransactionSimulated = 'EP_TransactionSimulated',
  TransactionSubmitted = 'EP_TransactionSubmitted',
  TransactionConfirmed = 'EP_TransactionConfirmed',
  TransactionSuccess = 'EP_TransactionSuccess',
  TransactionFailure = 'EP_TransactionFailure',

  // General UI Interactions
  ButtonClicked = 'EP_ButtonClicked',
  InputChanged = 'EP_InputChanged',
  DropdownChanged = 'EP_DropdownChanged',
  TooltipHovered = 'EP_TooltipHovered',

  // Global error handling
  ErrorOccurred = 'EP_ErrorOccurred',

  // Custom events
  CustomEvent = 'EP_CustomEvent', // for special cases (e.g. game events)
}

// ---- Base ----
export interface EarnProtocolBaseEventProps {
  walletAddress?: string // connected wallet address
  network?: string // blockchain network (e.g. "Ethereum", "Polygon")
  page: string // page route/path (e.g. "/earn", "/portfolio")
  connectionMethod?: string // connection method (e.g. "EOA", "SCA")
  errorId?: string // optional error message
  errorMessage?: string // optional error message
  // UTM / Campaign info (if available)
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utm_id?: string
  utm_campaign_id?: string
  utm_source_platform?: string
  utm_creative_format?: string
  utm_marketing_tactic?: string
}

// ---- Specific Event Props ----

// Scrolled
export interface EarnProtocolScrolledEventProps extends EarnProtocolBaseEventProps {
  scrollDepthPercent: number // 0–100
  scrollDepthPixels: number // raw px value
  viewportHeight: number
  documentHeight: number
}

// ViewPosition
export interface EarnProtocolViewPositionEventProps extends EarnProtocolBaseEventProps {
  positionId: string
  isOwner: boolean // viewer is the owner of this position
}

// Transaction* (Simulated, Submitted, Confirmed, Success, Failure)
export interface EarnProtocolTransactionEventProps extends EarnProtocolBaseEventProps {
  transactionType: 'deposit' | 'withdraw' | 'vault-switch' | 'other'
  vaultSlug?: string // vault info
  txAmount?: string // optional amount + token (e.g. "1000 USDC")
  result?: 'success' | 'failure'
  txHash?: string // only available after submit
  errorMessage?: string // optional if failed
}

// ButtonClicked
export interface EarnProtocolButtonClickedEventProps extends EarnProtocolBaseEventProps {
  buttonName: string
}

// InputChanged
export interface EarnProtocolInputChangedEventProps extends EarnProtocolBaseEventProps {
  inputName: string
  value: string | number | boolean
}

// DropdownChanged
export interface EarnProtocolDropdownChangedEventProps extends EarnProtocolBaseEventProps {
  dropdownName: string
  value: string | number
}

// TooltipHovered
export interface EarnProtocolTooltipHoveredEventProps extends EarnProtocolBaseEventProps {
  tooltipName: string
}

// Custom event (eg. for the game)
export interface EarnProtocolCustomEventProps extends EarnProtocolBaseEventProps {
  [key: string]: string | number | string[] | number[] | undefined
}

// ---- Mapping ----
export type EarnProtocolEventPropsMap = {
  [EarnProtocolEventNames.PageViewed]: EarnProtocolBaseEventProps
  [EarnProtocolEventNames.Scrolled]: EarnProtocolScrolledEventProps
  [EarnProtocolEventNames.WalletConnected]: EarnProtocolBaseEventProps
  [EarnProtocolEventNames.AccountChanged]: EarnProtocolBaseEventProps
  [EarnProtocolEventNames.WalletDisconnected]: EarnProtocolBaseEventProps
  [EarnProtocolEventNames.ViewPosition]: EarnProtocolViewPositionEventProps
  [EarnProtocolEventNames.TransactionSimulated]: EarnProtocolTransactionEventProps
  [EarnProtocolEventNames.TransactionSubmitted]: EarnProtocolTransactionEventProps
  [EarnProtocolEventNames.TransactionConfirmed]: EarnProtocolTransactionEventProps
  [EarnProtocolEventNames.TransactionSuccess]: EarnProtocolTransactionEventProps
  [EarnProtocolEventNames.TransactionFailure]: EarnProtocolTransactionEventProps
  [EarnProtocolEventNames.ButtonClicked]: EarnProtocolButtonClickedEventProps
  [EarnProtocolEventNames.InputChanged]: EarnProtocolInputChangedEventProps
  [EarnProtocolEventNames.DropdownChanged]: EarnProtocolDropdownChangedEventProps
  [EarnProtocolEventNames.TooltipHovered]: EarnProtocolTooltipHoveredEventProps
  [EarnProtocolEventNames.ErrorOccurred]: EarnProtocolBaseEventProps
  [EarnProtocolEventNames.CustomEvent]: EarnProtocolCustomEventProps
}

// ---- Generic Analytics Event ----
export type EarnProtocolAnalyticsEvent<E extends EarnProtocolEventNames = EarnProtocolEventNames> =
  {
    event: E
    props: EarnProtocolEventPropsMap[E]
  }
