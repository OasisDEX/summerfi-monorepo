import { type IArmadaDcaOrder } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserDcaOrder({
  walletAddress,
  orderId,
}: {
  walletAddress: string
  orderId: string
}) {
  try {
    const order = await backendSDK.armada.dca.getBuyOrder({
      orderId,
      userAddress: walletAddress.toLowerCase() as `0x${string}`,
    })

    return order as IArmadaDcaOrder | undefined
  } catch (error) {
    return serverOnlyErrorHandler('getUserDcaOrder', error as string)
  }
}
