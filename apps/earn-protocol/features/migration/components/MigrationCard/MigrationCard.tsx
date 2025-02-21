import { type FC } from 'react'

import { type PlatformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './Migration.module.scss'

interface MigrationCardProps {
  platformLogo: PlatformLogoMap
}

export const MigrationCard: FC<MigrationCardProps> = ({ platformLogo }) => {
  return (
    <div className={classNames.migrationCardWrapper}>
      <div className={classNames.migrationCardHeader}>
        <Image src={platformLogoMap[platformLogo]} alt={platformLogo} height={17} />
      </div>
      <div className={classNames.migrationSubHeader}>
        <Text variant="p4semi">Migrate to SummerFi</Text>
      </div>
      <div className={classNames.divider} />
      <div className={classNames.migrationContent}>
        <div className={classNames.migrationContentRow}>
          <Text variant="p4semi">Migrate to SummerFi</Text>
        </div>
      </div>
      <div className={classNames.migrationCardBanner}>
        <Text variant="p4semi">Migrate to SummerFi</Text>
      </div>
    </div>
  )
}
