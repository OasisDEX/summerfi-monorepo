import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { EmodeType } from '../../common/enums/EmodeType'
import { sparkEmodeCategoryMap } from '../implementation/EmodeCategoryMap'


export class SparkSetEmodeAction extends BaseAction {
  public readonly config = {
    name: 'SparkSetEMode',
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
          categoryId: sparkEmodeCategoryMap[params.emode],
        },
      ],
      mapping: paramsMapping,
    })
  }
}
