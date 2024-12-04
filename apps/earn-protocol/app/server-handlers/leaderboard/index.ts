'use server'

import { type LeaderboardResponse } from '@summerfi/app-types'

export const fetchRaysLeaderboard = async (
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
        next: { revalidate: 60, tags: [urlParams] },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((resp) => resp.json())) as Partial<LeaderboardResponse>

    return {
      leaderboard: response.leaderboard ?? [],
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching leaderboard:', error)

    return {
      leaderboard: [],
      error,
    }
  }
}
