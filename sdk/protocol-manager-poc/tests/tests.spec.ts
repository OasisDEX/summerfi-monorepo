import { createMakerPlugin, ProtocolPlugin, ProtocolManagerContext  } from '~src/index'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

async function createProtocolManagerContext (): Promise<ProtocolManagerContext> {

  return {
    provider: createPublicClient({
      batch: {
        multicall: true,
      },
      chain: mainnet,
      transport: http(),
    }),
  }
}

describe('playground', () => {
  let ctx: ProtocolManagerContext
  let makerPlugin: ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()
    makerPlugin = createMakerPlugin(ctx)
  })

  it('template', async () => {
    const result = await makerPlugin.getPool(makerPlugin.getPoolId("ETH-A"))
    console.log(result)

    console.log('hello')
  })
})
