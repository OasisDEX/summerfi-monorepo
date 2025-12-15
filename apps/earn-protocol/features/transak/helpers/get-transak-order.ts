import { CACHE_TIMES } from '@/constants/revalidation'
import { type TransakOrderData } from '@/features/transak/types'

/**
 * Fetches the Transak order data for a given order ID.
 *
 * @param {Object} params - The parameters for fetching the Transak order.
 * @param {string} params.orderId - The ID of the order to fetch.
 * @returns {Promise<TransakOrderData>} - A promise that resolves to the Transak order data.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export const getTransakOrder = async ({
  orderId,
}: {
  orderId: string
}): Promise<TransakOrderData> => {
  try {
    const response = await fetch(
      `/earn/api/transak/get-order?orderId=${encodeURIComponent(orderId)}`,
      {
        next: {
          revalidate: CACHE_TIMES.ALWAYS_FRESH,
        },
      },
    )

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get transak order data', error)

    throw new Error(`${error}`)
  }
}
