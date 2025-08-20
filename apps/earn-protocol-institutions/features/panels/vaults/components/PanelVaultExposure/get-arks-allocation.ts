import { getProtocolLabel, getUniqueColor } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

/**
 * Calculates the allocation of each Ark in a vault.
 *
 * @param vault - The vault object containing Arks and their input token balances.
 * @returns An array of objects, each representing an Ark's allocation with label, percentage, and color.
 */
export const getArksAllocation = (
  vault: SDKVaultType,
): { label: string; percentage: number; color: string }[] => {
  const totalAllocation = vault.arks.reduce((acc, ark) => acc + Number(ark.inputTokenBalance), 0)

  return vault.arks
    .filter((ark) => Number(ark.inputTokenBalance) > 0)
    .map((ark) => {
      const protocol = ark.name?.split('-') ?? ['n/a']
      const protocolLabel = getProtocolLabel(protocol)

      return {
        label: protocolLabel,
        percentage: Number(ark.inputTokenBalance) / Number(totalAllocation),
        color: getUniqueColor(protocolLabel),
      }
    })
    .sort((a, b) => b.percentage - a.percentage)
}
