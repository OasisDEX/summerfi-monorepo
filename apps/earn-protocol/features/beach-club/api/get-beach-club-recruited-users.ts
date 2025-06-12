import { type BeachClubRecruitedUsersPagination } from '@/features/beach-club/types'

/**
 * Fetches the beach club recruited users data from the API with optional filters.
 *
 * @param {Object} params - Query parameters for fetching activity data.
 * @param {number} params.page - The page number for pagination.
 * @param {number} [params.limit=50] - The number of records per page (default: 50).
 * @param {string} [params.orderBy] - Optional sorting order (`asc` or `desc`), converted to lowercase.
 * @param {string} params.referralCode - Referral code to filter activity for a specific user.
 *
 * @returns {Promise<BeachClubRecruitedUsersPagination>} A promise resolving to the API response in JSON format.
 */
export const getBeachClubRecruitedUsers = async ({
  page,
  limit = 50,
  orderBy,
  referralCode,
}: {
  page: number
  limit?: number
  orderBy?: string
  referralCode: string
}): Promise<BeachClubRecruitedUsersPagination> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    referralCode,
    ...(orderBy && { orderBy: orderBy.toLowerCase() }),
  })

  const response = await fetch(`/earn/api/beach-club/recruited-users?${query.toString()}`)

  return response.json()
}
