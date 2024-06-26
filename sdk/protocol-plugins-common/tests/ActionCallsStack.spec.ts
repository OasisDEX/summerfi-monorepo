import { DerivedAction } from '@summerfi/testing-utils/mocks/actions/DerivedAction'
import { ActionCallsStack } from '../src/context/ActionCallsStack'

describe('Action Calls Stack', () => {
  const derivedAction = new DerivedAction()

  const actionCall = derivedAction.encodeCall(
    {
      test1: '0x0000000000000000000000000000000000000123',
      test2: '0x0000000000000000000000000000000000000456',
      test3: BigInt(100),
    },
    [6, 7, 8, 9],
  )

  const otherActionCall = derivedAction.encodeCall({
    test1: '0x0000000000000000000000000000000000000999',
    test2: '0x0000000000000000000000000000000000000888',
    test3: BigInt(200),
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

  it('should return the correct number of levels', async () => {
    const actionCallsStack = new ActionCallsStack()

    actionCallsStack.startSubContext({ customData: 'level1' })
    actionCallsStack.startSubContext({ customData: 'level2' })
    actionCallsStack.startSubContext({ customData: 'level3' })

    expect(actionCallsStack.subContextLevels).toBe(3)

    actionCallsStack.endSubContext()

    expect(actionCallsStack.subContextLevels).toBe(2)

    actionCallsStack.endSubContext()

    expect(actionCallsStack.subContextLevels).toBe(1)

    actionCallsStack.endSubContext()

    expect(actionCallsStack.subContextLevels).toBe(0)
  })
})
