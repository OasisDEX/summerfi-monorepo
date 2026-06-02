import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'

export const getUndelegateTxHandler = (sdk: ISDKManager | ISDKInstiManager) => async () => {
  return sdk.armada.users.getUndelegateTx()
}
