import { type FC, type PropsWithChildren } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import styles from './VaultExposureDescription.module.css'

interface VaultExposureDescriptionProps extends PropsWithChildren {
  humanReadableNetwork: string
}

export const VaultExposureDescription: FC<VaultExposureDescriptionProps> = ({
  children,
  humanReadableNetwork,
}) => {
  return (
    <Card className={styles.vaultExposureDescriptionWrapper}>
      <Text as="p" variant="p2" className={styles.descriptionText}>
        This Vault is composed of various DeFi protocols and markets on the {humanReadableNetwork}{' '}
        Network. These are selected and maintained through a rigorous selection process with risk
        exposure managed by BlockAnalitica, an independant risk team. All protocols are vetted for
        security, performance and trustworthy teams.
      </Text>
      {children}
    </Card>
  )
}
