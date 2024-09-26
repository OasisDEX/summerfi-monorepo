import { ChainFamilyMap, Percentage, RiskRatio, RiskRatioType } from '@summerfi/sdk-common'
import { Address, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import {
  MorphoLendingPool,
  MorphoLendingPoolId,
  MorphoPaybackAction,
  MorphoProtocol,
} from '../../../../src'
import { MorphoLLTVPrecision } from '../../../../src/plugins/morphoblue/constants/MorphoConstants'

describe('MorphoPaybackAction Action', () => {
  const action = new MorphoPaybackAction()
  const contractNameWithVersion = `${action.config.name}_${action.config.version}`

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

  const onBehalf = Address.createFromEthereum({
    value: '0x6ADb2E268de2aA1aBF6578E4a8119b960E02928F',
  })

  const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })

  const morphoProtocol = MorphoProtocol.createFrom({
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
  })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        amount: tokenAmount,
        morphoLendingPool: morphoLendingPool,
        onBehalf: onBehalf,
        paybackAll: true,
      },
      [2, 6, 7, 9],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      {
        amount: tokenAmount.toSolidityValue(),
        marketParams: {
          loanToken: morphoLendingPool.debtToken.address.value,
          collateralToken: morphoLendingPool.collateralToken.address.value,
          oracle: morphoLendingPool.oracle.value,
          irm: morphoLendingPool.irm.value,
          lltv: morphoLendingPool.lltv.toLTV().toSolidityValue({ decimals: MorphoLLTVPrecision }),
        },
        onBehalf: onBehalf.value,
        paybackAll: true,
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([2, 6, 7, 9])
  })
})
