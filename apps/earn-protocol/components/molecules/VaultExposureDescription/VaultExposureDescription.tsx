import { type FC, type PropsWithChildren } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import styles from './VaultExposureDescription.module.css'

interface VaultExposureDescriptionProps extends PropsWithChildren {
  humanReadableNetwork: string
  vault: SDKVaultishType
}

export const VaultExposureDescription: FC<VaultExposureDescriptionProps> = ({
  children,
  humanReadableNetwork,
  vault,
}) => {
  // One description per vault kind. Early returns keep each variant readable instead of nesting
  // ternaries.
  const renderDescription = () => {
    if (vault.isDaoManaged) {
      return (
        <>
          This Vault is composed of various DeFi protocols and markets on the {humanReadableNetwork}{' '}
          Network.{' '}
          <Text as="span" variant="p2semi">
            These are selected and maintained through a rigorous risk framework process with
            exposure assigned to one of three categories.
          </Text>{' '}
          These categories may be updated or changed via a DAO vote. All protocols are vetted for
          security, performance, collateral backing and trustworthy teams.
        </>
      )
    }

    return (
      <>
        This Vault is composed of various DeFi protocols and markets on the {humanReadableNetwork}{' '}
        Network. These are selected and maintained through a rigorous selection process with risk
        exposure managed by BlockAnalitica, an independant risk team. All protocols are vetted for
        security, performance and trustworthy teams.
      </>
    )
  }

  return (
    <Card className={styles.vaultExposureDescriptionWrapper}>
      <Text as="p" variant="p2" className={styles.descriptionText}>
        {renderDescription()}
      </Text>
      {children}
    </Card>
  )
}
