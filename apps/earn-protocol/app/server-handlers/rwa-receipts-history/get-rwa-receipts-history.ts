import { BigNumber } from 'bignumber.js'
import { GraphQLClient } from 'graphql-request'

import {
  GetRwaReceiptsHistoryPageDocument,
  type GetRwaReceiptsHistoryPageQuery,
  GetRwaRoundsVaultPairDocument,
  type GetRwaRoundsVaultPairQuery,
  ReceiptActivityType,
  RoundState,
  RoundsVaultFlavor,
} from '@/graphql/clients/rwa-receipts-history/client'

// ---------------------------------------------------------------------------
// Subgraph access
// ---------------------------------------------------------------------------
// The RWA (rounds-vault) subgraph keeps a permanent, append-only ReceiptActivity feed plus
// per-round timestamps (openedAt / settledAt). Unlike `useRwaReceipts` / `getRwaReceipts` (which
// read live ERC-1155 balances through the SDK and only surface receipts with balance > 0), this
// queries the subgraph directly (queries live in graphql/queries/rwa-receipts-history.graphql) so we
// can render the full dated history INCLUDING already-claimed (balance 0) deposits and withdrawals.
//
// graph-node rejects a 2-level-deep nested filter (receipt -> vault -> pair -> targetVault), so we
// first resolve the fleet's Input/Output rounds-vault addresses from its pair and then page the
// receipts per side by exact `vault` id (a supported 1-level filter). Input -> deposits /
// Output -> withdrawals (derived from `vault.flavor`).

// Codegen types the subgraph's BigInt scalars as `number`, but The Graph serialises them as strings
// at runtime; we wrap every numeric field in BigInt()/BigNumber()/Number(), which accept both
// representations and preserve precision for large (18-decimal) balances.
type HistoryReceipt = GetRwaReceiptsHistoryPageQuery['receipts'][number]

// ---------------------------------------------------------------------------
// JSON-safe row model returned to the client
// ---------------------------------------------------------------------------
export type RwaReceiptHistorySide = 'deposit' | 'withdrawal'

/**
 * Derived lifecycle status of a single receipt (round) for the connected wallet:
 *  - `cancellable` round Opened, balance held → pending deposit/withdrawal request
 *  - `pending`     round In Settlement, balance held → awaiting settlement, no action
 *  - `claimable`   round Settled, balance held → claim shares (deposit) / assets (withdrawal)
 *  - `completed`   balance 0 → already claimed (or cancelled)
 */
export type RwaReceiptHistoryStatus = 'cancellable' | 'pending' | 'claimable' | 'completed'

export type RwaReceiptHistoryRoundState = 'OPENED' | 'IN_SETTLEMENT' | 'SETTLED'

export type RwaReceiptHistoryRow = {
  id: string
  side: RwaReceiptHistorySide
  roundId: string
  roundState: RwaReceiptHistoryRoundState
  status: RwaReceiptHistoryStatus
  // Raw ERC-1155 balance (bigint string) — needed to reconstruct a claim/cancel action client-side.
  balance: string
  // Unix seconds of the deposit/withdrawal request and of round settlement (null when unavailable).
  requestedAt: number | null
  settledAt: number | null
  // Principal in its natural unit (decimal string): deposits → USDC deposited; withdrawals → the
  // fleet shares submitted. The client converts withdrawal shares to USDC for display.
  principalAmount: string | null
  // The realised counter-asset received at settlement (sum of REDEEM_EXCHANGE), decimal string:
  // withdrawals → USDC; deposits → fleet shares. Null until claimed. `settledSymbol` is its token.
  settledAmount: string | null
  settledSymbol: string | null
  // Transaction hashes for the expandable details: the (first) deposit/withdraw request and the
  // exchange claim (when claimed). Null when unavailable.
  requestTxHash: string | null
  claimTxHash: string | null
}

// One backend page of a single side's history.
export type RwaReceiptsHistoryPage = {
  rows: RwaReceiptHistoryRow[]
  page: number
  hasMore: boolean
}

const ZERO = new BigNumber(0)

// Sum the realised counter-asset amount across all activities of a given type in a receipt. A
// receipt can carry several DEPOSITs (the user added to a round multiple times), partial
// REDEEM_CURRENT cancels, and several REDEEM_EXCHANGE claims — so the figures must be aggregated.
const sumAssetAmount = (
  activities: HistoryReceipt['activities'],
  type: ReceiptActivityType,
): BigNumber =>
  activities
    .filter((activity) => activity.type === type)
    .reduce((acc, activity) => acc.plus(activity.assetAmount ?? 0), ZERO)

const firstActivity = (activities: HistoryReceipt['activities'], type: ReceiptActivityType) =>
  activities.find((activity) => activity.type === type)

const toUnixSeconds = (raw: number | null | undefined): number | null => {
  if (raw == null) {
    return null
  }

  const parsed = Number(raw)

  return Number.isFinite(parsed) ? parsed : null
}

const toRoundStateString = (state: RoundState): RwaReceiptHistoryRoundState => {
  if (state === RoundState.OPENED) {
    return 'OPENED'
  }
  if (state === RoundState.IN_SETTLEMENT) {
    return 'IN_SETTLEMENT'
  }

  return 'SETTLED'
}

const deriveStatus = (balance: bigint, state: RoundState): RwaReceiptHistoryStatus => {
  if (balance === 0n) {
    return 'completed'
  }
  if (state === RoundState.SETTLED) {
    return 'claimable'
  }
  if (state === RoundState.OPENED) {
    return 'cancellable'
  }

  return 'pending'
}

