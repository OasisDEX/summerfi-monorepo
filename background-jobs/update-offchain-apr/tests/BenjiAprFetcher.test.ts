import { Logger } from '@aws-lambda-powertools/logger'
// Type-only imports: these workspace packages ship ESM, which this package's
// CJS ts-jest transform cannot load at runtime.
import type { Product } from '@summerfi/summer-earn-rates-subgraph'
import type { ChainId } from '@summerfi/serverless-shared'
import type { PublicClient } from 'viem'
import { BenjiAprFetcher } from '../src/apr-fetchers/BenjiAprFetcher'
import { FetcherConfigError } from '../src/apr-fetchers/errors'

const MAINNET = 1 as ChainId
const ARBITRUM = 42161 as ChainId

const BENJI = '0x3ddc84940ab509c11b20b76b466933f40b750dc9'
const ZERO = '0x0000000000000000000000000000000000000000'
const A = '0x' + 'a'.repeat(40)
const B = '0x' + 'b'.repeat(40)
const C = '0x' + 'c'.repeat(40)
const EXT = '0x' + 'e'.repeat(40)

const e18 = (n: number): bigint => BigInt(n) * 10n ** 18n

interface RawLog {
  args: { from: string; to: string; value: bigint }
  blockNumber: bigint
  logIndex: number
}

function mint(to: string, value: bigint, blockNumber: bigint, logIndex: number): RawLog {
  return { args: { from: ZERO, to, value }, blockNumber, logIndex }
}
function transfer(
  from: string,
  to: string,
  value: bigint,
  blockNumber: bigint,
  logIndex: number,
): RawLog {
  return { args: { from, to, value }, blockNumber, logIndex }
}

function makeClient(opts: {
  logs: RawLog[]
  balances: Record<string, bigint>
  latestBlock?: bigint
  timestamp?: bigint
}) {
  const { logs, balances, latestBlock = 1000n, timestamp = 1_700_000_000n } = opts
  return {
    getBlockNumber: jest.fn(async () => latestBlock),
    getLogs: jest.fn(async () => logs),
    readContract: jest.fn(async ({ args }: { args: readonly unknown[] }) => {
      const holder = (args[0] as string).toLowerCase()
      return balances[holder] ?? 0n
    }),
    getBlock: jest.fn(async () => ({ timestamp })),
  } as unknown as PublicClient
}

function makeProduct(id: string, symbol: string, address = BENJI): Product {
  return {
    id,
    name: id,
    network: 'mainnet',
    pool: '0xpool',
    protocol: 'Benji',
    // The rates subgraph exposes the token address as the token entity `id`.
    token: { id: address, symbol, decimals: '18', precision: '18' },
    interestRates: [],
    dailyInterestRates: [],
    hourlyInterestRates: [],
    weeklyInterestRates: [],
    rewardsInterestRates: [],
  } as unknown as Product
}

