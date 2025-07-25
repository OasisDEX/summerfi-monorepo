import type { SDKVaultType } from '@summerfi/app-types'

import { VaultExposureFilterType } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'

export const vaultExposureFilter = ({
  vault,
  allocationType,
}: {
  vault: SDKVaultType
  allocationType: VaultExposureFilterType
}) => ({
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
