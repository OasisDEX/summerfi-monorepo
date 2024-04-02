import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { MockContractProvider } from '../../src/mocks/mockContractProvider'
import { TokenService, PriceService } from '../../src/implementation'

export async function createProtocolPluginContext(
  __ctxOverrides?: Partial<IProtocolPluginContext>,
): Promise<IProtocolPluginContext> {
  const RPC_URL = process.env['MAINNET_RPC_URL'] || ''
  const provider: PublicClient = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(RPC_URL),
  })

  const defaultContext: IProtocolPluginContext = {
    provider,
    tokenService: new TokenService(),
    priceService: new PriceService(provider),
    contractProvider: new MockContractProvider(),
  }

  if (__ctxOverrides) {
    return {
      ...defaultContext,
      ...__ctxOverrides,
    }
  }

  return defaultContext
}
