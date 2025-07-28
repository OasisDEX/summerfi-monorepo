'use client'
import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import { InstitutionRoles } from '@summerfi/app-types'

import { rolesToHuman } from '@/helpers/roles-to-human'

import styles from './MainHeader.module.css'

interface MainHeaderProps {
  institutionName: string
}

// todo to be replaced with the actual connected role & mapping from backend per wallet address
const connectedRole = InstitutionRoles.GENERAL_ADMIN

export const MainHeader: FC<MainHeaderProps> = ({ institutionName }) => {
  const roleResolved = connectedRole ? rolesToHuman(connectedRole) : 'No role connected'

  return (
    <div className={styles.mainHeaderWrapper}>
      <div className={styles.leftWrapper}>
        <Icon iconName="earn_institution" size={54} />
        <Text as="h2" variant="h2">
          {institutionName}
        </Text>
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
