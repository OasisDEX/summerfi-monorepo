import { LeaderboardResponse } from '@/types/leaderboard'

export const fetchLeaderboard = async (query: string): Promise<LeaderboardResponse> => {
  try {
    const response = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())) as LeaderboardResponse

    return {
      leaderboard: response.leaderboard ?? [],
    }
  } catch (error) {
    return {
      leaderboard: [],
      error,
    }
  }
}
