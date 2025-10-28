export const OneInchAuthHeaderKey = 'Authorization'
export const OneInchSpotAuthHeaderKey = 'Authorization'

export type OneInchAuthHeader = {
  [OneInchAuthHeaderKey]: string
}

export type OneInchSwapProviderConfig = {
  apiUrl: string
  apiKey: string
  version: string
  allowedSwapProtocols: string[]
  excludedSwapProtocols: string[]
}

export interface OneInchBaseResponse {
  fromTokenAmount: string
  toTokenAmount: string
  dstAmount: string
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
  fromTokenAmount: string
  toTokenAmount: string
  /* One Inch can provide multiple routes */
  protocols?: OneInchSwapRoute[]
  gas?: number
}

export type OneInchSwapRoute = OneInchSwapHop[]

type OneInchSwapHop = OneInchSwapHopPart[]

type OneInchSwapHopPart = {
  name: string
  part: number
  fromTokenAddress: string
  toTokenAddress: string
}
