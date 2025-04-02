import type { ISDKManager } from '@summerfi/sdk-client'
import { type Denomination, type IToken } from '@summerfi/sdk-common'

export const getSpotPriceHandler =
  (sdk: ISDKManager) =>
  async ({ baseToken, denomination }: { baseToken: IToken; denomination?: Denomination }) => {
    const position = await sdk.oracle.getSpotPrice({
      baseToken,
      denomination,
    })
    return position
  }
