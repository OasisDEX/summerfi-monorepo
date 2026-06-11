import { Logger } from '@aws-lambda-powertools/logger'
// Type-only imports: these workspace packages ship ESM, which this package's
// CJS ts-jest transform cannot load at runtime.
import type { Product } from '@summerfi/summer-earn-rates-subgraph'
import type { ChainId } from '@summerfi/serverless-shared'
import { SuperstateAprFetcher } from '../src/apr-fetchers/SuperstateAprFetcher'

const MAINNET = 1 as ChainId

const USTB_YIELD = {
  as_of_date: '2026-06-09',
  thirty_day: 0.03576057317045661,
  seven_day: 0.03356214524891591,
  one_day: 0.03310560090115061,
}

const USCC_YIELD = {
  as_of_date: '2026-06-09',
  thirty_day: 0.03451186795988127,
  seven_day: -0.0025893463786210887,
  one_day: -0.0013085165218489605,
}

function makeProduct(id: string, symbol: string): Product {
  return {
    id,
    name: id,
    network: 'mainnet',
    pool: '0xpool',
    protocol: 'Superstate',
    token: { id: '0xtoken', address: '0xtoken', symbol, decimals: 6n, precision: 6n },
    interestRates: [],
    dailyInterestRates: [],
    hourlyInterestRates: [],
    weeklyInterestRates: [],
    rewardsInterestRates: [],
  } as unknown as Product
}

describe('SuperstateAprFetcher', () => {
  let fetcher: SuperstateAprFetcher
  let fetchMock: jest.SpyInstance

  beforeEach(() => {
    fetcher = new SuperstateAprFetcher(new Logger({ logLevel: 'SILENT' }))
    fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
      const body = String(url).includes('/funds/1/') ? USTB_YIELD : USCC_YIELD
      return new Response(JSON.stringify(body), { status: 200 })
    })
  })

  afterEach(() => {
    fetchMock.mockRestore()
  })

  it('maps USTB and USCC products to their fund yields', async () => {
    const products = [makeProduct('product-ustb', 'USTB'), makeProduct('product-uscc', 'USCC')]

    const rates = await fetcher.getAprRates(products, MAINNET)

    expect(rates['product-ustb']).toEqual({
      rate: (USTB_YIELD.thirty_day * 100).toString(),
      source: 'superstate',
      asOf: Math.floor(Date.parse('2026-06-09T00:00:00Z') / 1000),
      metadata: expect.objectContaining({ fundId: 1, symbol: 'USTB' }),
    })
    expect(rates['product-uscc']).toEqual(
      expect.objectContaining({
        rate: (USCC_YIELD.thirty_day * 100).toString(),
        source: 'superstate',
      }),
    )
    expect(rates['product-uscc'].metadata).toEqual(
      expect.objectContaining({ sevenDay: USCC_YIELD.seven_day, oneDay: USCC_YIELD.one_day }),
    )
  })

  it('fetches each fund only once per batch', async () => {
    const products = [makeProduct('a', 'USTB'), makeProduct('b', 'ustb'), makeProduct('c', 'USTB')]

    const rates = await fetcher.getAprRates(products, MAINNET)

    expect(Object.keys(rates)).toEqual(['a', 'b', 'c'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('omits products with no fund mapping', async () => {
    const rates = await fetcher.getAprRates([makeProduct('x', 'USDC')], MAINNET)

    expect(rates).toEqual({})
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('omits products when the yield response is malformed, without throwing', async () => {
    fetchMock.mockImplementation(
      async () => new Response(JSON.stringify({ as_of_date: '2026-06-09' }), { status: 200 }),
    )

    const rates = await fetcher.getAprRates([makeProduct('x', 'USTB')], MAINNET)

    expect(rates).toEqual({})
  })
})
