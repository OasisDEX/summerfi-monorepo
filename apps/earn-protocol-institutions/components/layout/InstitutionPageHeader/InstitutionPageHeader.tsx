'use client'
import { type FC, type ReactNode } from 'react'
import { Dropdown, Icon, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption, InstitutionRoles } from '@summerfi/app-types'
import { useRouter } from 'next/navigation'

import { rolesToHuman } from '@/helpers/roles-to-human'
import { type InstitutionData } from '@/types/institution-data'
import { type WalletData } from '@/types/wallet-data'

import styles from './InstitutionPageHeader.module.css'

interface InstitutionPageHeaderProps {
  selectedInstitution: InstitutionData
  institutionsList: WalletData['institutionsList']
}

// todo to be replaced with the actual connected role & mapping from backend per wallet address
const connectedRole = InstitutionRoles.GENERAL_ADMIN

const DropdownContent: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Text as="p" variant="p3semi">
      {children}
    </Text>
  )
}

export const InstitutionPageHeader: FC<InstitutionPageHeaderProps> = ({
  selectedInstitution,
  institutionsList,
}) => {
  const { push } = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const roleResolved = connectedRole ? rolesToHuman(connectedRole) : 'No role connected'
  const vaultsOptions: DropdownRawOption[] = institutionsList.map((institution) => ({
    value: institution.id,
    content: <DropdownContent>{institution.institutionName}</DropdownContent>,
  }))

  const handleChangeInstitution = (option: DropdownRawOption) => {
    push(`/${option.value}/overview`)
  }

  return (
    <div className={styles.institutionPageHeaderWrapper}>
      <div className={styles.leftWrapper}>
        <Icon iconName="earn_institution" size={54} />
        {vaultsOptions.length > 1 ? (
          <Dropdown
            options={vaultsOptions}
            dropdownValue={{
              value: selectedInstitution.id,
              content: <DropdownContent>{selectedInstitution.institutionName}</DropdownContent>,
            }}
            onChange={handleChangeInstitution}
            dropdownWrapperStyle={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <Text as="h2" variant="h2">
              {selectedInstitution.institutionName}
            </Text>
          </Dropdown>
        ) : (
          <Text as="h2" variant="h2">
            {selectedInstitution.institutionName}
          </Text>
        )}
      </div>
      <div className={styles.rightWrapper}>
        <Text as="p" variant="p1semi">
          Currently connected role:
        </Text>
        <Text as="p" variant="p1semi" style={{ color: 'var(--color-text-link)' }}>
          {roleResolved}
        </Text>
      </div>
    </div>
  )
}
