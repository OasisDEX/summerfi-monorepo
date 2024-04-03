import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Position } from '@summerfi/sdk-common/common'
import { PositionType } from '@summerfi/sdk-common/simulation'

export class PositionCreatedAction extends BaseAction {
  public readonly config = {
    name: 'PositionCreated',
    version: 0,
    parametersAbi:
      '(string protocol, string positionType, address collateralToken, address debtToken)',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { position: Position; positionType: PositionType },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          protocol: params.position.pool.protocol.name,
          positionType: params.positionType,
          collateralToken: params.position.collateralAmount.token.address.value,
          debtToken: params.position.debtAmount.token.address.value,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
