import type { TransakRefreshTokenResponse } from '@/features/transak/types'

export const getTransakOrder = async ({
  orderId,
}: {
  orderId: string
}): Promise<TransakRefreshTokenResponse | undefined> => {
  try {
    const response = await fetch(`/api/transak/get-order?orderID=${orderId}`)

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get transak order data', error)

    return undefined
  }
}
