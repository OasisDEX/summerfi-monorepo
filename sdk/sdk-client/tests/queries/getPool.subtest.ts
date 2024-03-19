import {
  ILKType,
  MakerPoolId,
  PoolType,
  ProtocolName,
  isMakerPoolId,
} from '@summerfi/sdk-common/protocols'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCClientType } from '../../src/rpc/SDKClient'
import { MakerLendingPool } from '@summerfi/protocol-manager'

export default async function getPoolTest() {
  type GetPoolType = RPCClientType['getPool']['query']

  const getPoolQuery: GetPoolType = jest.fn(async (params) => {
    expect(params).toBeDefined()
    expect(params.poolId).toBeDefined()

    if (!isMakerPoolId(params.poolId)) {
      fail('PoolId is not MakerPoolId')
    }

    expect(params.poolId.protocol).toBeDefined()
    expect(params.poolId.protocol.name).toBe(ProtocolName.Maker)
    expect(params.poolId.ilkType).toBe(ILKType.ETH_A)

    return {
      type: PoolType.Lending,
      poolId: params.poolId,
      protocol: params.poolId.protocol,
    } as unknown as MakerLendingPool
  })

  const rpcClient = {
    getPool: {
      query: getPoolQuery,
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

  const protocol = await chain.protocols.getProtocol({ name: ProtocolName.Maker })

  if (!protocol) {
    fail('Protocol not found')
  }

  const makerPoolId: MakerPoolId = {
    protocol: {
      name: ProtocolName.Maker,
      chainInfo: chain.chainInfo,
    },
    ilkType: ILKType.ETH_A,
    vaultId: '0x123',
  }

  const pool = await protocol.getPool({ poolId: makerPoolId })

  if (!pool) {
    fail('Pool not found')
  }

  expect(pool.type).toBe(PoolType.Lending)
  expect(pool.poolId).toBe(makerPoolId)
  expect(pool.protocol.name).toBe(protocol.name)
  expect(pool.protocol.chainInfo).toBe(protocol.chainInfo)
}
