import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ILendingPosition } from '@summerfi/sdk-common'

export class PositionCreatedAction extends BaseAction<typeof PositionCreatedAction.Config> {
  public static Config = {
    name: 'PositionCreated',
    version: 0,
    parametersAbi: [
      '(string protocol, string positionType, address collateralToken, address debtToken)',
    ],
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { position: ILendingPosition },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          protocol: params.position.pool.id.protocol.name,
          positionType: params.position.subtype,
          collateralToken: params.position.collateralAmount.token.address.value,
          debtToken: params.position.debtAmount.token.address.value,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return PositionCreatedAction.Config
  }
}
