export interface RaysApiResponse {
  address: string
  eligiblePoints: number
  allPossiblePoints: number
  actionRequiredPoints: unknown[]
  positionInLeaderboard: string
  userTypes: ('General Ethereum User' | 'DeFi User' | 'SummerFi User' | 'SummerFi Power User')[]
}

export const fetchRays = async (query: string) => {
  try {
    const rays = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays${query}`, {
      method: 'GET',
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
