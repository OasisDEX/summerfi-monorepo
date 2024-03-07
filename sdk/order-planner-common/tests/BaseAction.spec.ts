import { BaseAction } from '../src/actions/BaseAction'
import { ActionCall } from '../src/actions'
import { keccak256, toBytes } from 'viem'

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

describe('Execution Storage Manager', () => {
  const derivedAction = new DerivedAction()
  const contractNameWithVersion = 'PullToken_v8'
  const functionSelector = '85e92d98'

  const targetHash = keccak256(toBytes(contractNameWithVersion))

  it('should return the versioned name', () => {
    expect(derivedAction.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should add calls', async () => {
    const call = derivedAction.encodeCall({
      arguments: [
        '0x0000000000000000000000000000000000000123',
        '0x0000000000000000000000000000000000000456',
        100,
      ],
      mapping: [6, 7, 8, 9],
    })

    // execute(bytes data, uint8[] paramsMap)
    const dataParamOffset = '0000000000000000000000000000000000000000000000000000000000000040'
    const paramsMappingOffset = '00000000000000000000000000000000000000000000000000000000000000c0'

    // bytes data
    const dataLengthIncludingSize =
      '0000000000000000000000000000000000000000000000000000000000000060'

    // 0x123, 0x456, 100
    const dataFirstParam = '0000000000000000000000000000000000000000000000000000000000000123'
    const dataSecondParam = '0000000000000000000000000000000000000000000000000000000000000456'
    const dataThirdParam = '0000000000000000000000000000000000000000000000000000000000000064'

    // uint8[] paramsMap
    const paramsMappingSize = '0000000000000000000000000000000000000000000000000000000000000004'
    const paramsMappingFirstItem =
      '0000000000000000000000000000000000000000000000000000000000000006'
    const paramsMappingSecondItem =
      '0000000000000000000000000000000000000000000000000000000000000007'
    const paramsMappingThirdItem =
      '0000000000000000000000000000000000000000000000000000000000000008'
    const paramsMappingFourthItem =
      '0000000000000000000000000000000000000000000000000000000000000009'

    const calldata = `0x${functionSelector}${dataParamOffset}${paramsMappingOffset}${dataLengthIncludingSize}${dataFirstParam}${dataSecondParam}${dataThirdParam}${paramsMappingSize}${paramsMappingFirstItem}${paramsMappingSecondItem}${paramsMappingThirdItem}${paramsMappingFourthItem}`

    expect(call.targetHash).toBe(targetHash)
    expect(call.callData).toBe(calldata)
  })
})
