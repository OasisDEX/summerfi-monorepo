import type { SDKVaultType } from '@summerfi/app-types'

import { VaultExposureFilterType } from '@/features/vault-exposure/types'

/**
 * Filters vault arks based on allocation type and deposit capacity
 * @param vault - The vault to filter
 * @param allocationType - Type of allocation filter to apply
 * @returns Filtered vault with arks matching the criteria
 */
export const vaultExposureFilter = ({
  vault,
  allocationType,
}: {
  vault: SDKVaultType
  allocationType: VaultExposureFilterType
}): SDKVaultType => ({
  ...vault,
  arks: vault.arks.filter(
    (ark) =>
      // First check if depositCap is greater than 0
      (Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0) &&
      (allocationType === VaultExposureFilterType.ALL
        ? true
        : allocationType === VaultExposureFilterType.UNALLOCATED
          ? Number(ark.inputTokenBalance) === 0
          : Number(ark.inputTokenBalance) > 0),
  ),
})
