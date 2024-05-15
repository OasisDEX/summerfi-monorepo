import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { SetupDeployments } from './SetupDeployments'
import {
  AddressBookManagerMock,
  OracleManagerMock,
  SwapManagerMock,
  TokensManagerMock,
} from '@summerfi/testing-utils'
import { IChainInfo } from '@summerfi/sdk-common'

export async function createProtocolPluginContext(
  chainInfo: IChainInfo,
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
    addressBookManager: new AddressBookManagerMock(),
    swapManager: new SwapManagerMock(),
  }

  SetupDeployments(chainInfo, defaultContext.addressBookManager as AddressBookManagerMock)

  if (__ctxOverrides) {
    return {
      ...defaultContext,
      ...__ctxOverrides,
    }
  }

  return defaultContext
}
