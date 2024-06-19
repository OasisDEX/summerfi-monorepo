import { LeaderboardResponse } from '@/types/leaderboard'

export const fetchLeaderboard = async (
  query:
    | {
        [key: string]: string | number
      }
    | string,
): Promise<LeaderboardResponse> => {
  try {
    const urlParams = new URLSearchParams(query).toString()
    const response = (await fetch(
      `${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard?${urlParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((resp) => resp.json())) as LeaderboardResponse

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
