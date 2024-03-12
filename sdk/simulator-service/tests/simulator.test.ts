import { Address, ChainInfo, Percentage, Token, TokenAmount, newEmptyPositionFromPool } from '@summerfi/sdk-common/common'
import { LendingPool, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { makeStrategy } from '~simulator-service/implementation/helpers'
import { Simulator } from '~simulator-service/implementation/simulator-engine'

const testStrategy = makeStrategy([
    {
        step: SimulationSteps.PullToken,
        optional: false,
    },
    {
        step: SimulationSteps.DepositBorrow,
        optional: false,
    }
])

const testChain = ChainInfo.createFrom({chainId: 1, name: 'test'})

const testCollateral = Token.createFrom({
    chainInfo: testChain,
    address: Address.createFrom({ value: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' }),
    decimals: 18,
    name: "Collateral",
    symbol: "COL",
})

const testDebt = Token.createFrom({
    chainInfo: testChain,
    address: Address.createFrom({ value: '0x814FaE9f487206471B6B0D713cD51a2D35980000' }),
    decimals: 18,
    name: "Debt",
    symbol: "DBT",
})

const testLendingPool = new LendingPool({
    collateralTokens: [testCollateral],
    debtTokens: [testDebt],
    maxLTV: Percentage.createFrom({ percentage: 80 }),
    poolId: {
        protocol: ProtocolName.Maker,
    },
    protocol: {
        chainInfo: testChain,
        name: ProtocolName.Maker,
    },
})



describe('Simulator', () => {
    it('should create SDK client', async () => {
      const simulator = Simulator.create(testStrategy)

      const simulation = await simulator.next(async (ctx) => ({
        name: 'DepositBorrow',
        type: SimulationSteps.DepositBorrow,
        inputs: {
            depositAmount: TokenAmount.createFrom({token: testCollateral, amount: "10"}),
            borrowAmount: TokenAmount.createFrom({token: testDebt, amount: '1'}),
            position: newEmptyPositionFromPool(testLendingPool),
        }
      })).run()

      console.log(JSON.stringify(simulation,null,4))
    })
  })

  