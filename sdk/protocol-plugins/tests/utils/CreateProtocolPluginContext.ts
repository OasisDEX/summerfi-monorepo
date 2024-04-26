import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { TokenService, PriceService } from '../../src/implementation'
import { SetupDeployments } from './SetupDeployments'
import { SwapManagerMock } from '@summerfi/testing-utils'
import { SwapProviderType } from '@summerfi/sdk-common/swap'
import { CurrencySymbol, Price, Token, Address, ChainInfo } from '@summerfi/sdk-common/common'

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

  const swapManager = new SwapManagerMock()

  swapManager.setSpotData({
    provider: SwapProviderType.OneInch,
    price: Price.createFrom({
      value: '1',
      quoteToken: CurrencySymbol.USD,
      baseToken: Token.createFrom({
        address: Address.createFromEthereum({ value: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'}),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
        chainInfo: ChainInfo.createFrom({
          name: 'Ethereum',
          chainId: 1,
        }),
      }),
    })
  })

  const defaultContext: IProtocolPluginContext = {
    provider,
    tokenService: new TokenService(),
    priceService: new PriceService(provider),
    deployments: SetupDeployments(),
    swapManager,
  }

  if (__ctxOverrides) {
    return {
      ...defaultContext,
      ...__ctxOverrides,
    }
  }

  return defaultContext
}
