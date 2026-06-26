/**
 * Quick manual test for the registered offchain APR fetchers.
 *
 * Builds a sample product for every symbol each fetcher supports, runs every
 * registered protocol against its live provider API, and prints the resolved
 * rates. Failures are reported per protocol — configuration problems (e.g. a
 * missing API key) are surfaced with their remediation message.
 *
 * Usage, from background-jobs/update-offchain-apr:
 *   pnpm show-apr
 *   LOG_LEVEL=ERROR pnpm show-apr   # also show fetcher-internal logs
 *
 * Exits non-zero if any protocol failed or any symbol resolved no rate.
 */
import { Logger } from '@aws-lambda-powertools/logger'
import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId } from '@summerfi/serverless-shared'
import dotenv from 'dotenv'
import path from 'path'
import { AprService } from '../apr-service'

dotenv.config()
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Mainnet token addresses for symbols whose fetcher reads on-chain state from
 * the token contract (e.g. Benji walks the token's Transfer logs). Symbol-based
 * fetchers (Superstate/WisdomTree) ignore the address, so they need no entry.
 */
const SAMPLE_TOKEN_ADDRESS: Record<string, string> = {
  BENJI: '0x3ddc84940ab509c11b20b76b466933f40b750dc9',
}

function makeSampleProduct(protocol: string, symbol: string): Product {
  return {
    id: `${protocol.toLowerCase()}-${symbol.toLowerCase()}`,
    name: `${protocol} ${symbol} (sample)`,
    network: 'mainnet',
    pool: ZERO_ADDRESS,
    protocol,
    // The rates subgraph exposes the token address as the token entity `id`.
    token: {
      id: SAMPLE_TOKEN_ADDRESS[symbol.toUpperCase()] ?? ZERO_ADDRESS,
      symbol,
      decimals: '18',
      precision: '18',
    },
    interestRates: [],
    dailyInterestRates: [],
    hourlyInterestRates: [],
    weeklyInterestRates: [],
    rewardsInterestRates: [],
  } as unknown as Product
}

async function main() {
  const logLevel = (process.env.LOG_LEVEL as never) || 'SILENT'
  const logger = new Logger({ serviceName: 'show-apr', logLevel })
  const service = new AprService(logger)

  console.log(`Offchain APR — ${service.protocols.length} protocol(s) registered\n`)

  let failures = 0

  for (const protocol of service.protocols) {
    const fetcher = service.getFetcher(protocol)!
    const products = fetcher.supportedSymbols().map((symbol) => makeSampleProduct(protocol, symbol))

    console.log(protocol)

    try {
      const rates = await fetcher.getAprRates(products, ChainId.MAINNET)

      for (const product of products) {
        const rate = rates[product.id]
        const symbol = product.token.symbol.padEnd(8)

        if (rate) {
          const asOf = new Date(rate.asOf * 1000).toISOString().slice(0, 10)
          const metric = rate.metadata?.metric ? `  metric: ${rate.metadata.metric}` : ''
          console.log(
            `  ${symbol} ${Number(rate.rate).toFixed(2).padStart(7)}%   as of ${asOf}   source: ${rate.source}${metric}`,
          )
        } else {
          failures++
          console.log(
            `  ${symbol}       —    no rate resolved (re-run with LOG_LEVEL=ERROR for details)`,
          )
        }
      }
    } catch (error) {
      failures++
      const err = error as Error
      if (err.name === 'FetcherConfigError') {
        console.log(`  ✗ not configured: ${err.message}`)
      } else {
        console.log(`  ✗ failed: ${err.message}`)
      }
    }

    console.log()
  }

  if (failures > 0) {
    console.log(`${failures} problem(s) found`)
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
