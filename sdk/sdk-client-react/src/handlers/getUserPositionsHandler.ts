import { type ISDKManager } from '@summerfi/sdk-client'
import type { IUser } from '@summerfi/sdk-common'

export const getUserPositionsHandler = (sdk: ISDKManager) => async (params: { user: IUser }) => {
  const positions = await sdk.armada.users.getUserPositions(params)
  return positions
}
