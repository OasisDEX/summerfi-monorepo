import { type IArmadaDcaOrder } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserDcaOrders({ walletAddress }: { walletAddress: string }) {
  try {
    const ordersList = await backendSDK.armada.dca.getBuyOrders({
      userAddress: walletAddress.toLowerCase() as `0x${string}`,
    })

    return ordersList as IArmadaDcaOrder[]
  } catch (error) {
    return serverOnlyErrorHandler('getUserDcaOrders', error as string)
  }
}
