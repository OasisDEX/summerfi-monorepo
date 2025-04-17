import { Address, ChainInfo, Token, TokenAmount, LendingPositionType } from '@summerfi/sdk-common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import {
  EmodeType,
  SparkLendingPool,
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
} from '../../../src'
import { PositionCreatedAction } from '../../../src/plugins/common/actions/PositionCreatedAction'
import { SparkProtocol } from '../../../src/plugins/spark/implementation/SparkProtocol'

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

  const protocol = SparkProtocol.createFrom({
    chainInfo: ChainInfo.createFrom({
      name: 'Mainnet',
      chainId: 1,
    }),
  })

  const position = SparkLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: SparkLendingPositionId.createFrom({
      id: '0x123',
    }),
    pool: SparkLendingPool.createFrom({
      id: SparkLendingPoolId.createFrom({
        protocol: protocol,
        collateralToken: WETH,
        debtToken: DAI,
        emodeType: EmodeType.None,
      }),
      collateralToken: WETH,
      debtToken: DAI,
    }),
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
        positionType: position.subtype,
        collateralToken: WETH.address.value,
        debtToken: DAI.address.value,
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([8, 9, 1, 3])
  })
})
