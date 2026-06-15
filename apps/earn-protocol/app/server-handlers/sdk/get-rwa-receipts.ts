import { RoundState, RoundsVaultType } from '@summerfi/sdk-common'
import {
  GetRwaReceiptsDocument,
  type GetRwaReceiptsQuery,
  RoundStateRwa as SubgraphRoundState,
} from '@summerfi/subgraph-manager-common'
import { GraphQLClient } from 'graphql-request'

import { resolveRoundsVaultIds } from '@/app/server-handlers/rwa-receipts-history/get-rwa-receipts-history'
import { rwaSubgraphUrlByChainId } from '@/app/server-handlers/subgraphs-map'

export type RwaReceiptStatus = 'claimable' | 'cancellable' | 'pending'

/**
 * Server-side, JSON-safe representation of a pending RWA position (ERC-1155 receipt). Mirrors the
 * client `RwaReceipt` (see use-rwa-claim), but `roundId`/`balance` are strings so the result can
 * be cached via unstable_cache (JSON.stringify can't serialise BigInt) and crosses to the client.
 */
export type RwaServerReceipt = {
  vaultType: RoundsVaultType
  roundId: string
  balance: string
  roundState: RoundState
  status: RwaReceiptStatus
}

const toStatus = (state: SubgraphRoundState): RwaReceiptStatus => {
  if (state === SubgraphRoundState.Settled) {
    return 'claimable'
  }
  if (state === SubgraphRoundState.Opened) {
    return 'cancellable'
  }

  return 'pending'
}

// Subgraph string round-state → the SDK's numeric RoundState (the JSON-safe receipt's roundState).
const toNumericRoundState = (state: SubgraphRoundState): RoundState => {
  if (state === SubgraphRoundState.Opened) {
    return RoundState.Opened
  }
  if (state === SubgraphRoundState.InSettlement) {
    return RoundState.InSettlement
  }

  return RoundState.Settled
}

/**
 * Loads the wallet's pending RWA positions for a single fleet: the ERC-1155 receipts held in both
 * the Input (deposits) and Output (redemptions) rounds-vaults, each classified by round state.
 *
 * Reads directly from the institutions subgraph (resolve the fleet's Input/Output rounds-vault
 * addresses, then one `GetRwaReceipts` query per side which already carries `round.state`) — this
 * avoids the previous N+1 of one on-chain `getRoundState` call per held receipt. Additive to the
 * portfolio, so it degrades to an empty list rather than throwing.
 */
export async function getRwaReceipts({
  chainId,
  fleetAddress,
  walletAddress,
}: {
  chainId: number
  fleetAddress: string
  walletAddress: string
}): Promise<RwaServerReceipt[]> {
  const subgraphUrl = rwaSubgraphUrlByChainId[chainId]

  if (!subgraphUrl) {
    return []
  }

  try {
    const ids = await resolveRoundsVaultIds(subgraphUrl, fleetAddress)

    if (!ids) {
      return []
    }

    const client = new GraphQLClient(subgraphUrl)
    const account = walletAddress.toLowerCase()

    const fetchForVault = async (
      vaultId: string,
      vaultType: RoundsVaultType,
    ): Promise<RwaServerReceipt[]> => {
      const { receipts } = await client.request<GetRwaReceiptsQuery>(
        GetRwaReceiptsDocument,
        { account, vault: vaultId.toLowerCase() },
        { origin: 'earn-protocol-app' },
      )

      return receipts.map((receipt) => ({
        vaultType,
        roundId: receipt.round.roundId.toString(),
        balance: receipt.balance.toString(),
        roundState: toNumericRoundState(receipt.round.state),
        status: toStatus(receipt.round.state),
      }))
    }

    // Fetch both sides independently so one failing does not hide the other.
    const [input, output] = await Promise.all([
      fetchForVault(ids.inputVaultId, RoundsVaultType.Input).catch(() => [] as RwaServerReceipt[]),
      fetchForVault(ids.outputVaultId, RoundsVaultType.Output).catch(
        () => [] as RwaServerReceipt[],
      ),
    ])

    return [...input, ...output]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getRwaReceipts failed', error)

    return []
  }
}
