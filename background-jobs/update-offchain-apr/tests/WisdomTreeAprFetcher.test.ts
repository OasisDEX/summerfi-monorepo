import { Logger } from '@aws-lambda-powertools/logger'
// Type-only imports: these workspace packages ship ESM, which this package's
// CJS ts-jest transform cannot load at runtime.
import type { Product } from '@summerfi/summer-earn-rates-subgraph'
import type { ChainId } from '@summerfi/serverless-shared'
import { WisdomTreeAprFetcher } from '../src/apr-fetchers/WisdomTreeAprFetcher'
import { FetcherConfigError } from '../src/apr-fetchers/errors'

const MAINNET = 1 as ChainId

// Captured from the DataSpan docs' validated response examples.
const WTGXX_AGGREGATE = {
  metricID: 10008,
  entityID: 'WTGXX',
  entityTicker: 'WTGXX',
  wtID: 1104316,
  dt: '2026-03-13',
  aggregateTypeID: 1,
  aggregateType: 'VarStatExquisite',
  aggTypeDesc: 'Product',
  metric: 'dailyYieldMM',
  value: 0.0343,
  metricSort: 1,
}

function makeProduct(id: string, symbol: string): Product {
  return {
    id,
    name: id,
    network: 'mainnet',
    pool: '0xpool',
    protocol: 'WisdomTree',
    token: { id: '0xtoken', address: '0xtoken', symbol, decimals: 18n, precision: 18n },
    interestRates: [],
    dailyInterestRates: [],
    hourlyInterestRates: [],
    weeklyInterestRates: [],
    rewardsInterestRates: [],
  } as unknown as Product
}

describe('WisdomTreeAprFetcher', () => {
  const logger = new Logger({ logLevel: 'SILENT' })
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(WTGXX_AGGREGATE), { status: 200 }))
  })

  afterEach(() => {
    fetchMock.mockRestore()
  })

  it('throws FetcherConfigError when the API key is missing', async () => {
    const fetcher = new WisdomTreeAprFetcher(logger, undefined)

    await expect(fetcher.getAprRates([makeProduct('x', 'WTGXX')], MAINNET)).rejects.toThrow(
      FetcherConfigError,
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps WTGXX products to the annualized dailyYieldMM metric', async () => {
    const fetcher = new WisdomTreeAprFetcher(logger, 'test-key')

    const rates = await fetcher.getAprRates([makeProduct('product-wtgxx', 'WTGXX')], MAINNET)

    expect(rates['product-wtgxx']).toEqual({
      rate: (WTGXX_AGGREGATE.value * 100).toString(),
      source: 'wisdomtree',
      asOf: Math.floor(Date.parse('2026-03-13T00:00:00Z') / 1000),
      metadata: expect.objectContaining({ ticker: 'WTGXX', metric: 'dailyYieldMM' }),
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dataspanapi.wisdomtree.com/funddetails/aggregates/?ticker=WTGXX',
      expect.objectContaining({ headers: { 'x-wt-dataspan-key': 'test-key' } }),
    )
  })

  it('picks the preferred metric and latest row from array responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          { ...WTGXX_AGGREGATE, metric: 'sevenDayYieldMM', value: 0.0351, dt: '2026-03-13' },
          { ...WTGXX_AGGREGATE, metric: 'dailyYieldMM', value: 0.0339, dt: '2026-03-12' },
          { ...WTGXX_AGGREGATE, metric: 'dailyYieldMM', value: 0.0343, dt: '2026-03-13' },
        ]),
        { status: 200 },
      ),
    )
    const fetcher = new WisdomTreeAprFetcher(logger, 'test-key')

    const rates = await fetcher.getAprRates([makeProduct('p', 'WTGXX')], MAINNET)

    expect(rates['p'].rate).toBe((0.0343 * 100).toString())
    expect(rates['p'].metadata).toEqual(expect.objectContaining({ metric: 'dailyYieldMM' }))
  })

  it('fetches each ticker only once per batch', async () => {
    const fetcher = new WisdomTreeAprFetcher(logger, 'test-key')
    const products = [makeProduct('a', 'WTGXX'), makeProduct('b', 'wtgxx')]

    const rates = await fetcher.getAprRates(products, MAINNET)

    expect(Object.keys(rates)).toEqual(['a', 'b'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('omits products with no fund mapping', async () => {
    const fetcher = new WisdomTreeAprFetcher(logger, 'test-key')

    const rates = await fetcher.getAprRates([makeProduct('x', 'USDC')], MAINNET)

    expect(rates).toEqual({})
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('omits products when the response has no usable metric, without throwing', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Not found.' }), { status: 200 }),
    )
    const fetcher = new WisdomTreeAprFetcher(logger, 'test-key')

    const rates = await fetcher.getAprRates([makeProduct('x', 'WTGXX')], MAINNET)

    expect(rates).toEqual({})
  })
})
