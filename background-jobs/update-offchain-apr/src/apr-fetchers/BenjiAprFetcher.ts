import { Product } from '@summerfi/summer-earn-rates-subgraph'
import { ChainId, getRpcGatewayEndpoint, IRpcConfig } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import {
  Address,
  createPublicClient,
  erc20Abi,
  getAddress,
  http,
  parseAbiItem,
  PublicClient,
  zeroAddress,
} from 'viem'
import { mainnet } from 'viem/chains'
import { IAprFetcher, OffchainAprRate } from './IAprFetcher'
import { FetcherConfigError } from './errors'

/**
 * Offchain APR fetcher for Franklin Templeton's BENJI — the share token of the
 * Franklin OnChain U.S. Government Money Fund (FOBXX).
 *
 * Unlike WisdomTree/Superstate, BENJI has no public yield API: the rate lives
 * entirely on-chain. NAV is pegged at $1.00 and yield is paid by MINTING new
 * BENJI shares into each holder's wallet once per (business) day — i.e. an
 * ERC-20 `Transfer(from = 0x0)`. The mint is strictly proportional, so for any
 * holder:
 *
 *     dailyYield = mintValue / balanceBefore
 *
 * and that ratio is identical across holders (verified on mainnet: 3 holders,
 * one mint each per day, all at 0.009588%/day = 3.50% annualized). We annualize
 * with a simple ×365 (this is a base APR, not a compounded APY) and average the
 * last few daily distributions to ride out the small day-to-day yield steps.
 *
 * IMPORTANT — deriving `balanceBefore` without an archive node: the dividend is
 * computed on the holder's balance the instant *before* the mint. Rather than
 * read historical state (which needs an archive node), we anchor on the holder's
 * CURRENT balance and roll backward through the window's Transfer logs:
 *
 *     balanceBefore(mint) = balanceOf(holder, latestBlock)
 *                           − Σ signed deltas at/after the mint's position
 *
 * `balanceOf` at the latest block is plain current state (any node serves it)
 * and the rollback needs only `eth_getLogs`, which is archive-free. Each
 * transfer is classified — `from 0x0` is the dividend, anything else is a
 * principal change (deposit/withdrawal) — so the denominator stays correct even
 * when a holder moves tokens between distributions.
 *
 * Only Ethereum mainnet is enabled for now; BENJI is also on Base and Arbitrum,
 * but their `0x0` mint streams have not yet been confirmed to be dividend-only
 * (a subscription that mints from `0x0` would otherwise be miscounted — the
 * per-distribution median guards against it, but each chain should be probed
 * before enabling).
 */
export class BenjiAprFetcher implements IAprFetcher {
  /** Stable provider identifier persisted as `offchain_apr.source`. */
  static readonly SOURCE = 'benji'

  static readonly RPC_GATEWAY_ENV_VAR = 'RPC_GATEWAY'

  private readonly SUPPORTED_SYMBOLS = ['BENJI']

  /** Chains whose BENJI `0x0` mint stream has been verified as dividend-only. */
  private readonly VIEM_CHAIN_BY_CHAIN_ID: Partial<Record<ChainId, typeof mainnet>> = {
    [ChainId.MAINNET]: mainnet,
  }

  /** ~7 days at ~12s blocks — always captures several daily distributions. */
  private readonly LOOKBACK_BLOCKS = 50_400n
  /** Stay under typical `eth_getLogs` block-range caps on shared gateways. */
  private readonly LOG_CHUNK_BLOCKS = 10_000n
  /** Average this many of the most recent daily distributions. */
  private readonly DISTRIBUTIONS_TO_AVERAGE = 5
  private readonly DAYS_PER_YEAR = 365
  private readonly REQUEST_TIMEOUT_MS = 30_000

  private readonly rpcConfig: IRpcConfig = {
    skipCache: false,
    skipMulticall: false,
    skipGraph: true,
    stage: 'prod',
    source: 'update-offchain-apr',
  }

  private readonly logger: Logger
  private readonly rpcGatewayUrl: string | undefined
  /** Injection seam for tests; defaults to a real viem public client. */
  private readonly clientFactory?: (chainId: ChainId) => PublicClient

  constructor(
    logger: Logger,
    rpcGatewayUrl: string | undefined = process.env.RPC_GATEWAY,
    clientFactory?: (chainId: ChainId) => PublicClient,
  ) {
    this.logger = logger
    this.rpcGatewayUrl = rpcGatewayUrl
    this.clientFactory = clientFactory
  }

  supportedSymbols(): string[] {
    return [...this.SUPPORTED_SYMBOLS]
  }

