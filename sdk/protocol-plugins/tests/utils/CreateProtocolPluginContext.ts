import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { SetupDeployments } from './SetupDeployments'
import { OracleManagerMock, SwapManagerMock, TokensManagerMock } from '@summerfi/testing-utils'

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
    tokensManager: new TokensManagerMock(),
    oracleManager: new OracleManagerMock(),
    deployments: SetupDeployments(),
    swapManager: new SwapManagerMock(),
  }

  if (__ctxOverrides) {
    return {
      ...defaultContext,
      ...__ctxOverrides,
    }
  }

  return defaultContext
}
