import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { BaseProtocolPlugin } from '../../src/implementation'
import { MakerProtocolPlugin } from '../../src/plugins/maker'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import assert from 'assert'

describe('Base Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let baseProtocolPlugin: BaseProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    baseProtocolPlugin = new MakerProtocolPlugin({
      context: ctx,
    })
  })

  it('should correctly return the corresponding action builder for a given simulation step', () => {
    const actionBuilder = baseProtocolPlugin.getActionBuilder({
      type: SimulationSteps.PaybackWithdraw,
    } as steps.PaybackWithdrawStep)
    assert(actionBuilder, 'ActionBuilder is not defined')
  })
})
