import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { BigNumber } from 'bignumber.js'

/**
 * Calculates the weighted APY for a vault based on its ARKs (Automated Revenue Keepers)
 * excluding the BufferArk. The weight is determined by the allocation of input tokens
 * to each ARK relative to the total vault balance.
 *
 * @param vault - The vault object containing ARKs and their balances
 * @returns The weighted average APY as a BigNumber (in decimal form, not percentage)
 */
export const getArksWeightedApy = (vault: SDKVaultType | SDKVaultishType): BigNumber => {
  const vaultInputToken = vault.inputTokenBalance
  const nonBufferArks = vault.arks.filter((ark) => ark.name !== 'BufferArk')

  return nonBufferArks.reduce((acc, ark) => {
    const allocation =
      vaultInputToken.toString() !== '0'
        ? new BigNumber(ark.inputTokenBalance.toString()).div(vaultInputToken.toString())
        : new BigNumber(0)

    const arkInterestRate = vault.customFields?.arksInterestRates?.[ark.name as string]
    const apr = isNaN(Number(arkInterestRate))
      ? new BigNumber(0)
      : new BigNumber(arkInterestRate ?? 0).div(100)

    return acc.plus(allocation.multipliedBy(apr))
  }, new BigNumber(0))
}
