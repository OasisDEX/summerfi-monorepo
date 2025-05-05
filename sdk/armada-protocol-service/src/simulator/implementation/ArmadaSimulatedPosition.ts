import {
  IArmadaManager,
  IArmadaSimulatedPosition,
  IArmadaSimulatedPositionData,
  __iarmadasimulatedposition__,
} from '@summerfi/armada-protocol-common'
import { ArmadaPosition, ITokenAmount } from '@summerfi/sdk-common'

/**
 * Type for the parameters of ArmadaSimulatedPosition
 */

export type ArmadaSimulatedPositionParameters = Omit<IArmadaSimulatedPositionData, ''>
/**
 * @class ArmadaSimulatedPosition
 * @see IArmadaSimulatedPosition
 */
export class ArmadaSimulatedPosition extends ArmadaPosition implements IArmadaSimulatedPosition {
  readonly [__iarmadasimulatedposition__] = __iarmadasimulatedposition__

  /** ATTRIBUTES */
  armadaManager: IArmadaManager

  /** Re-declare as Read-write */
  amount: ITokenAmount
  shares: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaSimulatedPositionParameters): ArmadaSimulatedPosition {
    return new ArmadaSimulatedPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaSimulatedPositionParameters) {
    super(params)

    this.armadaManager = params.armadaManager

    this.amount = params.amount
    this.shares = params.shares
  }

  /** METHODS */

  /**
   * Deposit amount to the position
   *
   * @param amount Amount to deposit
   *
   * @dev Updates the object state
   */
  async deposit(amount: ITokenAmount) {
    this.amount = this.amount.add(amount)

    this.shares = await this.armadaManager.utils.convertToShares({
      vaultId: this.pool.id,
      amount: this.amount,
    })
  }

  /**
   * Withdraw amount from the position
   *
   * @param amount Amount to withdraw
   *
   * @dev Updates the object state
   */
  async withdraw(amount: ITokenAmount) {
    this.amount = this.amount.subtract(amount)

    this.shares = await this.armadaManager.utils.convertToShares({
      vaultId: this.pool.id,
      amount: this.amount,
    })
  }
}

// Not registered in SerializationService on purpose as it is only local to the simulator
