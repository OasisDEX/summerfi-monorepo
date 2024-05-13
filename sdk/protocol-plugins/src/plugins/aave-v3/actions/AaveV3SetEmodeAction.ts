import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { EmodeType } from '../../common/enums/EmodeType'
import { aaveV3EmodeCategoryMap } from '../implementation/EmodeCategoryMap'

export class AaveV3SetEmodeAction extends BaseAction {
  public readonly config = {
    name: 'AaveV3SetEMode',
    version: 0,
    parametersAbi: '(uint8 categoryId)',
    storageInputs: [],
    storageOutputs: ['emodeCategory'],
  } as const

  public encodeCall(
    params: {
      emode: EmodeType
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          categoryId: aaveV3EmodeCategoryMap[params.emode],
        },
      ],
      mapping: paramsMapping,
    })
  }
}
