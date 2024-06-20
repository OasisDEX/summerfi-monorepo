export interface RaysApiResponse {
  address: string
  eligiblePoints: number
  allPossiblePoints: number
  actionRequiredPoints: unknown[]
  positionInLeaderboard: string
  userTypes: ('General Ethereum User' | 'DeFi User' | 'SummerFi User' | 'SummerFi Power User')[]
}

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
      next: { tags: ['rays-leaderboard', urlParams.toString()], revalidate: 60 },
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
