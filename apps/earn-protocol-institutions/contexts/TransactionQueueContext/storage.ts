import { type SDKTransactionItem } from '@/contexts/TransactionQueueContext/types'

const STORAGE_PREFIX = 'txQueue:v1'

/**
 * The active localStorage partition key, or null when there is no active
 * institution/user (e.g. logged out or a non-institution route). One queue per
 * institution + app-user; network is intentionally NOT part of the key.
 */
export const getPartitionKey = ({
  institutionName,
  userId,
}: {
  institutionName?: string
  userId?: string
}): string | null => {
  if (!institutionName || !userId) return null

  return `${STORAGE_PREFIX}:${institutionName.toLowerCase()}:${userId}`
}

// BigInt is not JSON-serializable. Tag it on the way out, restore it on the way in.
const replacer = (_key: string, value: unknown) =>
  typeof value === 'bigint' ? { __bigint__: value.toString() } : value

const reviver = (_key: string, value: unknown) => {
  if (
    value !== null &&
    typeof value === 'object' &&
    '__bigint__' in (value as { [key: string]: unknown })
  ) {
    return BigInt((value as { __bigint__: string }).__bigint__)
  }

  return value
}

export const serializeQueue = (items: SDKTransactionItem[]): string =>
  JSON.stringify(items, replacer)

/**
 * Parse a persisted queue. Drops items whose transaction preparation had not
 * resolved at save time (no `txData.transaction`) — they cannot be executed and
 * cannot be re-derived after a reload.
 */
export const deserializeQueue = (raw: string): SDKTransactionItem[] => {
  try {
    const parsed = JSON.parse(raw, reviver) as unknown

    if (!Array.isArray(parsed)) return []

    return (parsed as SDKTransactionItem[]).filter((item) => !!item.txData?.transaction)
  } catch {
    return []
  }
}

export const loadPartition = (key: string): SDKTransactionItem[] => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(key)

  return raw ? deserializeQueue(raw) : []
}

export const savePartition = (key: string, items: SDKTransactionItem[]): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, serializeQueue(items))
  } catch {
    // Quota / serialization failures are non-fatal — the in-memory queue still works.
  }
}
