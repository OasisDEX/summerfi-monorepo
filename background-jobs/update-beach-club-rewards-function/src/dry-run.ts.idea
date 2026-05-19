#!/usr/bin/env node

/**
 * Dry-run — uses live subgraph data but no database.
 * Simulates the last 2 days of processing and writes results to dry-run-output.json.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { ReferralClient } from './client'
import { Logger } from '@aws-lambda-powertools/logger'
import { Account, AssetVolatility, HourlySnapshot, ReferralCodeType } from './types'

// ---------------------------------------------------------------------------
// Config defaults (mirrors ConfigService DB defaults)
// ---------------------------------------------------------------------------

const CONFIG = {
  activeUserThresholdUsd: 1,
  pointsFormulaBase: 0.00005,
  pointsFormulaLogMultiplier: 0.0005,
}

const FEE_CONFIG: Record<AssetVolatility, Record<ReferralCodeType, { referrerRate: number; ownerRate: number }>> = {
  [AssetVolatility.VOLATILE]: {
    [ReferralCodeType.USER]:       { referrerRate: 0.00025, ownerRate: 0.00015 },
    [ReferralCodeType.INTEGRATOR]: { referrerRate: 0.0005,  ownerRate: 0 },
    [ReferralCodeType.TEST]:       { referrerRate: 0.0005,  ownerRate: 0 },
    [ReferralCodeType.INVALID]:    { referrerRate: 0,       ownerRate: 0 },
  },
  [AssetVolatility.STABLE]: {
    [ReferralCodeType.USER]:       { referrerRate: 0.0005,  ownerRate: 0.00025 },
    [ReferralCodeType.INTEGRATOR]: { referrerRate: 0.001,   ownerRate: 0 },
    [ReferralCodeType.TEST]:       { referrerRate: 0.0005,  ownerRate: 0 },
    [ReferralCodeType.INVALID]:    { referrerRate: 0,       ownerRate: 0 },
  },
}

// ---------------------------------------------------------------------------
// SUMR pricing and tiers (mirrors db.ts)
// ---------------------------------------------------------------------------

const JANUARY_27_2026 = new Date('2026-01-27T00:00:00.000Z')
const MARCH_1_2026    = new Date('2026-03-01T00:00:00.000Z')
const SUMR_TOKEN_PRICE_USD_PRE_TRADING        = 0.25
const SUMR_TOKEN_PRICE_USD_POST_TRADING_FALLBACK = 0.002

const SUMR_TIERS_PRE_MARCH_2026  = [
  { maxAmount: 10000,    percentage: 0.001 },
  { maxAmount: 100000,   percentage: 0.002 },
  { maxAmount: 250000,   percentage: 0.003 },
  { maxAmount: 500000,   percentage: 0.004 },
  { maxAmount: Infinity, percentage: 0.005 },
]
const SUMR_TIERS_POST_MARCH_2026 = [
  { maxAmount: 10000,    percentage: 0.0002 },
  { maxAmount: 100000,   percentage: 0.0004 },
  { maxAmount: 250000,   percentage: 0.0006 },
  { maxAmount: 500000,   percentage: 0.0008 },
  { maxAmount: Infinity, percentage: 0.001  },
]

async function fetchSumrPrice(logger: Logger): Promise<number> {
  const now = new Date()
  if (now < JANUARY_27_2026) return SUMR_TOKEN_PRICE_USD_PRE_TRADING
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=summer-2&vs_currencies=usd',
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { 'summer-2': { usd: number } }
    const price = data['summer-2']?.usd
    if (!price || price <= 0) throw new Error(`Invalid price: ${price}`)
    logger.info(`💲 SUMR price from CoinGecko: $${price}`)
    return price
  } catch (err) {
    logger.warn(`CoinGecko unavailable, using fallback $${SUMR_TOKEN_PRICE_USD_POST_TRADING_FALLBACK}`, { error: err as Error })
    return SUMR_TOKEN_PRICE_USD_POST_TRADING_FALLBACK
  }
}

function getSumrTierPercentage(depositUsd: number, now: Date): number {
  const tiers = now >= MARCH_1_2026 ? SUMR_TIERS_POST_MARCH_2026 : SUMR_TIERS_PRE_MARCH_2026
  return (tiers.find((t) => depositUsd <= t.maxAmount) ?? tiers[tiers.length - 1]).percentage
}

// ---------------------------------------------------------------------------
// Snapshot helpers (mirrors processor.ts)
// ---------------------------------------------------------------------------

function getLatestSnapshot(
  snapshots: HourlySnapshot[] | undefined,
  periodStart: Date,
  periodEnd: Date,
): HourlySnapshot | null {
  if (!snapshots?.length) return null
  const relevant = snapshots.filter((s) => {
    const t = new Date(Number(s.timestamp) * 1000)
    return t >= periodStart && t <= periodEnd
  })
  if (!relevant.length) return null
  return relevant.reduce((a, b) => (Number(b.timestamp) > Number(a.timestamp) ? b : a))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const logger = new Logger({ serviceName: 'dry-run', logLevel: 'INFO' })
  const client = new ReferralClient(logger)

  const periodEnd   = new Date()
  periodEnd.setMinutes(0, 0, 0)
  const periodStart = new Date(periodEnd.getTime() - 2 * 24 * 60 * 60 * 1000)

  const timestampGt = BigInt(Math.floor(periodStart.getTime() / 1000))
  const timestampLt = BigInt(Math.floor(periodEnd.getTime() / 1000))

  // Fetch ALL referred accounts from program start, not just the 2-day window
  const programStart = new Date('2025-05-27T00:00:00.000Z')
  const allTimeGt = BigInt(Math.floor(programStart.getTime() / 1000))

  logger.info(`📅 Snapshot period: ${periodStart.toISOString()} → ${periodEnd.toISOString()}`)
  logger.info(`📅 Fetching all accounts since program start: ${programStart.toISOString()}`)

  // 1. Fetch all referred accounts across all chains since program start
  logger.info('📡 Fetching all referred accounts from subgraphs...')
  const allAccounts: Account[] = []
  for (const chain of ['mainnet', 'arbitrum', 'base', 'sonic', 'hyperliquid'] as const) {
    const accounts = await client.getReferredAccounts(chain, {
      timestampGt: allTimeGt.toString(),
      timestampLt: timestampLt.toString(),
    })
    logger.info(`   ${chain}: ${accounts.length} referred accounts`)
    logger.info(`   sample: ${JSON.stringify(accounts.slice(0, 2))}`)
    allAccounts.push(...accounts.map((a) => ({ ...a, referralChain: chain })))
  }

  // Deduplicate — keep earliest referral timestamp per account
  const accountMap = new Map<string, Account>()
  for (const account of allAccounts) {
    const existing = accountMap.get(account.id)
    if (!existing || Number(account.referralTimestamp) < Number(existing.referralTimestamp)) {
      accountMap.set(account.id, account)
    }
  }
  const validAccounts = Array.from(accountMap.values())
  logger.info(`   ${validAccounts.length} unique referred accounts total`)
  logger.info(`   accounts with referralData: ${validAccounts.filter((a) => a.referralData?.id).length}`)

  const accountIds = validAccounts.map((a) => a.id)

  // 2. Fetch positions with hourly snapshots
  logger.info('📡 Fetching positions with hourly snapshots...')
  const positionsByChain = await client.getAllPositionsWithHourlySnapshots(accountIds, {
    timestampGt,
    timestampLt,
  })

  // Log positions diagnostic
  for (const [chain, accounts] of Object.entries(positionsByChain)) {
    const accs = accounts as Account[]
    logger.info(`   ${chain}: ${accs.length} accounts with positions data`)
    const withPositions = accs.filter((a) => a.positions && a.positions.length > 0)
    logger.info(`   ${chain}: ${withPositions.length} accounts have at least 1 position`)
  }

  // 3. Build per-account position data (mirrors preparePositionsUpdateData)
  // referralCode -> { depositUsd, referrerFeesUsdPerDay, ownerFeesUsdPerDay, feesPerDayCurrency }
  type CodeStats = {
    totalDepositUsd:        number
    activeUsers:            Set<string>
    referrerFeesPerDay:     number
    referrerFeesUsdPerDay:  number
    ownerFeesPerDay:        number
    ownerFeesUsdPerDay:     number
    feeCurrency:            string
  }

  const referralCodeMap = new Map<string, CodeStats>()
  const userDepositMap  = new Map<string, number>() // userId -> total deposit usd

  // Build a lookup from accountId -> referralCodeId
  const accountToCode = new Map<string, string>()
  for (const account of validAccounts) {
    if (account.referralData?.id) {
      accountToCode.set(account.id, account.referralData.id)
    }
  }

  for (const [chain, accounts] of Object.entries(positionsByChain)) {
    for (const account of accounts as Account[]) {
      const codeId = accountToCode.get(account.id)
      if (!codeId || !account.positions) continue

      if (!referralCodeMap.has(codeId)) {
        referralCodeMap.set(codeId, {
          totalDepositUsd: 0,
          activeUsers: new Set(),
          referrerFeesPerDay: 0,
          referrerFeesUsdPerDay: 0,
          ownerFeesPerDay: 0,
          ownerFeesUsdPerDay: 0,
          feeCurrency: 'USD',
        })
      }

      const codeStats = referralCodeMap.get(codeId)!

      for (const position of account.positions) {
        const snap = getLatestSnapshot(position.hourlySnapshots, periodStart, periodEnd)
        const depositUsd   = snap
          ? Number(snap.inputTokenBalanceNormalizedInUSD)
          : Number(position.inputTokenBalanceNormalizedInUSD)
        const depositAsset = snap
          ? Number(snap.inputTokenBalanceNormalized)
          : Number(position.inputTokenBalanceNormalized)

        const symbol     = position.vault.inputToken.symbol
        const volatility = symbol === 'WETH' ? AssetVolatility.VOLATILE : AssetVolatility.STABLE
        const feeRates   = FEE_CONFIG[volatility][ReferralCodeType.USER]

        const prevDeposit = userDepositMap.get(account.id) ?? 0
        userDepositMap.set(account.id, prevDeposit + depositUsd)

        codeStats.totalDepositUsd       += depositUsd
        codeStats.referrerFeesPerDay    += (depositAsset * feeRates.referrerRate) / 365
        codeStats.referrerFeesUsdPerDay += (depositUsd   * feeRates.referrerRate) / 365
        codeStats.ownerFeesPerDay       += (depositAsset * feeRates.ownerRate)    / 365
        codeStats.ownerFeesUsdPerDay    += (depositUsd   * feeRates.ownerRate)    / 365
        codeStats.feeCurrency            = symbol
      }
    }
  }

  // Determine active users
  for (const [userId, totalDeposit] of userDepositMap) {
    const codeId = accountToCode.get(userId)
    if (!codeId) continue
    const stats = referralCodeMap.get(codeId)
    if (!stats) continue
    if (totalDeposit >= CONFIG.activeUserThresholdUsd) {
      stats.activeUsers.add(userId)
    }
  }

  // 4. Calculate rewards
  const now          = new Date()
  const sumrPrice    = await fetchSumrPrice(logger)
  const isSumrActive = now >= JANUARY_27_2026

  const results = Array.from(referralCodeMap.entries()).map(([codeId, stats]) => {
    const activeUsersCount = stats.activeUsers.size
    const deposit          = stats.totalDepositUsd

    const hourlyPoints = activeUsersCount > 0
      ? (deposit * (CONFIG.pointsFormulaBase + CONFIG.pointsFormulaLogMultiplier * Math.log(activeUsersCount + 1))) / 24
      : 0

    const hourlySumr = isSumrActive && activeUsersCount > 0 && deposit > 0
      ? (deposit * getSumrTierPercentage(deposit, now)) / sumrPrice / 8760
      : 0

    const dailyFees    = stats.referrerFeesPerDay    + stats.ownerFeesPerDay
    const dailyFeesUsd = stats.referrerFeesUsdPerDay + stats.ownerFeesUsdPerDay

    return {
      referralCodeId: codeId,
      inputs: {
        totalDepositUsd:    +deposit.toFixed(2),
        activeUsersCount,
      },
      hourly: {
        points:                      +hourlyPoints.toFixed(6),
        sumr:                        +hourlySumr.toFixed(6),
        [`fees_${stats.feeCurrency}`]: +(dailyFees / 24).toFixed(6),
        fees_usd:                    +(dailyFeesUsd / 24).toFixed(6),
      },
      daily: {
        points:                      +(hourlyPoints * 24).toFixed(6),
        sumr:                        +(hourlySumr   * 24).toFixed(6),
        [`fees_${stats.feeCurrency}`]: +dailyFees.toFixed(6),
        fees_usd:                    +dailyFeesUsd.toFixed(6),
      },
    }
  })

  // 5. Write output
  const output = {
    simulatedAt: now.toISOString(),
    periodStart:  periodStart.toISOString(),
    periodEnd:    periodEnd.toISOString(),
    config:       CONFIG,
    sumrPrice,
    sumrTierSet:  now >= MARCH_1_2026 ? 'post-March-2026' : 'pre-March-2026',
    totalReferralCodes: results.length,
    totalActiveUsers:   [...new Set(results.flatMap(() => []))].length,
    results,
  }

  const outputPath = path.join(__dirname, '../dry-run-output.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
  logger.info(`✅ Results written to ${outputPath}`)
  logger.info(`   Referral codes processed: ${results.length}`)
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
