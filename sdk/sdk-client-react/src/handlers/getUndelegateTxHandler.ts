import type { ISDKManager } from '@summerfi/sdk-client'

export const getUndelegateTx = (sdk: ISDKManager) => async () => {
  return sdk.armada.users.getUndelegateTx()
}
