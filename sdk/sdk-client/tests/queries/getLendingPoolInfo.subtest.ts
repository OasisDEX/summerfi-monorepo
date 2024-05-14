import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SDKManager } from '../../src/implementation/SDKManager'
import { RPCClientType } from '../../src/rpc/SDKClient'
import { ILKType, MakerLendingPoolInfo } from '@summerfi/protocol-plugins/plugins/maker'
import {
  IMakerLendingPoolIdData,
  isMakerLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/maker/interfaces/IMakerLendingPoolId'
import { AddressType } from '@summerfi/sdk-common'

export default async function getLendingPoolInfoTest() {
  type GetLendingPoolInfoType = RPCClientType['protocols']['getLendingPoolInfo']['query']

  const getLendingPoolInfoQuery: GetLendingPoolInfoType = jest.fn(async (params) => {
    expect(params).toBeDefined()
    expect(params.poolId).toBeDefined()

    if (!isMakerLendingPoolId(params.poolId)) {
      fail('PoolId is not MakerPoolId')
    }

    expect(params.poolId.protocol).toBeDefined()
    expect(params.poolId.protocol.name).toBe(ProtocolName.Maker)
    expect(params.poolId.ilkType).toBe(ILKType.ETH_A)

    return {
      type: PoolType.Lending,
      id: params.poolId,
    } as unknown as MakerLendingPoolInfo
  })

  const rpcClient = {
    protocols: {
      getLendingPoolInfo: {
        query: getLendingPoolInfoQuery,
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

  const protocol = await chain.protocols.getProtocol({ name: ProtocolName.Maker })

  if (!protocol) {
    fail('Protocol not found')
  }

  const makerPoolId: IMakerLendingPoolIdData = {
    protocol: {
      name: ProtocolName.Maker,
      chainInfo: chain.chainInfo,
    },
    collateralToken: {
      address: {
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    debtToken: {
      address: {
        type: AddressType.Ethereum,
        value: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      chainInfo: { chainId: 1, name: 'Ethereum' },
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    ilkType: ILKType.ETH_A,
  }

  const pool = await protocol.getLendingPoolInfo({ poolId: makerPoolId })

  if (!pool) {
    fail('Pool not found')
  }

  expect(pool.type).toBe(PoolType.Lending)
  expect(pool.id).toBe(makerPoolId)
  expect(pool.id.protocol.name).toBe(protocol.name)
  expect(pool.id.protocol.chainInfo).toBe(protocol.chainInfo)
}