  async getAprRates(
    products: Product[],
    chainId: ChainId,
  ): Promise<Record<string, OffchainAprRate>> {
    if (!this.clientFactory && !this.rpcGatewayUrl) {
      throw new FetcherConfigError(
        `RPC gateway is not configured — set ${BenjiAprFetcher.RPC_GATEWAY_ENV_VAR}`,
      )
    }

    const viemChain = this.VIEM_CHAIN_BY_CHAIN_ID[chainId]
    if (!viemChain) {
      // BENJI not verified on this chain; nothing to resolve here.
      return {}
    }

    const client = this.buildClient(chainId)
    const results: Record<string, OffchainAprRate> = {}

    // Several products can point at the same token (same BENJI on different
    // pools); resolve each contract once per batch.
    const yieldByToken = new Map<Address, Promise<DividendYield | null>>()

    for (const product of products) {
      const symbol = product.token.symbol.toUpperCase()
      if (!this.SUPPORTED_SYMBOLS.includes(symbol)) {
        this.logger.warn(
          `[BenjiAprFetcher] No BENJI mapping for token ${product.token.symbol} (product ${product.id}, chain ${chainId})`,
        )
        continue
      }

      // The rates subgraph stores the token's contract address as the token
      // entity id (a Bytes value); there is no separate `address` field.
      let token: Address
      try {
        token = getAddress(product.token.id)
      } catch {
        this.logger.warn(
          `[BenjiAprFetcher] Invalid token address for product ${product.id}: ${product.token.id}`,
        )
        continue
      }

      if (!yieldByToken.has(token)) {
        yieldByToken.set(token, this.resolveDividendYield(client, token))
      }

      const dividendYield = await yieldByToken.get(token)!
      if (!dividendYield) continue

      results[product.id] = {
        rate: (dividendYield.annualizedRate * 100).toString(),
        source: BenjiAprFetcher.SOURCE,
        asOf: dividendYield.asOf,
        metadata: {
          token,
          symbol,
          // decimal daily-yield fractions, newest first
          dailyYields: dividendYield.dailyYields,
          distributionsUsed: dividendYield.dailyYields.length,
          latestDistributionBlock: dividendYield.latestBlock.toString(),
        },
      }
    }

    return results
  }

  private buildClient(chainId: ChainId): PublicClient {
    if (this.clientFactory) return this.clientFactory(chainId)

    const endpoint = getRpcGatewayEndpoint(this.rpcGatewayUrl!, chainId, this.rpcConfig)
    return createPublicClient({
      chain: this.VIEM_CHAIN_BY_CHAIN_ID[chainId],
      transport: http(endpoint, { timeout: this.REQUEST_TIMEOUT_MS }),
    }) as PublicClient
  }

  /**
   * Resolves the annualized base APR for a BENJI token from its recent dividend
   * mints. Returns null (and logs) on any failure so one token never breaks the
   * batch.
   */
  private async resolveDividendYield(
    client: PublicClient,
    token: Address,
  ): Promise<DividendYield | null> {
    try {
      const latestBlock = await client.getBlockNumber()
      const fromBlock =
        latestBlock > this.LOOKBACK_BLOCKS ? latestBlock - this.LOOKBACK_BLOCKS : 0n

      // One chunked sweep of *all* token transfers in the window. Mints are the
      // subset sent from the zero address; the rest are the principal changes we
      // roll back through to recover each holder's pre-mint balance.
      const transfers = await this.fetchTransferLogs(client, token, fromBlock, latestBlock)
      const mints = transfers.filter((t) => t.from === zeroAddress)
      if (mints.length === 0) {
        throw new Error('No 0x0 mint (dividend) events found in lookback window')
      }

      // Each daily dividend is emitted within a single block; group by block and
      // keep the most recent few distributions.
      const mintsByBlock = new Map<bigint, TransferLog[]>()
      for (const mint of mints) {
        const group = mintsByBlock.get(mint.blockNumber) ?? []
        group.push(mint)
        mintsByBlock.set(mint.blockNumber, group)
      }
      const distributionBlocks = [...mintsByBlock.keys()]
        .sort((a, b) => (a > b ? -1 : 1)) // newest first
        .slice(0, this.DISTRIBUTIONS_TO_AVERAGE)

      // Anchor each recipient on its CURRENT balance (no archive needed).
      const recipients = new Set<Address>()
      for (const block of distributionBlocks) {
        for (const mint of mintsByBlock.get(block)!) recipients.add(mint.to)
      }
      const balanceAtLatest = new Map<Address, bigint>()
      for (const holder of recipients) {
        balanceAtLatest.set(
          holder,
          await client.readContract({
            address: token,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [holder],
            blockNumber: latestBlock,
          }),
        )
      }

      // Signed deltas of every windowed transfer that touches a recipient, so we
      // can undo balance changes from `latestBlock` back to any mint.
      const deltasByHolder = new Map<Address, BalanceDelta[]>()
      for (const t of transfers) {
        if (recipients.has(t.to)) {
          pushDelta(deltasByHolder, t.to, t.blockNumber, t.logIndex, t.value)
        }
        if (recipients.has(t.from)) {
          pushDelta(deltasByHolder, t.from, t.blockNumber, t.logIndex, -t.value)
        }
      }

      const dailyYields: number[] = []
      for (const block of distributionBlocks) {
        const ratio = this.dailyYieldForDistribution(
          mintsByBlock.get(block)!,
          balanceAtLatest,
          deltasByHolder,
        )
        if (ratio !== null) dailyYields.push(ratio)
      }
      if (dailyYields.length === 0) {
        throw new Error('Could not compute a daily yield from any distribution')
      }

      const averageDailyYield = dailyYields.reduce((sum, r) => sum + r, 0) / dailyYields.length
      const latestDistributionBlock = distributionBlocks[0]
      const asOf = await this.blockTimestamp(client, latestDistributionBlock)

      return {
        annualizedRate: averageDailyYield * this.DAYS_PER_YEAR,
        asOf,
        dailyYields,
        latestBlock: latestDistributionBlock,
      }
    } catch (error) {
      this.logger.error(`[BenjiAprFetcher] Error resolving dividend yield for token ${token}:`, {
        error: error as Error,
      })
      return null
    }
  }

