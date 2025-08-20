'use client'
import { type FC, type ReactNode } from 'react'
import { Button, Dropdown, Icon, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import { GeneralRoles } from '@summerfi/sdk-client'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext/AuthContext'
import { walletRolesToHuman } from '@/helpers/roles-to-human'
import { type InstitutionData } from '@/types/institution-data'

import styles from './InstitutionPageHeader.module.css'

interface InstitutionPageHeaderProps {
  selectedInstitution: InstitutionData
  institutionsList: InstitutionData[]
}

// todo to be replaced with the actual connected role & mapping from backend per wallet address
const connectedRole = GeneralRoles.ADMIRALS_QUARTERS_ROLE

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

  const { signOut, user } = useAuth()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const walletRole = connectedRole ? walletRolesToHuman(connectedRole) : 'No role connected'
  const institutionUserRole = user
    ? user.institutionsList?.find((institution) => institution.id === selectedInstitution.id)?.role
    : 'No role connected'
  const institutionsOptions: DropdownRawOption[] = institutionsList.map((institution) => ({
    value: institution.name,
    content: <DropdownContent>{institution.displayName}</DropdownContent>,
  }))

  const handleChangeInstitution = (option: DropdownRawOption) => {
    push(`/${option.value}/overview`)
  }

  return (
    <div className={styles.institutionPageHeaderWrapper}>
      <div className={styles.leftWrapper}>
        <Icon iconName="earn_institution" size={54} />
        {institutionsOptions.length > 1 ? (
          <Dropdown
            options={institutionsOptions}
            dropdownValue={{
              value: selectedInstitution.name,
              content: <DropdownContent>{selectedInstitution.displayName}</DropdownContent>,
            }}
            onChange={handleChangeInstitution}
            dropdownWrapperStyle={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <Text as="h2" variant="h2">
              {selectedInstitution.displayName}
            </Text>
          </Dropdown>
        ) : (
          <Text as="h2" variant="h2">
            {selectedInstitution.displayName}
          </Text>
        )}
      </div>
      <div className={styles.rightWrapper}>
        <div className={styles.rightWrapperItem}>
          <Button variant="textSecondarySmall" onClick={signOut}>
            Log out
          </Button>
        </div>
        <div className={styles.rightWrapperItem}>
          <Text as="p" variant="p1semi">
            User role:
          </Text>
          <Text as="p" variant="p1semi" style={{ color: 'var(--color-text-link)' }}>
            {institutionUserRole}
          </Text>
        </div>
        <div className={styles.rightWrapperItem}>
          <Text as="p" variant="p1semi">
            Wallet role:
          </Text>
          <Text as="p" variant="p1semi" style={{ color: 'var(--color-text-link)' }}>
            {walletRole}
          </Text>
        </div>
      </div>
    </div>
  )
}
