import { Address, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import {
  MorphoBorrowAction,
  MorphoLendingPool,
  MorphoLendingPoolId,
  MorphoProtocol,
} from '../../../../src'
import {
  ChainFamilyMap,
  Percentage,
  ProtocolName,
  RiskRatio,
  RiskRatioType,
} from '@summerfi/sdk-common'
import { PoolType } from '@summerfi/sdk-common/protocols'
import { MorphoLLTVPrecision } from '../../../../src/plugins/morphoblue/constants/MorphoConstants'

describe('MorphoBorrowAction Action', () => {
  const action = new MorphoBorrowAction()
  const contractNameWithVersion = `${action.config.name}`

  const DAI = Token.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

  const WETH = Token.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
  })

  const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })

  const morphoProtocol = MorphoProtocol.createFrom({
    name: ProtocolName.MorphoBlue,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const morphoLendingPoolId = MorphoLendingPoolId.createFrom({
    marketId: '0x1234',
    protocol: morphoProtocol,
  })

  const morphoLendingPool = MorphoLendingPool.createFrom({
    collateralToken: WETH,
    debtToken: DAI,
    id: morphoLendingPoolId,
    irm: Address.createFromEthereum({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }),
    oracle: Address.createFromEthereum({ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }),
    lltv: RiskRatio.createFrom({
      value: Percentage.createFrom({ value: 0.5 }),
      type: RiskRatioType.LTV,
    }),
    type: PoolType.Lending,
  })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        amount: tokenAmount,
        morphoLendingPool: morphoLendingPool,
      },
      [1, 8, 5, 3],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      {
        amount: BigInt(tokenAmount.toBaseUnit()),
        marketParams: {
          loanToken: morphoLendingPool.debtToken.address.value,
          collateralToken: morphoLendingPool.collateralToken.address.value,
          oracle: morphoLendingPool.oracle.value,
          irm: morphoLendingPool.irm.value,
          lltv: BigInt(
            morphoLendingPool.lltv.toLTV().toBaseUnit({ decimals: MorphoLLTVPrecision }),
          ),
        },
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([1, 8, 5, 3])
  })
})
