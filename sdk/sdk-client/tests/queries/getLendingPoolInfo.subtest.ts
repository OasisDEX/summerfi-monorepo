import {
  ILKType,
  MakerLendingPoolId,
  MakerLendingPoolInfo,
  MakerProtocol,
  isMakerProtocol,
  isMakerLendingPoolId,
} from '@summerfi/protocol-plugins'
import { Address, ChainFamilyMap, PoolType, ProtocolName, Token } from '@summerfi/sdk-common'
import assert from 'assert'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCMainClientType } from '../../src/rpc/SDKMainClient'

export default async function getLendingPoolInfoTest() {
  type GetLendingPoolInfoType = RPCMainClientType['protocols']['getLendingPoolInfo']['query']

  const getLendingPoolInfoQuery: GetLendingPoolInfoType = jest.fn(async (poolId) => {
    expect(poolId).toBeDefined()

    if (!isMakerLendingPoolId(poolId)) {
      fail('PoolId is not MakerPoolId')
    }

    expect(poolId.protocol).toBeDefined()
    expect(poolId.protocol.name).toBe(ProtocolName.Maker)
    expect(poolId.ilkType).toBe(ILKType.ETH_A)

    return {
      type: PoolType.Lending,
      id: poolId,
    } as unknown as MakerLendingPoolInfo
  })

  const rpcClient = {
    protocols: {
      getLendingPoolInfo: {
        query: getLendingPoolInfoQuery,
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

  const protocol = MakerProtocol.createFrom({
    chainInfo: chain.chainInfo,
  })

  assert(isMakerProtocol(protocol), 'Protocol is not MakerProtocol')

  const makerPoolId = MakerLendingPoolId.createFrom({
    protocol: MakerProtocol.createFrom({
      chainInfo: chain.chainInfo,
    }),
    collateralToken: Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    }),
    debtToken: Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      }),
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    }),
    ilkType: ILKType.ETH_A,
  })

  const pool = await chain.protocols.getLendingPoolInfo({ poolId: makerPoolId })

  if (!pool) {
    fail('Pool not found')
  }

  expect(pool.type).toBe(PoolType.Lending)
  expect(pool.id).toBe(makerPoolId)
  expect(pool.id.protocol.name).toBe(protocol.name)
  expect(pool.id.protocol.chainInfo).toEqual(protocol.chainInfo)
}
