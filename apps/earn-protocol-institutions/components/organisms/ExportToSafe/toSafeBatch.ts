import { type SupportedNetworkIds } from '@summerfi/app-types'
import { sdkChainIdToHumanNetwork, slugify } from '@summerfi/app-utils'
import { type TransactionInfo } from '@summerfi/sdk-common'
import { keccak256, toBytes } from 'viem'

import { type SDKTransactionItem } from '@/contexts/TransactionQueueContext/types'

// Safe Transaction Builder export version this batch targets.
const TX_BUILDER_VERSION = '1.16.0'

type SafeBatchTransaction = {
  to: string
  value: string
  data: string
  contractMethod: null
  contractInputsValues: null
}

type SafeBatchFile = {
  version: '1.0'
  chainId: string
  createdAt: number
  meta: {
    name: string
    description: string
    txBuilderVersion: string
    createdFromSafeAddress: string
    createdFromOwnerAddress: string
    checksum?: string
  }
  transactions: SafeBatchTransaction[]
}

/**
 * A queued item can be exported only once its calldata is prepared (`txData.transaction`
 * present) and it has no error. Type-predicate so callers get `txData` narrowed.
 */
export const isExportable = (
  item: SDKTransactionItem,
): item is SDKTransactionItem & { txData: TransactionInfo } =>
  item.txData?.transaction != null && !item.txError

/**
 * A meaningful download filename for a chain's batch (Safe Transaction Builder imports a file,
 * not pasted text), e.g. `summerfi-safe-batch-base-2txs-2026-06-26.json`.
 */
export const safeBatchFilename = (chainId: SupportedNetworkIds, txCount: number): string => {
  const chainSlug = slugify(sdkChainIdToHumanNetwork(chainId) || `chain-${chainId}`)
  const date = new Date().toISOString().slice(0, 10)

  return `summerfi-safe-batch-${chainSlug}-${txCount}tx${txCount === 1 ? '' : 's'}-${date}.json`
}

// --- Safe checksum (replicated verbatim from Safe's tx-builder `addChecksum`) ---
// `keccak256(toBytes(s))` is equivalent to the reference's
// `solidityPackedKeccak256(['string'], [s])` (packed encoding of a lone string is its UTF-8 bytes).

const stringifyReplacer = (_key: string, value: unknown) => (value === undefined ? null : value)

const serializeJSONObject = (json: unknown): string => {
  if (Array.isArray(json)) {
    return `[${json.map((el) => serializeJSONObject(el)).join(',')}]`
  }

  if (typeof json === 'object' && json !== null) {
    const obj = json as { [key: string]: unknown }
    const keys = Object.keys(obj).sort()
    let acc = `{${JSON.stringify(keys, stringifyReplacer)}`

    for (const key of keys) {
      acc += `${serializeJSONObject(obj[key])},`
    }

    return `${acc}}`
  }

  return `${JSON.stringify(json, stringifyReplacer)}`
}

const calculateChecksum = (file: SafeBatchFile): string => {
  const { checksum: _omit, ...metaWithoutChecksum } = file.meta
  const serialized = serializeJSONObject({
    ...file,
    meta: { ...metaWithoutChecksum, name: null },
  })

  return keccak256(toBytes(serialized))
}

/**
 * Convert the exportable subset of `items` to a Safe Transaction Builder batch JSON string
 * (pretty-printed). Non-exportable items are filtered out. `chainId` is the batch's chain.
 */
export const toSafeBatchJson = (
  items: SDKTransactionItem[],
  chainId: SupportedNetworkIds,
): string => {
  const transactions: SafeBatchTransaction[] = items.filter(isExportable).map((item) => {
    const tx = item.txData.transaction

    return {
      to: tx.target.value,
      value: tx.value ? BigInt(tx.value).toString() : '0',
      data: tx.calldata,
      contractMethod: null,
      contractInputsValues: null,
    }
  })

  const file: SafeBatchFile = {
    version: '1.0',
    chainId: String(chainId),
    createdAt: Date.now(),
    meta: {
      name: 'Transactions Batch',
      description: '',
      txBuilderVersion: TX_BUILDER_VERSION,
      createdFromSafeAddress: '',
      createdFromOwnerAddress: '',
    },
    transactions,
  }

  file.meta.checksum = calculateChecksum(file)

  return JSON.stringify(file, null, 2)
}
