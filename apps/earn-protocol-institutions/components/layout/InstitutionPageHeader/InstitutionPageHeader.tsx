'use client'
import { type FC, type ReactNode } from 'react'
import { Dropdown, Icon, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext/AuthContext'
import { useWalletRole } from '@/hooks/useWalletRole'
import { type InstitutionData, type InstitutionsList } from '@/types/institution-data'

import styles from './InstitutionPageHeader.module.css'

interface InstitutionPageHeaderProps {
  selectedInstitution: InstitutionData
  institutionsList: InstitutionsList
}

const DropdownContent: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Text as="p" variant="p3semi">
      {children}
    </Text>
  )
}

const InstitutionLogo = ({ institution }: { institution: InstitutionData }) => {
  if (institution.logoUrl) {
    return <Image src={institution.logoUrl} alt={institution.displayName} width={54} height={54} />
  }
  if (institution.logoFile) {
    return <Image src={institution.logoFile} alt={institution.displayName} width={54} height={54} />
  }

  return <Icon iconName="earn_institution" size={54} />
}

export const InstitutionPageHeader: FC<InstitutionPageHeaderProps> = ({
  selectedInstitution,
  institutionsList,
}) => {
  const { push } = useRouter()
  const { connectedRolesLabel } = useWalletRole({
    institutionName: selectedInstitution.name,
  })

  const { user } = useAuth()

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
        <InstitutionLogo institution={selectedInstitution} />
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
          <Text as="p" variant="p2semi">
            User role:&nbsp;
          </Text>
          <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-link)' }}>
            {institutionUserRole}
          </Text>
        </div>
        <div className={styles.rightWrapperItem}>
          <Text as="p" variant="p2semi">
            Wallet role:&nbsp;
          </Text>
          <Text as="p" variant="p2semi" style={{ color: 'var(--color-text-link)' }}>
            {connectedRolesLabel}
          </Text>
        </div>
      </div>
    </div>
  )
}
