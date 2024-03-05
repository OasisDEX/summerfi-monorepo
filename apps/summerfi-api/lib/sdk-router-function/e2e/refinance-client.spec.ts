/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable turbo/no-undeclared-env-vars */
import { zeroAddress } from '@summerfi/common'
import { ChainFamilyMap, User, makeSDK } from '@summerfi/sdk-common/client'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { Wallet, Percentage, PositionId, Address } from '@summerfi/sdk-common/common'
import type { RefinanceParameters } from '@summerfi/sdk-common/orders'
import { ProtocolName, type LendingPoolParameters } from '@summerfi/sdk-common/protocols'
import { isLendingPool } from '@summerfi/sdk-common/protocols/interfaces/LendingPool'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '~src/app-router'
import superjson from 'superjson'

/**
 * Client
 */
if (process.env.SDK_API_URL === undefined) {
  throw new Error('SDK_API_URL is required')
}
export const sdkClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.SDK_API_URL + '/api/sdk',
      transformer: superjson,
    }),
  ],
})

describe('Refinance Client-Server Communication', () => {
  const wallet = Wallet.createFrom({ value: zeroAddress })

  it('Refinance flow', async () => {
    const sdk = makeSDK()

    const positionId = PositionId.createFrom({
      id: '13242',
    })
    const chain = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    if (!chain) {
      fail('Chain not found')
    }

    const sourcePosition = await sdkClient.getPosition.query({
      id: positionId,
      chain: chain,
      wallet,
    })
    if (!sourcePosition) {
      fail('Position not found')
    }

    const WETH = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })
    if (!WETH) {
      fail('WETH not found')
    }

    const DAI = await chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
    if (!DAI) {
      fail('DAI not found')
    }

    const protocol = await chain.protocols.getProtocolByName({
      name: ProtocolName.Spark,
    })
    if (!protocol) {
      fail('Protocol not found')
    }

    const poolPair: LendingPoolParameters = {
      collateralTokens: [WETH],
      debtTokens: [DAI],
    }

    const pool = await sdkClient.getPool.query({
      protocol: protocol,
      poolParameters: poolPair,
      protocolParameters: wallet,
    })
    if (!pool) {
      fail('Pool not found')
    }

    if (!isLendingPool(pool)) {
      fail('Pool is not a lending pool')
    }

    const refinanceParameters: RefinanceParameters = {
      sourcePosition: sourcePosition,
      targetPool: pool,
      slippage: Percentage.createFrom({ percentage: 20.5 }),
    }

    const simulation = (await sdkClient.simulation.refinance.query({
      pool: pool,
      parameters: refinanceParameters,
      position: sourcePosition,
    })) as Simulation<SimulationType>
    if (!simulation) {
      fail('Simulation not found')
    }

    const order = await sdkClient.orders.buildOrder.query({
      user: new User({ chain, wallet }),
      positionsManager: { address: Address.createFrom({ value: zeroAddress }) },
      simulation: simulation as any,
    })
    if (!order) {
      fail('Order not found')
    }
  })
})
