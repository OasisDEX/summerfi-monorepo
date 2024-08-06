import { type RiskDataResponse } from '@/types'

/**
 * Fetch the risk data for a given address using the TRM Labs API.
 *
 * @param address - The address to be screened for risk.
 * @param apiKey - The API key for accessing the TRM Labs API.
 * @returns A promise that resolves to a RiskDataResponse object containing the risk data.
 *
 * @remarks
 * This function sends a POST request to the TRM Labs API to screen the provided address for risk indicators.
 * The address is screened on the Ethereum chain, and the request includes an external account ID for identification.
 * If the API response is not successful, the function throws an error with the status code and status text.
 * The function returns the risk data for the address extracted from the API response.
 */
export const getTrmRisk = async ({
  address,
  apiKey,
}: {
  address: string
  apiKey: string
}): Promise<RiskDataResponse> => {
  return fetch('https://api.trmlabs.com/public/v2/screening/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${apiKey}`,
    },
    body: JSON.stringify([
      {
        address,
        chain: 'ethereum',
        accountExternalId: 'oazo',
      },
    ]),
  })
    .then((resp) => {
      if (!resp.ok) {
        throw Error(`Risk service status code ${resp.status} ${resp.statusText}`)
      }

      return resp.json()
    })
    .then((data) => {
      return data[0]
    })
}
