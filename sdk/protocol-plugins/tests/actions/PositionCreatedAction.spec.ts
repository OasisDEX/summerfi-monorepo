import { Address, Position, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { PositionCreatedAction } from '../../src/plugins/common/actions/PositionCreatedAction'
import { IProtocol, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { MakerPoolId } from '../../src/plugins/maker/types/MakerPoolId'
import { ILKType } from '../../src/plugins/maker'
import { PositionType } from '@summerfi/sdk-common/simulation'

describe('PositionCreated Action', () => {
  const action = new PositionCreatedAction()
  const contractNameWithVersion = `${action.config.name}`

  const DAI = Token.createFrom({
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

  const WETH = Token.createFrom({
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
  })

  const protocol: IProtocol = {
    name: ProtocolName.Spark,
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
  }

  const position = Position.createFrom({
    positionId: {
      id: '0x123',
    },
    pool: {
      type: PoolType.Lending,
      protocol: protocol,
      poolId: {
        protocol: protocol,
        vaultId: '0x123',
        ilkType: ILKType.ETH_A,
      } as MakerPoolId,
    },
    debtAmount: TokenAmount.createFrom({
      token: DAI,
      amount: '100',
    }),
    collateralAmount: TokenAmount.createFrom({
      token: WETH,
      amount: '100',
    }),
  })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        position: position,
        positionType: PositionType.Refinance,
      },
      [8, 9, 1, 3],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      {
        protocol: protocol.name,
        positionType: PositionType.Refinance,
        collateralToken: WETH.address.value,
        debtToken: DAI.address.value,
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([8, 9, 1, 3])
  })
})
