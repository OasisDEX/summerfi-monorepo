import { type SDKVaultType } from '@summerfi/app-types'

/**
 * Returns an object with the initial balance state for each Ark in the vault.
 * @param vault - The vault object.
 * @returns An object with the initial balance state for each Ark in the vault.
 */
export const getAssetRelocationInitialBalanceState = (vault: SDKVaultType) => {
  return vault.arks.reduce<{ [key: string]: string }>((acc, ark) => {
    if (ark.id) {
      acc[ark.id] = ''
    }

    return acc
  }, {})
}

/**
 * Returns a modified vault object with the balance changes applied.
 * @param vault - The vault object.
 * @param balanceAddChange - The balance changes for the add operation.
 * @param balanceRemoveChange - The balance changes for the remove operation.
 * @returns A modified vault object with the balance changes applied.
 */
export const getAssetRelocationModifiedVault = (
  vault: SDKVaultType,
  balanceAddChange: { [key: string]: string },
  balanceRemoveChange: { [key: string]: string },
) => {
  const modifiedArks = vault.arks.map((ark) => {
    const addAmount = Number(balanceAddChange[ark.id] || 0)
    const removeAmount = Number(balanceRemoveChange[ark.id] || 0)
    const netChange = addAmount - removeAmount

    // Convert the net change to wei (multiply by 10^decimals)
    // eslint-disable-next-line no-mixed-operators
    const netChangeInWei = netChange * 10 ** vault.inputToken.decimals

    return {
      ...ark,
      inputTokenBalance: BigInt(Number(ark.inputTokenBalance) + netChangeInWei),
    }
  })

  return {
    ...vault,
    arks: modifiedArks,
  }
}
