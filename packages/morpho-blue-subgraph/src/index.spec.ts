import { getMorphoBlueSubgraphClient, MorphoBlueSubgraphClient } from '.'
import { Logger } from '@aws-lambda-powertools/logger'
import { ChainId } from '@summerfi/serverless-shared'

const logger = new Logger({
  serviceName: 'moorpho-blue-subgraph-tests',
  environment: 'dev',
  logLevel: 'debug',
})

function getTimestampInSeconds(unixTimestamp: number): number {
  return Math.floor(unixTimestamp / 1000)
}

describe.skip('Exploration test MorphoBlue InterestRates', () => {
  let client: MorphoBlueSubgraphClient
  const wstETH_ETH_marketId: `0x${string}` =
    '0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d'
  const fromTimestamp_2024_04_01 = getTimestampInSeconds(new Date().setFullYear(2024, 3, 1))
  const toTimestamp_2024_04_15 = getTimestampInSeconds(new Date().setFullYear(2024, 3, 15))

  beforeAll(() => {
    client = getMorphoBlueSubgraphClient({
      chainId: ChainId.MAINNET,
      urlBase: '', // set your urlBase here
      logger,
    })
  })
  it('should return arrays of interest rates', async () => {
    logger.debug('Fetching interest rates', {
      marketId: wstETH_ETH_marketId,
      fromTimestamp: fromTimestamp_2024_04_01,
      toTimestamp: toTimestamp_2024_04_15,
    })

    const result = await client.getInterestRate({
      marketId: wstETH_ETH_marketId,
      fromTimestamp: fromTimestamp_2024_04_01,
      toTimestamp: toTimestamp_2024_04_15,
    })

    expect(result.debtToken.symbol).toBe('WETH')
    expect(result.collateralToken.symbol).toBe('wstETH')

    expect(result.interestRates.borrow[0].fromTimestamp).toBe(fromTimestamp_2024_04_01)
  })
})
