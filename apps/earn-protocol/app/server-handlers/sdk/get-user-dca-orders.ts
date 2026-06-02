import { parseJsonSafelyWithBigInt } from '@summerfi/app-utils'
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
    const strategies = await backendSDK.dca.getStrategies({
      chainId,
      userAddress: walletAddress.toLowerCase() as `0x${string}`,
    })

    // The SDK returns raw uint256 strategy fields as BigInt. This result is cached via Next's
    // unstable_cache, which serialises with JSON.stringify and throws on BigInt — so convert the
    // BigInt fields to strings here. Portfolio consumers read these via String()/Number(), so the
    // runtime shape stays compatible with IDcaStrategy and the declared type is preserved.
    return parseJsonSafelyWithBigInt(strategies) as unknown as typeof strategies
  } catch (error) {
    return serverOnlyErrorHandler('getUserDcaOrders', error as string)
  }
}
