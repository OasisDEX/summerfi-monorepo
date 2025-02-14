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
    (item) =>
      // First check if depositCap is greater than 0
      Number(item.depositCap) > 0 &&
      (allocationType === VaultExposureFilterType.ALL
        ? true
        : allocationType === VaultExposureFilterType.UNALLOCATED
          ? Number(item.inputTokenBalance) === 0
          : Number(item.inputTokenBalance) > 0),
  ),
})
