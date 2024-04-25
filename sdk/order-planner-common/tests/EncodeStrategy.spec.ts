import { ActionNames } from '@summerfi/deployment-types'
import { encodeStrategy } from '../src/utils'
import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { Address } from '@summerfi/sdk-common/common'
import {
  decodePositionsManagerCalldata,
  decodeStrategyExecutorCalldata,
} from '@summerfi/testing-utils'
import assert from 'assert'
import { IPositionsManager } from '@summerfi/sdk-common/orders'

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
  const strategyExecutorAddress = Address.createFromEthereum({
    value: '0x5e81A7515f956aB642eb698821a449fe8fE7498B',
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

    expect(strategyExecutorParams).toEqual({
      strategyName: 'SomeStrategyName',
      actionCalls: [actionCall, otherActionCall],
    })
  })
})
