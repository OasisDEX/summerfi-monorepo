import type { ISDKManager } from '@summer_fi/sdk-client'
import { type Denomination, type IToken } from '@summer_fi/sdk-client'

export const getSpotPriceHandler =
  (sdk: ISDKManager) =>
  async ({ baseToken, denomination }: { baseToken: IToken; denomination?: Denomination }) => {
    const position = await sdk.oracle.getSpotPrice({
      baseToken,
      denomination,
    })
    return position
  }
