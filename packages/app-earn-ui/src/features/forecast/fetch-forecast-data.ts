/* eslint-disable camelcase */
type FetchForecastDataParams = {
  fleetAddress: `0x${string}`
  amount: number
  chainId: number
}

/**
 * Fetches forecast data from the forecast API.
 *
 * @param {Object} params - The parameters for fetching forecast data.
 * @param {string} params.fleetAddress - The address of the fleet commander.
 * @param {number} params.amount - The position size.
 * @param {number} params.chainId - The chain ID.
 * @returns {Promise<Response>} The response from the forecast API.
 * @throws {Error} If the FORECAST_API_URL is not defined or there is an error fetching the data.
 */
export const fetchForecastData = async ({
  fleetAddress,
  amount,
  chainId,
}: FetchForecastDataParams): Promise<Response> => {
  // this should be only used server side, so no need for `NEXT_PUBLIC_`
  const forecastApiUrl = process.env.FORECAST_API_URL

  if (!forecastApiUrl) {
    throw new Error('FORECAST_API_URL is not defined')
  }

  try {
    return await fetch(forecastApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fleet_commander_address: fleetAddress,
        position_size: amount,
        chain_id: chainId,
      }),
    })
  } catch (error) {
    throw new Error('Error fetching forecast data')
  }
}
