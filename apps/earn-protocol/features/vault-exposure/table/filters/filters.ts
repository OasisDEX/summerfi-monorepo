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
  arks: vault.arks.filter((item) =>
    allocationType === VaultExposureFilterType.ALL
      ? true
      : allocationType === VaultExposureFilterType.UNALLOCATED
        ? Number(item.inputTokenBalance) === 0
        : Number(item.inputTokenBalance) > 0,
  ),
})
