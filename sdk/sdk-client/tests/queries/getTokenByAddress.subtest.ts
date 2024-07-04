import { SDKManager } from '../../src/implementation/SDKManager'
import { Address, RPCMainClientType } from '../../src/rpc/SDKMainClient'
import { Token } from '@summerfi/sdk-common'
import assert from 'assert'

export default async function getTokenByAddress() {
  type GetTokenByAddressType = RPCMainClientType['tokens']['getTokenByAddress']['query']

  const getTokenByAddressQuery: GetTokenByAddressType = jest.fn(async (params) => {
    expect(params).toBeDefined()
    expect(params.chainInfo).toBeDefined()
    expect(params.address).toBeDefined()

    return Token.createFrom({
      address: params.address,
      chainInfo: params.chainInfo,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    })
  })

  const rpcClient = {
    tokens: {
      getTokenByAddress: {
        query: getTokenByAddressQuery,
      },
    },
  } as unknown as RPCMainClientType

  const sdkManager = new SDKManager({ rpcClient })

  expect(sdkManager).toBeDefined()

  const chain = await sdkManager.chains.getChain({
    chainInfo: { chainId: 1, name: 'Mainnet' },
  })

  if (!chain) {
    fail('Chain not found')
  }

  const token = await chain.tokens.getTokenByAddress({
    address: Address.createFromEthereum({ value: '0x6b175474e89094c44da98b954eedeac495271d0f' }),
  })
  assert(token, 'Token not found')

  expect(token.address.value).toEqual('0x6b175474e89094c44da98b954eedeac495271d0f')
  expect(token.chainInfo.chainId).toEqual(1)
  expect(token.name).toEqual('USD Coin')
  expect(token.symbol).toEqual('USDC')
  expect(token.decimals).toEqual(6)
}
