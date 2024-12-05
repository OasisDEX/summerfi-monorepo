import { type LeaderboardItem, type LeaderboardResponse } from '@summerfi/app-types'

/**
 * Fetches the SUMR eligibility for a given user address.
 * We are using the leaderboard endpoint to fetch the user's eligibility, since
 * users with rays are also eligible for SUMR.
 *
 * @param {string} address - The user's wallet address.
 * @returns {Promise<LeaderboardItem[]>} - A promise that resolves to an array of leaderboard entries.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export const getUserSumrEligibility = async (address: string): Promise<LeaderboardItem[]> => {
  try {
    const { leaderboard }: LeaderboardResponse = await fetch(
      `/api/leaderboard?page=1&limit=10&userAddress=${address.toLowerCase()}`,
    ).then((resp) => resp.json())

    return leaderboard
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching user SUMR eligibility:', error)

    throw error
  }
}
