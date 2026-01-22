import { type TvlResponse } from './types'

const PROTOCOL_INFO_URL = 'https://gateway.summer.fi/api/protocol-info'

const fallbackResponse: TvlResponse = {
  protocol: { totalValueLockedUSD: 0, totalVaults: 0 },
  chains: [],
}

const getTvlResponse = async (): Promise<TvlResponse> => {
  try {
    const response = await fetch(PROTOCOL_INFO_URL, { method: 'GET' })

    if (!response.ok) {
      const errorBody = await response.text()

      throw new Error(
        `Protocol info request failed with status ${response.status}: ${response.statusText} - ${errorBody}`,
      )
    }

    return (await response.json()) as TvlResponse
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching TVL response:', error)

    return fallbackResponse
  }
}

export const getTvl = async (): Promise<number> => {
  const data = await getTvlResponse()

  return Number(data.protocol.totalValueLockedUSD)
}
