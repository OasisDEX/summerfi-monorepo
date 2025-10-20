import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'

export const getUndelegateTxHandler = (sdk: ISDKManager | ISDKAdminManager) => async () => {
  return sdk.armada.users.getUndelegateTx()
}
