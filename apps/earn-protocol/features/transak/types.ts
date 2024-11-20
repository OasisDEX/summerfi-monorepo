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

export type TransakPriceQuoteResponse = {
  conversionPrice: number
  cryptoAmount: number
  cryptoCurrency: string
  cryptoLiquidityProvider: string
  feeBreakdown: { name: string; value: number; id: 'transak_fee' | 'partner_fee' | 'network_fee' }[]
  feeDecimal: number
  fiatAmount: number
  fiatCurrency: string
  isBuyOrSell: 'BUY' | 'SELL'
  marketConversionPrice: number
  network: string
  nonce: number
  notes: string[]
  paymentMethod: TransakPaymentOptions
  quoteId: string
  slippage: number
  totalFee: number
}

export type TransakReducerState = {
  step: TransakSteps
  fiatAmount: string
  fiatCurrency: string
  paymentMethod: TransakPaymentOptions
  isBuyOrSell: 'BUY' | 'SELL'
  exchangeDetails: TransakPriceQuoteResponse | undefined
  cryptoCurrency: string
  error: string
}

export type TransakReducerAction =
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
      type: 'update-error'
      payload: string
    }
