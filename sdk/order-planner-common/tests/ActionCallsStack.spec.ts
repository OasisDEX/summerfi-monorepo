import { BaseAction } from '../src/actions/BaseAction'
import { ActionCall } from '../src/actions/Types'
import { ActionCallsStack } from '../src/context/ActionCallsStack'

class DerivedAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 8,
    parametersAbi: 'address, address, uint256',
    storageInputs: ['someInput1', 'someInput2', 'otherInput'],
    storageOutputs: ['someOutput1', 'someOutput2', 'otherOutput'],
  }

  public encodeCall(params: { arguments: unknown[]; mapping?: number[] }): ActionCall {
    return this._encodeCall(params)
  }
}

describe('Action Calls Stack', () => {
  const derivedAction = new DerivedAction()

  const actionCall = derivedAction.encodeCall({
    arguments: [
      '0x0000000000000000000000000000000000000123',
      '0x0000000000000000000000000000000000000456',
      100,
    ],
    mapping: [6, 7, 8, 9],
  })

  const otherActionCall = derivedAction.encodeCall({
    arguments: [
      '0x0000000000000000000000000000000000000999',
      '0x0000000000000000000000000000000000000888',
      200,
    ],
    mapping: [1, 2, 3, 4],
  })

  it('should allow to start/end subcontext once with empty data', () => {
    const actionCallsStack = new ActionCallsStack()

    actionCallsStack.startSubContext()
    const { callsBatch, customData } = actionCallsStack.endSubContext()

    expect(callsBatch).toEqual([])
    expect(customData).toBeUndefined()
  })

  it('should allow to start/end subcontext once with string data', () => {
    const actionCallsStack = new ActionCallsStack()

    actionCallsStack.startSubContext({ customData: 'someData' })
    const { callsBatch, customData } = actionCallsStack.endSubContext()

    expect(callsBatch).toEqual([])
    expect(customData).toBe('someData')
  })

  it('should allow to start/end subcontext once with object data', () => {
    const actionCallsStack = new ActionCallsStack()

    actionCallsStack.startSubContext({
      customData: {
        someData: 'someData',
        someNumber: 123,
      },
    })
    const { callsBatch, customData } = actionCallsStack.endSubContext()

    expect(callsBatch).toEqual([])
    expect(customData).toEqual({
      someData: 'someData',
      someNumber: 123,
    })
  })

  it('should add calls', async () => {
    const actionCallsStack = new ActionCallsStack()

    actionCallsStack.startSubContext({ customData: 'someDataAgain' })

    actionCallsStack.addCall({ call: actionCall })

    const { callsBatch, customData } = actionCallsStack.endSubContext()

    expect(callsBatch).toEqual([actionCall])
    expect(customData).toBe('someDataAgain')
  })

  it('should add calls to the same batch', async () => {
    const actionCallsStack = new ActionCallsStack()

    actionCallsStack.startSubContext({ customData: 'level1' })

    actionCallsStack.addCall({ call: actionCall })
    actionCallsStack.addCall({ call: otherActionCall })

    actionCallsStack.startSubContext({ customData: 'level2' })

    actionCallsStack.addCall({ call: otherActionCall })
    actionCallsStack.addCall({ call: actionCall })

    const { callsBatch, customData } = actionCallsStack.endSubContext()

    expect(callsBatch).toEqual([otherActionCall, actionCall])
    expect(customData).toBe('level2')

    const { callsBatch: callsBatch2, customData: customData2 } = actionCallsStack.endSubContext()

    expect(callsBatch2).toEqual([actionCall, otherActionCall])
    expect(customData2).toBe('level1')
  })
})