  /**
   * Median of `mintValue / balanceBefore` across the recipients of one daily
   * distribution. `balanceBefore` is reconstructed by rolling each holder's
   * current balance back through every transfer at or after the mint (the mint
   * itself included), so deposits/withdrawals since the mint are undone — no
   * historical state read required. New holders (balanceBefore <= 0) and any
   * non-conforming mint fall away from the median.
   */
  private dailyYieldForDistribution(
    mints: TransferLog[],
    balanceAtLatest: Map<Address, bigint>,
    deltasByHolder: Map<Address, BalanceDelta[]>,
  ): number | null {
    const ratios: number[] = []

    for (const mint of mints) {
      const anchor = balanceAtLatest.get(mint.to)
      const deltas = deltasByHolder.get(mint.to)
      if (anchor === undefined || deltas === undefined) continue

      // Undo every delta at or after this mint's position to get the pre-mint
      // balance (subtracting a signed delta reverses credits and debits alike).
      let balanceBefore = anchor
      for (const delta of deltas) {
        if (isAtOrAfter(delta, mint)) balanceBefore -= delta.value
      }
      if (balanceBefore <= 0n) continue // first mint to this holder, or inconsistent

      // Both are 18-dp integers far beyond Number.MAX_SAFE_INTEGER, so divide in
      // bigint fixed-point first; the ratio is dimensionless (decimals cancel).
      const scaledRatio = (mint.value * RATIO_SCALE) / balanceBefore
      ratios.push(Number(scaledRatio) / Number(RATIO_SCALE))
    }

    if (ratios.length === 0) return null
    return median(ratios)
  }

  /** Fetches all `Transfer` logs in chunks to respect gateway block-range caps. */
  private async fetchTransferLogs(
    client: PublicClient,
    token: Address,
    fromBlock: bigint,
    toBlock: bigint,
  ): Promise<TransferLog[]> {
    const logs: TransferLog[] = []

    for (let start = fromBlock; start <= toBlock; start += this.LOG_CHUNK_BLOCKS) {
      const end =
        start + this.LOG_CHUNK_BLOCKS - 1n < toBlock ? start + this.LOG_CHUNK_BLOCKS - 1n : toBlock

      const chunk = await client.getLogs({
        address: token,
        event: TRANSFER_EVENT,
        fromBlock: start,
        toBlock: end,
      })

      for (const log of chunk) {
        const { from, to, value } = log.args
        if (
          from !== undefined &&
          to !== undefined &&
          value !== undefined &&
          log.blockNumber !== null &&
          log.logIndex !== null
        ) {
          logs.push({ blockNumber: log.blockNumber, logIndex: log.logIndex, from, to, value })
        }
      }
    }

    return logs
  }

  private async blockTimestamp(client: PublicClient, blockNumber: bigint): Promise<number> {
    const block = await client.getBlock({ blockNumber })
    return Number(block.timestamp)
  }
}

const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

/** 18-dp fixed-point scale for the dimensionless yield ratio. */
const RATIO_SCALE = 10n ** 18n

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function pushDelta(
  map: Map<Address, BalanceDelta[]>,
  holder: Address,
  blockNumber: bigint,
  logIndex: number,
  value: bigint,
): void {
  const deltas = map.get(holder) ?? []
  deltas.push({ blockNumber, logIndex, value })
  map.set(holder, deltas)
}

/** True if `a` is at the same position as, or after, `b` in (block, logIndex) order. */
function isAtOrAfter(a: BalanceDelta, b: TransferLog): boolean {
  if (a.blockNumber !== b.blockNumber) return a.blockNumber > b.blockNumber
  return a.logIndex >= b.logIndex
}

interface TransferLog {
  blockNumber: bigint
  logIndex: number
  from: Address
  to: Address
  value: bigint
}

/** A signed balance change for one holder: positive credit, negative debit. */
interface BalanceDelta {
  blockNumber: bigint
  logIndex: number
  value: bigint
}

interface DividendYield {
  /** Annualized base APR as a decimal fraction (e.g. 0.035 for 3.5%). */
  annualizedRate: number
  /** Unix seconds of the latest distribution block. */
  asOf: number
  /** Per-distribution daily-yield fractions, newest first. */
  dailyYields: number[]
  /** Block of the latest distribution used. */
  latestBlock: bigint
}
