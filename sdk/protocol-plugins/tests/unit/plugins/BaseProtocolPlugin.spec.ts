import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common'
import { BaseProtocolPlugin } from '../../../src/implementation'
import { MakerProtocolPlugin } from '../../../src/plugins/maker'
import { createProtocolPluginContext } from '../../utils/CreateProtocolPluginContext'
import assert from 'assert'
import { ChainFamilyMap } from '@summerfi/sdk-common'

describe('Base Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let baseProtocolPlugin: BaseProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    baseProtocolPlugin = new MakerProtocolPlugin()
  })

  it('should correctly return the corresponding action builder for a given simulation step', () => {
    const actionBuilder = baseProtocolPlugin.getActionBuilder(SimulationSteps.PaybackWithdraw)
    assert(actionBuilder, 'ActionBuilder is not defined')
  })
})
