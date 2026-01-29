import { type IconNamesList, type SupportedNetworkIds } from '@summerfi/app-types'
import { type Transak } from '@transak/transak-sdk'

import { type NetworkNames } from '@/constants/networks-list'

export enum TransakSteps {
  INITIAL = 'INITIAL',
  ABOUT_KYC = 'ABOUT_KYC',
  BUY_ETH = 'BUY_ETH',
  SWITCH_TO_L2 = 'SWITCH_TO_L2',
  EXCHANGE = 'EXCHANGE',
  KYC = 'KYC',
  ORDER = 'ORDER',
}

export enum TransakPaymentOptions {
  CREDIT_DEBIT_CARD = 'credit_debit_card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  GBP_BANK_TRANSFER = 'gbp_bank_transfer',
  PM_OPEN_BANKING = 'pm_open_banking',
  INR_BANK_TRANSFER = 'inr_bank_transfer',
  INR_UPI = 'inr_upi',
  SEPA_BANK_TRANSFER = 'sepa_bank_transfer',
  PM_ASTROPAY = 'pm_astropay',
  PM_GCASH = 'pm_gcash',
  PM_PAYMAYA = 'pm_paymaya',
  PM_BPI = 'pm_bpi',
  PM_UBP = 'pm_ubp',
  PM_GRABPAY = 'pm_grabpay',
  PM_SHOPEEPAY = 'pm_shopeepay',
  PM_PSE = 'pm_pse',
}

export enum TransakAction {
  BUY = 'BUY',
  SELL = 'SELL',
}

export type TransakPriceQuoteResponse = {
  conversionPrice: number
  cryptoAmount: number
  cryptoCurrency: string
  cryptoLiquidityProvider: string
  feeBreakdown: { name: string; value: number; id: 'transak_fee' | 'partner_fee' | 'network_fee' }[]
  feeDecimal: number
  fiatAmount: number
  fiatCurrency: string
  isBuyOrSell: TransakAction
  marketConversionPrice: number
  network: string
  nonce: number
  notes: string[]
  paymentMethod: TransakPaymentOptions
  quoteId: string
  slippage: number
  totalFee: number
}

export type TransakEventOrderData = {
  eventName: typeof Transak.EVENTS
  // there is much more in status object
  status: {
    id: string
    createdAt: string
    isBuyOrSell: TransakAction
    network: string
    status: string
    walletAddress: string
    walletLink: string
    cryptoCurrency: string
    fiatCurrency: string
  }
}

export enum TransakOrderDataStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  PROCESSING = 'PROCESSING',
  PENDING_DELIVERY_FROM_TRANSAK = 'PENDING_DELIVERY_FROM_TRANSAK',
}

// https://docs.transak.com/reference/get-order-by-order-id
export type TransakOrderData = {
  meta: {
    orderId: string
  }
  // there is much more in status object
  data: {
    _id: string
    createdAt: string
    isBuyOrSell: TransakAction
    network: string
    status: TransakOrderDataStatus
    walletAddress: string
    walletLink: string
    cryptoCurrency: string
    cryptoAmount: string
    fiatCurrency: string
    transactionLink: string
  }
}

export type TransakFiatCurrencies = {
  icon: string
  name: string
  symbol: string
  isPopular: boolean
  isAllowed: boolean
  supportingCountries: string[]
  paymentOptions: {
    id: TransakPaymentOptions
    name: string
    icon: string
    minAmount: number
    maxAmount: number
    processingTime: string
    isActive: boolean
  }[]
}[]

export type TransakReducerState = {
  step: TransakSteps
  fiatAmount: string
  fiatCurrency: string
  paymentMethod: TransakPaymentOptions
  isBuyOrSell: TransakAction
  exchangeDetails: TransakPriceQuoteResponse | undefined
  eventOrderData: TransakEventOrderData | undefined
  orderData: TransakOrderData | undefined
  ipCountryCode: string | undefined
  cryptoCurrency: string
  fiatCurrencies: TransakFiatCurrencies | undefined
  error: string
}

export interface TransakRefreshTokenResponse {
  data: {
    accessToken: string
    expiresAt: number
  }
}

export interface TransakCreateWidgetUrlResponse {
  data: {
    widgetUrl: string
  }
}

export interface TransakIpCountryCodeResponse {
  ipCountryCode: string
}

// https://docs.transak.com/reference/get-fiat-currencies
// there is much more
export interface TransakFiatCurrenciesResponse {
  response: TransakFiatCurrencies
}

export type TransakReducerAction =
  | {
      type: 'update-ip-country-code'
      payload: string | undefined
    }
  | {
      type: 'update-fiat-currencies'
      payload: TransakFiatCurrencies | undefined
    }
  | {
      type: 'update-step'
      payload: TransakSteps
    }
  | {
      type: 'update-fiat-currency'
      payload: string
    }
  | {
      type: 'update-crypto-currency'
      payload: string
    }
  | {
      type: 'update-fiat-amount'
      payload: string
    }
  | {
      type: 'update-payment-method'
      payload: TransakPaymentOptions
    }
  | {
      type: 'update-exchange-details'
      payload: TransakPriceQuoteResponse | undefined
    }
  | {
      type: 'update-event-order-data'
      payload: TransakEventOrderData | undefined
    }
  | {
      type: 'update-order-data'
      payload: TransakOrderData | undefined
    }
  | {
      type: 'update-error'
      payload: string
    }

export type TransakSupportedNetworksNames =
  | NetworkNames.ethereumMainnet
  | NetworkNames.baseMainnet
  | NetworkNames.arbitrumMainnet

export interface TransakNetworkOption {
  label: string
  value: string
  iconName: IconNamesList
  chainId: SupportedNetworkIds
}
