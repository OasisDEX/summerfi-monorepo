import { type Transak } from '@transak/transak-sdk'

export enum TransakSteps {
  INITIAL = 'INITIAL',
  ABOUT_KYC = 'ABOUT_KYC',
  EXCHANGE = 'EXCHANGE',
  KYC = 'KYC',
}

export enum TransakPaymentOptions {
  CREDIT_DEBIT_CARD = 'credit_debit_card',
  GBP_BANK_TRANSFER = 'gbp_bank_transfer',
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

// https://docs.transak.com/reference/get-order-by-order-id
export type TransakOrderData = {
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

export type TransakReducerState = {
  accessToken: string | undefined
  step: TransakSteps
  fiatAmount: string
  fiatCurrency: string
  paymentMethod: TransakPaymentOptions
  isBuyOrSell: TransakAction
  exchangeDetails: TransakPriceQuoteResponse | undefined
  orderData: TransakOrderData | undefined
  cryptoCurrency: string
  error: string
}

export type TransakReducerAction =
  | {
      type: 'update-access-token'
      payload: string | undefined
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
      type: 'update-order-data'
      payload: TransakOrderData | undefined
    }
  | {
      type: 'update-error'
      payload: string
    }

export interface TransakRefreshTokenResponse {
  data: {
    accessToken: string
    expiresAt: number
  }
}
