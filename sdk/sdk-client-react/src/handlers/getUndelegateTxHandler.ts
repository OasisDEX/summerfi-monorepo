import type { ISDKManager } from '@summerfi/sdk-client'

export const getUndelegateTxHandler = (sdk: ISDKManager) => async () => {
  return sdk.armada.users.getUndelegateTx()
}
