import { type TransakOrderData } from '@/features/transak/types'

export const getTransakOrder = async ({
  orderId,
}: {
  orderId: string
}): Promise<TransakOrderData> => {
  try {
    const response = await fetch(`/api/transak/get-order?orderId=${orderId}`)

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get transak order data', error)

    throw new Error(`${error}`)
  }
}