describe('BenjiAprFetcher', () => {
  const logger = new Logger({ logLevel: 'SILENT' })

  it('throws FetcherConfigError when neither gateway nor client factory is given', async () => {
    const fetcher = new BenjiAprFetcher(logger, undefined)

    await expect(fetcher.getAprRates([makeProduct('x', 'BENJI')], MAINNET)).rejects.toThrow(
      FetcherConfigError,
    )
  })

  it('computes the daily yield and reconstructs balanceBefore across a deposit and a withdrawal', async () => {
    // One distribution at block 900 (latest 1000). Daily yield = 0.0001 (3.65% annualized).
    //   A: balanceBefore 1,000,000 → mint 100; then a 500,000 DEPOSIT arrives after the mint.
    //   B: balanceBefore 2,000,000 → mint 200; then a 300,000 WITHDRAWAL leaves after the mint.
    const logs: RawLog[] = [
      mint(A, e18(100), 900n, 0),
      mint(B, e18(200), 900n, 1),
      transfer(EXT, A, e18(500_000), 950n, 0), // deposit into A (credit, not a mint)
      transfer(B, EXT, e18(300_000), 960n, 0), // withdrawal out of B (debit)
    ]
    // Anchors are the CURRENT balances = balanceBefore + mint ± later transfers.
    const balances = {
      [A.toLowerCase()]: e18(1_000_000) + e18(100) + e18(500_000), // 1,500,100
      [B.toLowerCase()]: e18(2_000_000) + e18(200) - e18(300_000), // 1,700,200
    }
    const client = makeClient({ logs, balances })
    const fetcher = new BenjiAprFetcher(logger, undefined, () => client)

    const rates = await fetcher.getAprRates([makeProduct('p', 'BENJI')], MAINNET)

    // Both recipients roll back to their true pre-mint balance → ratio 1e-4 → 3.65% APR.
    expect(Number(rates['p'].rate)).toBeCloseTo(3.65, 6)
    expect(rates['p'].source).toBe('benji')
    expect(rates['p'].asOf).toBe(1_700_000_000)
    expect(rates['p'].metadata).toEqual(
      expect.objectContaining({ symbol: 'BENJI', distributionsUsed: 1 }),
    )
  })

  it('takes the median per distribution, rejecting an anomalous mint', async () => {
    // A, B are proportional (ratio 1e-4); C gets the same 100 minted onto a tiny
    // balance (ratio 0.1) — a non-dividend outlier the median must reject.
    const logs: RawLog[] = [
      mint(A, e18(100), 900n, 0),
      mint(B, e18(200), 900n, 1),
      mint(C, e18(100), 900n, 2),
    ]
    const balances = {
      [A.toLowerCase()]: e18(1_000_000) + e18(100),
      [B.toLowerCase()]: e18(2_000_000) + e18(200),
      [C.toLowerCase()]: e18(1_000) + e18(100),
    }
    const fetcher = new BenjiAprFetcher(logger, undefined, () => makeClient({ logs, balances }))

    const rates = await fetcher.getAprRates([makeProduct('p', 'BENJI')], MAINNET)

    expect(Number(rates['p'].rate)).toBeCloseTo(3.65, 6)
  })

  it('returns nothing on a chain where BENJI is not enabled, without building a client', async () => {
    const factory = jest.fn(() => makeClient({ logs: [], balances: {} }))
    const fetcher = new BenjiAprFetcher(logger, undefined, factory)

    const rates = await fetcher.getAprRates([makeProduct('p', 'BENJI')], ARBITRUM)

    expect(rates).toEqual({})
    expect(factory).not.toHaveBeenCalled()
  })

  it('omits products whose token is not BENJI', async () => {
    const client = makeClient({ logs: [], balances: {} })
    const fetcher = new BenjiAprFetcher(logger, undefined, () => client)

    const rates = await fetcher.getAprRates([makeProduct('x', 'USDC')], MAINNET)

    expect(rates).toEqual({})
    expect(client.getLogs).not.toHaveBeenCalled()
  })

  it('resolves each token only once per batch', async () => {
    const logs: RawLog[] = [mint(A, e18(100), 900n, 0)]
    const balances = { [A.toLowerCase()]: e18(1_000_000) + e18(100) }
    const client = makeClient({ logs, balances })
    const fetcher = new BenjiAprFetcher(logger, undefined, () => client)

    const rates = await fetcher.getAprRates(
      [makeProduct('a', 'BENJI'), makeProduct('b', 'benji')],
      MAINNET,
    )

    expect(Object.keys(rates)).toEqual(['a', 'b'])
    expect(client.getLogs).toHaveBeenCalledTimes(1)
  })

  it('omits the product (without throwing) when there are no dividend mints', async () => {
    const client = makeClient({ logs: [transfer(A, B, e18(1), 900n, 0)], balances: {} })
    const fetcher = new BenjiAprFetcher(logger, undefined, () => client)

    const rates = await fetcher.getAprRates([makeProduct('p', 'BENJI')], MAINNET)

    expect(rates).toEqual({})
  })
})
