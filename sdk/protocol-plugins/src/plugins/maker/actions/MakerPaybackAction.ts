import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IPosition, ITokenAmount, IPositionsManager } from '@summerfi/sdk-common'
import { isMakerLendingPositionId } from '../interfaces/IMakerLendingPositionId'

export class MakerPaybackAction extends BaseAction<typeof MakerPaybackAction.Config> {
  public static readonly Config = {
    name: 'MakerPayback',
    version: 0,
    parametersAbi: ['(uint256 vaultId, address userAddress, uint256 amount, bool paybackAll)'],
    storageInputs: ['vaultId'],
    storageOutputs: ['amountPaidBack'],
  } as const

  public encodeCall(
    params: {
      position: IPosition
      positionsManager: IPositionsManager
      amount: ITokenAmount
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    if (!isMakerLendingPositionId(params.position.id)) {
      throw new Error(`Position ID is not a Maker one: ${JSON.stringify(params.position.id)} `)
    }

    return this._encodeCall({
      arguments: [
        {
          vaultId: BigInt(params.position.id.vaultId),
          userAddress: params.positionsManager.address.value,
          amount: params.amount.toSolidityValue(),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MakerPaybackAction.Config
  }
}
