import { PoolBaseImpl } from './PoolBaseImpl'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import type { Address } from '~sdk-common/common/implementation/Address'
import type { CollateralConfig, DebtConfig, LendingPool } from '~sdk-common/protocols/interfaces/LendingPool'
import type { IPoolId } from '~sdk-common/protocols/interfaces/IPoolId'
import { PoolType } from '~sdk-common/protocols/interfaces/PoolType'
import { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

export class LendingPoolImpl extends PoolBaseImpl<PoolType.Lending> implements LendingPool {
  public readonly collaterals: CollateralConfig[]
  public readonly debts: DebtConfig[]
  public readonly maxLTV: Percentage

  constructor(params: {
    poolId: IPoolId
    protocol: ProtocolName
    address?: Address
    TVL?: number
    maxLTV: Percentage
    debts: DebtConfig[]
    collaterals: CollateralConfig[]
  }) {
    // TODO: resolve multicollateral issue
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.debts = params.debts
    this.collaterals = params.collaterals
    this.maxLTV = params.maxLTV
  }
}
