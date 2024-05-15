import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IPosition } from '@summerfi/sdk-common/common'

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
    params: { position: IPosition },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          protocol: params.position.pool.id.protocol.name,
          positionType: params.position.type,
          collateralToken: params.position.collateralAmount.token.address.value,
          debtToken: params.position.debtAmount.token.address.value,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
