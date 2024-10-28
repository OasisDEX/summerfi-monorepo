'use client'

import { VaultDetailsFaq } from '@/features/vault-details/components/VaultDetailsFaq/VaultDetailsFaq'
import { VaultDetailsHowItWorks } from '@/features/vault-details/components/VaultDetailsHowItWorks/VaultDetailsHowItWorks'
import { VaultDetailsSecurity } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurity'
import { VaultDetailsYields } from '@/features/vault-details/components/VaultDetailsYields/VaultDetailsYields'

export const VaultDetailsView = () => {
  return (
    <>
      <VaultDetailsHowItWorks />
      <VaultDetailsYields />
      <VaultDetailsSecurity />
      <VaultDetailsFaq />
    </>
  )
}
