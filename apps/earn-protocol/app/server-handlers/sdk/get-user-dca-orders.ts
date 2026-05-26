import { type ChainId } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserDcaOrders({
  chainId,
  walletAddress,
}: {
  chainId: ChainId
  walletAddress: string
}) {
  try {
    const ordersList = await backendSDK.dca.getStrategies({
      chainId,
      userAddress: walletAddress.toLowerCase() as `0x${string}`,
    })

    return ordersList
  } catch (error) {
    return serverOnlyErrorHandler('getUserDcaOrders', error as string)
  }
}
