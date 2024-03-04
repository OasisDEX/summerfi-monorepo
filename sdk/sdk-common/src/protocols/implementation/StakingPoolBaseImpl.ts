import { Address } from '../../common/implementation/Address'
import { Token } from '../../common/implementation/Token'
import { SupplyPool } from '../interfaces/SupplyPool'
import { PoolId, IProtocolId } from '../interfaces/IDs'

import { PoolBaseImpl } from './PoolBaseImpl'
import { PoolType } from '../interfaces/IPool'

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