const mapReceipt = (receipt: HistoryReceipt): RwaReceiptHistoryRow => {
  const side: RwaReceiptHistorySide =
    receipt.vault.flavor === RoundsVaultFlavor.INPUT ? 'deposit' : 'withdrawal'
  const { activities } = receipt
  const balance = BigInt(receipt.balance)

  // The DEPOSIT(s) carry the principal + the request timestamp; REDEEM_CURRENT is a (partial)
  // cancel that returns deposit; REDEEM_EXCHANGE is the settled claim (realised payout).
  const firstDeposit = firstActivity(activities, ReceiptActivityType.DEPOSIT)
  const depositDecimals = firstDeposit?.assetToken?.decimals
  // Net principal that entered settlement = deposited minus same-round cancellations.
  const principalRaw = sumAssetAmount(activities, ReceiptActivityType.DEPOSIT).minus(
    sumAssetAmount(activities, ReceiptActivityType.REDEEM_CURRENT),
  )

  const firstRedeem = firstActivity(activities, ReceiptActivityType.REDEEM_EXCHANGE)
  const redeemDecimals = firstRedeem?.assetToken?.decimals
  const settledRaw = sumAssetAmount(activities, ReceiptActivityType.REDEEM_EXCHANGE)
  const hasSettled = redeemDecimals != null && settledRaw.gt(ZERO)

  return {
    id: receipt.id,
    side,
    roundId: receipt.round.roundId.toString(),
    roundState: toRoundStateString(receipt.round.state),
    status: deriveStatus(balance, receipt.round.state),
    balance: receipt.balance.toString(),
    requestedAt: toUnixSeconds(firstDeposit?.timestamp ?? receipt.round.openedAt),
    settledAt: toUnixSeconds(receipt.round.settledAt),
    principalAmount:
      firstDeposit && depositDecimals != null
        ? BigNumber.max(principalRaw, ZERO).shiftedBy(-depositDecimals).toString()
        : null,
    // The realised counter-asset received, summed from the exchange redemptions.
    settledAmount: hasSettled ? settledRaw.shiftedBy(-redeemDecimals).toString() : null,
    settledSymbol: hasSettled ? (firstRedeem?.assetToken?.symbol ?? null) : null,
    requestTxHash: firstDeposit?.txHash ?? null,
    claimTxHash: firstRedeem?.txHash ?? null,
  }
}

// Drop receipts with no economic outcome: nothing currently held (balance 0), nothing settled, and
// zero net principal — i.e. a fully-cancelled round. Showing a "0 USDC / Completed" row is noise.
const isEmptyRow = (row: RwaReceiptHistoryRow): boolean =>
  row.balance === '0' &&
  row.settledAmount == null &&
  (row.principalAmount == null || new BigNumber(row.principalAmount).isZero())

// ---------------------------------------------------------------------------
// Rounds-vault pair resolution (fleet → Input/Output vault addresses)
// ---------------------------------------------------------------------------
type RoundsVaultIds = { inputVaultId: string; outputVaultId: string }

// Pair addresses are immutable once registered, so cache successful lookups for the lifetime of the
// server instance (keyed by endpoint + fleet). Misses are not cached, so a not-yet-indexed fleet
// can resolve on a later request.
const pairCache = new Map<string, RoundsVaultIds>()

const resolveRoundsVaultIds = async (
  subgraphUrl: string,
  fleetAddress: string,
): Promise<RoundsVaultIds | null> => {
  const fleet = fleetAddress.toLowerCase()
  const cacheKey = `${subgraphUrl}::${fleet}`
  const cached = pairCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const client = new GraphQLClient(subgraphUrl)
  const { roundsVaultPairs } = await client.request<GetRwaRoundsVaultPairQuery>(
    GetRwaRoundsVaultPairDocument,
    { fleet },
    { origin: 'earn-protocol-app' },
  )

  if (roundsVaultPairs.length === 0) {
    return null
  }

  const [pair] = roundsVaultPairs
  const inputVaultId = pair.inputVault?.id
  const outputVaultId = pair.outputVault?.id

  if (!inputVaultId || !outputVaultId) {
    return null
  }

  const ids: RoundsVaultIds = { inputVaultId, outputVaultId }

  pairCache.set(cacheKey, ids)

  return ids
}

/**
 * Loads one backend page of the connected wallet's RWA deposit OR withdrawal history for a single
 * fleet from the institutions subgraph. Fetches `limit + 1` to detect a further page. Additive to
 * the page, so it degrades to an empty page rather than throwing.
 */
export const fetchRwaReceiptsHistoryPage = async ({
  subgraphUrl,
  fleetAddress,
  walletAddress,
  side,
  page,
  limit,
}: {
  subgraphUrl: string
  fleetAddress: string
  walletAddress: string
  side: RwaReceiptHistorySide
  page: number
  limit: number
}): Promise<RwaReceiptsHistoryPage> => {
  const emptyPage: RwaReceiptsHistoryPage = { rows: [], page, hasMore: false }

  try {
    const ids = await resolveRoundsVaultIds(subgraphUrl, fleetAddress)

    if (!ids) {
      return emptyPage
    }

    const vault = side === 'deposit' ? ids.inputVaultId : ids.outputVaultId
    const client = new GraphQLClient(subgraphUrl)
    const { receipts } = await client.request<GetRwaReceiptsHistoryPageQuery>(
      GetRwaReceiptsHistoryPageDocument,
      {
        account: walletAddress.toLowerCase(),
        vault: vault.toLowerCase(),
        // One extra row beyond the page so we can tell whether a further page exists.
        first: limit + 1,
        skip: page * limit,
      },
      { origin: 'earn-protocol-app' },
    )

    const hasMore = receipts.length > limit
    const rows = receipts
      .slice(0, limit)
      .map(mapReceipt)
      .filter((row) => !isEmptyRow(row))

    return { rows, page, hasMore }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetchRwaReceiptsHistoryPage failed', error)

    return emptyPage
  }
}
