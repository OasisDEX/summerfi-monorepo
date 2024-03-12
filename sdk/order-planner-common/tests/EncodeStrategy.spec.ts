import { BaseAction } from '../src/actions/BaseAction'
import { ActionCall } from '../src/actions/Types'
import { ActionCallsStack } from '../src/context/ActionCallsStack'
import { encodeStrategy } from '../src/utils'
import { decodeStrategy } from './utils/DecodeStrategy'

class DerivedAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 8,
    parametersAbi: 'address, address, uint256',
    storageInputs: ['someInput1', 'someInput2', 'otherInput'],
    storageOutputs: ['someOutput1', 'someOutput2', 'otherOutput'],
  }

  public encodeCall(
    params: { test1: string; test2: string; test3: number },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [params.test1, params.test2, params.test3],
      mapping: paramsMapping,
    })
  }
}

describe.only('Encode Strategy', () => {
  const derivedAction = new DerivedAction()

  const actionCall = derivedAction.encodeCall(
    {
      test1: '0x0000000000000000000000000000000000000123',
      test2: '0x0000000000000000000000000000000000000456',
      test3: 100,
    },
    [6, 7, 8, 9],
  )

  const otherActionCall = derivedAction.encodeCall({
    test1: '0x0000000000000000000000000000000000000999',
    test2: '0x0000000000000000000000000000000000000888',
    test3: 200,
  })

  it('should encode calls for operation executor', () => {
    const calldata = encodeStrategy('operationName', [actionCall, otherActionCall])

    const decodedArgs = decodeStrategy(calldata)

    expect(decodedArgs).toEqual({
      strategyName: 'operationName',
      actions: [actionCall, otherActionCall],
    })
  })
})
