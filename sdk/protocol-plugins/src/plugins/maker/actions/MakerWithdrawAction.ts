import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, IPosition, ITokenAmount, IPositionsManager } from '@summerfi/sdk-common'
import { isMakerLendingPositionId } from '../interfaces/IMakerLendingPositionId'

export class MakerWithdrawAction extends BaseAction<typeof MakerWithdrawAction.Config> {
  public static readonly Config = {
    name: 'MakerWithdraw',
    version: 2,
    parametersAbi: ['(uint256 vaultId, address userAddress, address joinAddr, uint256 amount)'],
    storageInputs: ['vaultId'],
    storageOutputs: ['amountWithdrawn'],
  } as const

  public encodeCall(
    params: {
      position: IPosition
      positionsManager: IPositionsManager
      amount: ITokenAmount
      joinAddress: IAddress
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    if (!isMakerLendingPositionId(params.position.id)) {
      throw new Error('Pool ID is not a Maker one')
    }

    return this._encodeCall({
      arguments: [
        {
          vaultId: BigInt(params.position.id.vaultId),
          userAddress: params.positionsManager.address.value,
          joinAddr: params.joinAddress.value,
          amount: params.amount.toSolidityValue(),
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MakerWithdrawAction.Config
  }
}
