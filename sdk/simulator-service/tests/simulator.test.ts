import { Address, ChainInfo, Percentage, Token, TokenAmount, borrowFromPosition, depositToPosition, newEmptyPositionFromPool } from '@summerfi/sdk-common/common'
import { LendingPool, ProtocolName } from '@summerfi/sdk-common/protocols'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { SwapProviderType } from '@summerfi/swap-common/enums'
import { refinaceLendingToLending } from '../src/implementation/strategies'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'

const testChain = ChainInfo.createFrom({ chainId: 1, name: 'test' })

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

const testSourceLendingPool = new LendingPool({
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

const testSourcePosition =
    borrowFromPosition(
        depositToPosition(
            newEmptyPositionFromPool(testSourceLendingPool), TokenAmount.createFrom({ token: testCollateral, amount: '100' })
        ),
        TokenAmount.createFrom({ token: testDebt, amount: '50' })
    )

const testTargetLendingPool = new LendingPool({
    collateralTokens: [testCollateral],
    debtTokens: [testDebt],
    maxLTV: Percentage.createFrom({ percentage: 80 }),
    poolId: {
        protocol: ProtocolName.Spark,
    },
    protocol: {
        chainInfo: testChain,
        name: ProtocolName.Spark,
    },
})

const swapManagerMock: ISwapManager = {
    getSwapDataExactInput: async (
        params: {
            chainInfo: ChainInfo
            fromAmount: TokenAmount
            toToken: Token
            recipient: Address
            slippage: Percentage
        }
    ) => {
        return {
            provider: SwapProviderType.OneInch,
            fromTokenAmount: params.fromAmount,
            toTokenAmount: TokenAmount.createFrom({ token: params.toToken, amount: '10' }),
            calldata: '0x000',
            targetContract: Address.ZeroAddressEthereum,
            value: '0',
            gasPrice: '0',
        }
    },
    getSwapQuoteExactInput: async (params: {
        chainInfo: ChainInfo
        fromAmount: TokenAmount
        toToken: Token
    }) => {
        return {
            provider: SwapProviderType.OneInch,
            fromTokenAmount: params.fromAmount,
            toTokenAmount: TokenAmount.createFrom({ token: params.toToken, amount: '10' }),
            estimatedGas: '0'
        }
    }
}

function mockGetFee() {
    return 0
}



describe('Refinance', () => {
    describe('to the position with the same collateral and debt (no swaps)', () => {
        let simulation: Simulation<SimulationType.Refinance>
        beforeAll(async () => {
            simulation = await refinaceLendingToLending({
                position: testSourcePosition,
                targetPool: testTargetLendingPool,
                slippage: Percentage.createFrom({ percentage: 1 }),
            }, {
                swapManager: swapManagerMock,
                getSummerFee: mockGetFee,
            })
            // console.log(JSON.stringify(simulation, null, 4))
        })

        it('should not include swap steps', async () => {
            expect(simulation.steps.filter(step => step.skip).map(step => step.type)).toBeDefined()
        })


    })
})

