import { PoolBaseImpl } from './PoolBaseImpl'
import { Address } from '~sdk-common/common/implementation/Address'
import { Token } from '~sdk-common/common/implementation/Token'
import type { IPoolId } from '~sdk-common/protocols/interfaces/IPoolId'
import { PoolType } from '~sdk-common/protocols/interfaces/PoolType'
import { SupplyPool } from '~sdk-common/protocols/interfaces/SupplyPool'
import { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

export class SupplyPoolImpl extends PoolBaseImpl<PoolType.Supply> implements SupplyPool {
  public readonly supplyToken: Token

  constructor(params: {
    poolId: IPoolId
    protocol: ProtocolName
    address?: Address
    TVL?: number
    supplyToken: Token
  }) {
    // TODO: I DON"T KNOW WHAT TO DO WITH THIS, what is the collateral token for stakiing pool?
    super({
      ...params,
      type: PoolType.Supply,
    })

    this.supplyToken = params.supplyToken
  }
}
