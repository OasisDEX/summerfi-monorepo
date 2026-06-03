import { type SDKVaultType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

/**
 * Returns an object with the initial balance state for each Ark in the vault.
 * @param vault - The vault object.
 * @returns An object with the initial balance state for each Ark in the vault.
 */
export const getAssetReallocationInitialBalanceState = (vault: SDKVaultType) => {
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
export const getAssetReallocationModifiedVault = (
  vault: SDKVaultType,
  balanceAddChange: { [key: string]: string },
  balanceRemoveChange: { [key: string]: string },
) => {
  const modifiedArks = vault.arks.map((ark) => {
    const addAmount = new BigNumber(balanceAddChange[ark.id] || 0)
    const removeAmount = new BigNumber(balanceRemoveChange[ark.id] || 0)

    // Convert the net change to wei (multiply by 10^decimals) and add to the existing balance,
    // doing all arithmetic in BigNumber so 18-decimal values don't lose precision in JS floats
    // before the BigInt conversion.
    const nextBalanceWei = new BigNumber(ark.inputTokenBalance.toString()).plus(
      addAmount.minus(removeAmount).times(new BigNumber(10).pow(vault.inputToken.decimals)),
    )

    return {
      ...ark,
      inputTokenBalance: BigInt(nextBalanceWei.toFixed(0)),
    }
  })

  return {
    ...vault,
    arks: modifiedArks,
  }
}
