/** 1Inch authorization header key */
export const OneInchSpotAuthHeaderKey = 'Authorization'

/** 1Inch authorization header format */
export type OneInchSpotAuthHeader = {
  [OneInchSpotAuthHeaderKey]: string
  'Content-Type'?: string
}

/** 1Inch Oracle provider configuration */
export type OneInchOracleProviderConfig = {
  /** 1Inch API URL */
  apiUrl: string
  /** 1Inch API key */
  apiKey: string
  /** 1Inch API version */
  version: string
}

/** 1Inch spot price response */
export type OneInchSpotResponse = Record<string, number>
