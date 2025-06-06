import type { ISDKManager } from '@summer_fi/sdk-client'

export const getChainHandler =
  (sdk: ISDKManager) =>
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
