import { PoolBaseImpl } from './PoolBaseImpl'
import { Address } from '~sdk-common/common/implementation/Address'
import { Token } from '~sdk-common/common/implementation/Token'
import { IProtocolId, PoolId } from "~sdk-common/protocols/interfaces/IDs"
import { SupplyPool } from "~sdk-common/protocols/interfaces/SupplyPool"
import { PoolType } from "~sdk-common/protocols/interfaces/IPool"


export class SupplyPoolImpl extends PoolBaseImpl<PoolType.Supply> implements SupplyPool {
  public readonly supplyToken: Token

  constructor(params: {
    poolId: PoolId
    protocolId: IProtocolId
    address?: Address
    TVL?: number
    supplyToken: Token
  }) {
    // TODO: I DON"T KNOW WHAT TO DO WITH THIS, what is the collateral token for stakiing pool?
    super({
      ...params,
      type: PoolType.Supply,
      debtToken: params.supplyToken,
      collateralToken: params.supplyToken,
    })

    this.supplyToken = params.supplyToken
  }
}
