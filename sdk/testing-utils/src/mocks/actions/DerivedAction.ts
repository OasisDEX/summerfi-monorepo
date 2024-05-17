import { ActionNames } from '@summerfi/deployment-types'
import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { Hex } from 'viem'

export class DerivedAction extends BaseAction<typeof DerivedAction.Config> {
  public static readonly Config = {
    name: 'PullToken' as ActionNames,
    version: 8,
    parametersAbi: ['(address first, address second, uint256 third)'],
    storageInputs: ['someInput1', 'someInput2', 'otherInput'],
    storageOutputs: ['someOutput1', 'someOutput2', 'otherOutput'],
  } as const

  public encodeCall(
    params: { test1: Hex; test2: Hex; test3: bigint },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          first: params.test1,
          second: params.test2,
          third: params.test3,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return DerivedAction.Config
  }
}
