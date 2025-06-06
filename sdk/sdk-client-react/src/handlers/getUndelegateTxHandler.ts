import type { ISDKManager } from '@summer_fi/sdk-client'

export const getUndelegateTxHandler = (sdk: ISDKManager) => async () => {
  return sdk.armada.users.getUndelegateTx()
}
