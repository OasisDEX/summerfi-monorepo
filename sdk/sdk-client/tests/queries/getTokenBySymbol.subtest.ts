import { SDKManager } from '../../src/implementation/SDKManager'
import { Address, RPCClientType } from '../../src/rpc/SDKClient'
import { AddressType, Token } from '@summerfi/sdk-common'
import assert from 'assert'

export default async function getTokenBySymbol() {
  type GetTokenBySymbolType = RPCClientType['tokens']['getTokenBySymbol']['query']

  const getTokenBySymbolQuery: GetTokenBySymbolType = jest.fn(async (params) => {
    expect(params).toBeDefined()
    expect(params.chainInfo).toBeDefined()
    expect(params.symbol).toBeDefined()

    return Token.createFrom({
      address: Address.createFrom({
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: params.chainInfo,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    })
  })

  const rpcClient = {
    tokens: {
      getTokenBySymbol: {
        query: getTokenBySymbolQuery,
      },
    },
  } as unknown as RPCClientType

  const sdkManager = new SDKManager({ rpcClient })

  expect(sdkManager).toBeDefined()

  const chain = await sdkManager.chains.getChain({
    chainInfo: { chainId: 1, name: 'Mainnet' },
  })

  if (!chain) {
    fail('Chain not found')
  }

  const token = await chain.tokens.getTokenBySymbol({ symbol: 'USDC' })
  assert(token, 'Token not found')

  expect(token.address.value).toEqual('0x6b175474e89094c44da98b954eedeac495271d0f')
  expect(token.chainInfo.chainId).toEqual(1)
  expect(token.name).toEqual('USD Coin')
  expect(token.symbol).toEqual('USDC')
  expect(token.decimals).toEqual(6)
}
