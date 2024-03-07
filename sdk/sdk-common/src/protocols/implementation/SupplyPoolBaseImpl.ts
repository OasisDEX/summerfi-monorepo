import { Address } from '../../common/implementation/Address'
import { Token } from '../../common/implementation/Token'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { PoolType } from '../interfaces/PoolType'
import { SupplyPool } from '../interfaces/SupplyPool'
import { PoolBaseImpl } from './PoolBaseImpl'

export class SupplyPoolImpl extends PoolBaseImpl<PoolType.Supply> implements SupplyPool {
  public readonly supplyToken: Token

  constructor(params: {
    poolId: IPoolId
    protocol: IProtocol
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
