export const OneInchAuthHeaderKey = 'auth-key'

export type OneInchAuthHeader = {
  [OneInchAuthHeaderKey]: string
}

export type OneInchSwapProviderConfig = {
  apiUrl: string
  version: string
  apiKey: string
  allowedSwapProtocols: string[]
}

export interface OneInchBaseResponse {
  fromTokenAmount: string
  toTokenAmount: string
}

export interface OneInchSwapResponse extends OneInchBaseResponse {
  protocols: unknown
  tx: {
    from: string
    to: string
    data: string
    value: string
    gasPrice: string
  }
}

export interface OneInchQuoteResponse extends OneInchBaseResponse {
  protocols: unknown
  fromTokenAmount: string
  toTokenAmount: string
  estimatedGas: string
}
