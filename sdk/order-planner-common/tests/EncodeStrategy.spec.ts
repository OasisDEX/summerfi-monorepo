import { ActionNames } from '@summerfi/deployment-types'
import { encodeStrategy } from '../src/utils'
import { decodeStrategy } from './utils/DecodeStrategy'
import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { Address } from '@summerfi/sdk-common/common'

class DerivedAction extends BaseAction {
  public readonly config = {
    name: 'PullToken' as ActionNames,
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
  const strategyExecutor = Address.createFromEthereum({
    value: '0x5E81A7515F956ab642Eb698821a449FE8fE7498b',
  })

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
    const calldata = encodeStrategy({
      strategyName: 'operationName',
      strategyExecutor,
      actions: [actionCall, otherActionCall],
    })

    const decodedArgs = decodeStrategy(calldata)

    expect(decodedArgs).toEqual({
      strategyName: 'operationName',
      actions: [actionCall, otherActionCall],
    })
  })
})
