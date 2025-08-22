'use client'

import { type FC, type ReactNode } from 'react'
import { Dropdown, Text } from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { getHumanReadableFleetName, supportedSDKNetwork } from '@summerfi/app-utils'
import { usePathname, useRouter } from 'next/navigation'

import { IconWithText } from '@/components/molecules/IconWithText/IconWithText'
import { getPanelVaultNavigationTabId } from '@/helpers/get-pathname-tab-id'
import { getInstitutionVaultUrl } from '@/helpers/get-url'
import { type InstitutionData } from '@/types/institution-data'

import vaultsDropdownWrapperStyles from './VaultsDropdownWrapper.module.css'

interface DropdownContentProps {
  children: ReactNode
  tokenName: TokenSymbolsList
}

const DropdownContent: FC<DropdownContentProps> = ({ children, tokenName }) => {
  return (
    <IconWithText tokenName={tokenName} size={24}>
      <Text as="p" variant="p1semi">
        {children}
      </Text>
    </IconWithText>
  )
}

export const VaultsDropdownWrapper = ({
  institution,
  vaults,
  selectedVault,
}: {
  institution: InstitutionData
  vaults: SDKVaultishType[]
  selectedVault: SDKVaultishType
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const vaultsOptions: DropdownRawOption[] = vaults.map((vault) => ({
    value: `${vault.id}-${vault.protocol.network}`,
    content: (
      <DropdownContent
        key={`${vault.id}-${vault.protocol.network}`}
        tokenName={vault.inputToken.symbol as TokenSymbolsList}
      >
        {getHumanReadableFleetName(supportedSDKNetwork(vault.protocol.network), vault.name)}
      </DropdownContent>
    ),
  }))

  const selectedVaultOption = {
    value: `${selectedVault.id}-${selectedVault.protocol.network}`,
    content: (
      <DropdownContent
        key={`${selectedVault.id}-${selectedVault.protocol.network}`}
        tokenName={selectedVault.inputToken.symbol as TokenSymbolsList}
      >
        {getHumanReadableFleetName(
          supportedSDKNetwork(selectedVault.protocol.network),
          selectedVault.name,
        )}
      </DropdownContent>
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
          institutionId: institution.name,
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
