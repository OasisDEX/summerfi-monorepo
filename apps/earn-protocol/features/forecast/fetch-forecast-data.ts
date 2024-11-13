/* eslint-disable camelcase */
type FetchForecastDataParams = {
  fleetAddress: `0x${string}`
  amount: number
  chainId: number
}

export const fetchForecastData = async ({
  fleetAddress,
  amount,
  chainId,
}: FetchForecastDataParams) => {
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
