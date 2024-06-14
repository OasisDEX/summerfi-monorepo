import { Leaderboard } from '@summerfi/rays-db'

// TODO Leaderboard type from rays-db after we will merge everything will have details and ens defined,
// so no type extension as below will be needed
type LeaderboardApiResponse = {
  leaderboard?: (Leaderboard & {
    details: { activePositions: number; activeTriggers: number } | null
    ens: string | null
  })[]
}

export const fetchLeaderboard = async (query: string) => {
  try {
    const response = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())) as LeaderboardApiResponse

    return {
      leaderboard: response.leaderboard ?? [],
    }
  } catch (e) {
    return {
      leaderboard: [],
      error: e,
    }
  }
}
