import type { ISDKManager, ISDKAdminManager } from '@summerfi/sdk-client'

export const getChainHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  ({ chainId }: { chainId: number }) =>
    sdk.chains
      .getChainById({
        chainId,
      })
      .then((chain) => {
        if (!chain) {
          throw new Error('Chain not found')
        }
        return chain
      })
