'use client'

import { type FC } from 'react'
import { Dropdown, VaultTitleDropdownContentBlock } from '@summerfi/app-earn-ui'
import { type DropdownRawOption, type SDKVaultishType } from '@summerfi/app-types'
import { usePathname, useRouter } from 'next/navigation'

import { getInstiVaultNiceName } from '@/helpers/get-insti-vault-nice-name'
import { getPanelVaultNavigationTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionVaultUrl } from '@/helpers/get-url'
import { type InstitutionData } from '@/types/institution-data'

import vaultsDropdownWrapperStyles from './VaultsDropdownWrapper.module.css'

interface VaultsDropdownWrapperProps {
  institution: InstitutionData
  vaults: SDKVaultishType[]
  selectedVault: SDKVaultishType
}

export const VaultsDropdownWrapper: FC<VaultsDropdownWrapperProps> = ({
  institution,
  vaults,
  selectedVault,
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const vaultsOptions: DropdownRawOption[] = vaults.map((vault) => ({
    value: `${vault.id}-${vault.protocol.network}`,
    content: (
      <VaultTitleDropdownContentBlock
        vault={vault}
        className={vaultsDropdownWrapperStyles.contentWrapper}
        customVaultName={getInstiVaultNiceName({
          symbol: vault.inputToken.symbol,
          network: vault.protocol.network,
          institutionName: institution.name,
        })}
      />
    ),
  }))

  const selectedVaultOption = {
    value: `${selectedVault.id}-${selectedVault.protocol.network}`,
    content: (
      <VaultTitleDropdownContentBlock
        vault={selectedVault}
        className={vaultsDropdownWrapperStyles.contentWrapper}
      />
    ),
  }

  const changeSelectedVault = (option: DropdownRawOption) => {
    const [vaultId, network] = option.value.split('-')
    const nextVault = vaults.find(
      (vault) => vault.id === vaultId && vault.protocol.network === network,
    )

    if (nextVault) {
      push(
        getInstitutionVaultUrl({
          institutionName: institution.name,
          vault: nextVault,
          page: getPanelVaultNavigationTabId(pathname),
        }),
      )
    } else {
      // eslint-disable-next-line no-console
      console.error('Selected vault not found in the list of vaults.')
    }
  }

  return (
    <Dropdown
      options={vaultsOptions}
      dropdownValue={selectedVaultOption}
      onChange={changeSelectedVault}
      dropdownWrapperClassName={vaultsDropdownWrapperStyles.dropdownWrapper}
      dropdownSelectedClassName={vaultsDropdownWrapperStyles.dropdownSelected}
      asCard
    >
      {selectedVaultOption.content}
    </Dropdown>
  )
}
