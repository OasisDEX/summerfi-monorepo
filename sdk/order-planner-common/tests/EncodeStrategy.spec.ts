import { encodeStrategy } from '../src/utils/EncodeStrategy'
import { Address, IPositionsManager } from '@summerfi/sdk-common'
import {
  DerivedAction,
  decodePositionsManagerCalldata,
  decodeStrategyExecutorCalldata,
} from '@summerfi/testing-utils'
import assert from 'assert'

describe('Encode Strategy', () => {
  const derivedAction = new DerivedAction()
  const strategyExecutorAddress = Address.createFromEthereum({
    value: '0x5e81A7515f956aB642eb698821a449fe8fE7498B',
  })

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

  it('should encode calls for operation executor', () => {
    const positionsManager: IPositionsManager = {
      address: Address.createFromEthereum({
        value: '0x5e81A7515f956aB642eb698821a449fe8fE7498B',
      }),
    }

    const transactionInfo = encodeStrategy({
      strategyName: 'SomeStrategyName',
      strategyExecutor: strategyExecutorAddress,
      positionsManager: positionsManager,
      actions: [actionCall, otherActionCall],
    })

    assert(transactionInfo, 'Cannot encode strategy')

    const positionsManagerParams = decodePositionsManagerCalldata({
      calldata: transactionInfo.transaction.calldata,
    })

    assert(positionsManagerParams, 'Cannot decode Positions Manager calldata')

    expect(positionsManagerParams.target.value).toEqual(strategyExecutorAddress.value)

    const strategyExecutorParams = decodeStrategyExecutorCalldata(positionsManagerParams.calldata)

    const { name: actionCallName, ...actionCallNoName } = actionCall
    const { name: otherActionCallName, ...otherActionCallNoName } = otherActionCall

    expect(strategyExecutorParams).toEqual({
      strategyName: 'SomeStrategyName',
      actionCalls: [actionCallNoName, otherActionCallNoName],
    })
  })
})
