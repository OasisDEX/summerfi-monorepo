import { type ChainId, type IArmadaDcaOrder } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserDcaOrder({ chainId, orderId }: { chainId: ChainId; orderId: string }) {
  try {
    const order = await backendSDK.dca.getStrategy({
      chainId,
      strategyId: orderId,
    })

    return order as IArmadaDcaOrder | undefined
  } catch (error) {
    return serverOnlyErrorHandler('getUserDcaOrder', error as string)
  }
}
