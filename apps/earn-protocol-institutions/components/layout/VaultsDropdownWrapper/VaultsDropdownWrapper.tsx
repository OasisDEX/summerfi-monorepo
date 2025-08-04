'use client'

import { type FC, type ReactNode } from 'react'
import { Dropdown, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import { usePathname, useRouter } from 'next/navigation'

import { IconWithText } from '@/components/molecules/IconWithText/IconWithText'
import { getPanelVaultNavigationTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionVaultUrl } from '@/helpers/get-url'
import { type InstitutionData } from '@/types/institution-data'

import vaultsDropdownWrapperStyles from './VaultsDropdownWrapper.module.css'

interface DropdownContentProps {
  children: ReactNode
}

const DropdownContent: FC<DropdownContentProps> = ({ children }) => {
  return (
    <IconWithText tokenName="USDC" size={24}>
      <Text as="p" variant="p1semi">
        {children}
      </Text>
    </IconWithText>
  )
}

export const VaultsDropdownWrapper = ({
  institution,
  selectedVault,
}: {
  institution: InstitutionData
  selectedVault: InstitutionData['vaultsData'][number]
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const vaultsOptions: DropdownRawOption[] = institution.vaultsData.map((institutionVault) => ({
    value: institutionVault.id,
    content: <DropdownContent>{institutionVault.name}</DropdownContent>,
  }))

  const selectedVaultOption = {
    value: selectedVault.id,
    content: <DropdownContent>{selectedVault.name}</DropdownContent>,
  }

  const changeSelectedVault = (option: DropdownRawOption) => {
    push(
      getInstitutionVaultUrl({
        institutionId: institution.id,
        vaultId: option.value,
        page: getPanelVaultNavigationTabId(pathname),
      }),
    )
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
