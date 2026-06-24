'use server'

import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'

import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'
import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

// A single fund move between two arks (amounts in human/decimal token units of the vault input asset).
export type RebalanceMove = {
  fromArk: string
  toArk: string
  amount: string
}

// Plain, serializable shape of the built transaction — `Transaction.value` is already a string and
// IAddress serializes to `{ value }`, so this crosses the server-action boundary cleanly and the
// transaction queue reads exactly these fields (`transaction.target.value` / `.calldata` / `.value`).
export type PlainRebalanceTransaction = {
  target: string
  calldata: string
  value: string
  description: string
}

/**
 * Builds (does not send) an `armada.admin.rebalance` transaction for a standard institutional vault
 * from a set of ark-to-ark moves. The connected wallet still needs the on-chain Keeper/Governor role
 * to execute it, and the rebalance can revert if ark caps / cooldown aren't satisfied — those surface
 * as transaction errors in the queue (no pre-validation here, by design).
 */
export async function buildRebalanceTransaction({
  institutionName,
  network,
  vaultAddress,
  moves,
}: {
  institutionName: string
  network: string
  vaultAddress: string
  moves: RebalanceMove[]
}): Promise<PlainRebalanceTransaction> {
  await validateInstitutionUserSession({ institutionName })

  if (moves.length === 0) {
    throw new Error('No reallocation moves provided')
  }

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const chainId = subgraphNetworkToId(parsedNetwork)
  const chainInfo = getChainInfoByChainId(chainId)

  const vault = await getCachedVaultDetails({
    institutionName,
    vaultAddress,
    network: parsedNetwork,
  })

  if (!vault) {
    throw new Error('Vault not found')
  }

  const token = Token.createFromEthereum({
    chainId,
    addressValue: vault.inputToken.id,
    symbol: vault.inputToken.symbol,
    name: vault.inputToken.name,
    decimals: vault.inputToken.decimals,
  })

  const rebalanceData = moves.map((move) => ({
    fromArk: Address.createFromEthereum({ value: move.fromArk }),
    toArk: Address.createFromEthereum({ value: move.toArk }),
    amount: TokenAmount.createFrom({ token, amount: move.amount }),
  }))

  const txInfo = await getInstitutionsSDK(institutionName).armada.admin.rebalance({
    vaultId: ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: vaultAddress }),
    }),
    rebalanceData,
  })

  return {
    target: txInfo.transaction.target.value,
    calldata: txInfo.transaction.calldata,
    value: txInfo.transaction.value,
    description: txInfo.description,
  }
}
