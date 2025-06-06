import { type ISDKManager } from '@summer_fi/sdk-client'
import type { IUser } from '@summer_fi/sdk-client'

export const getUserPositionsHandler = (sdk: ISDKManager) => async (params: { user: IUser }) => {
  const positions = await sdk.armada.users.getUserPositions(params)
  return positions
}
