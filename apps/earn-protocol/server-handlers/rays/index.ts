import { type RaysApiResponse } from '@summerfi/app-types'

export const fetchRays = async (query: { [key: string]: string } | string) => {
  try {
    const urlParams = new URLSearchParams(query)

    if (urlParams.get('address') === null) {
      return {
        error: 'No address provided',
      }
    }
    const rays = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays?${urlParams.toString()}`, {
      method: 'GET',
      next: { revalidate: 0 }, // disabling cache as user values doesnt match the leaderboard position
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())) as RaysApiResponse

    return { rays }
  } catch (e) {
    return {
      error: e,
    }
  }
}
