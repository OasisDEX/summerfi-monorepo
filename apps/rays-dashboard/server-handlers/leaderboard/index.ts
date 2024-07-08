'use server'
import { LeaderboardResponse } from '@/types/leaderboard'

export const fetchLeaderboard = async (
  query:
    | {
        [key: string]: string
      }
    | string,
): Promise<LeaderboardResponse> => {
  try {
    const urlParams = new URLSearchParams(query).toString()
    const response = (await fetch(
      `${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard?${urlParams}`,
      {
        method: 'GET',
        next: { revalidate: 0 }, // disabling cache as user values doesnt match the leaderboard position
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
