'use server'

import { type LeaderboardResponse } from '@summerfi/app-types'

import { REVALIDATION_TIMES } from '@/constants/revalidations'

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
        next: { revalidate: REVALIDATION_TIMES.RAYS_LEADERBOARD, tags: [urlParams] },
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
