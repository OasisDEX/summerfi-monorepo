import { type FC } from 'react'
import { IllustrationCircle, Text } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'

import classNames from './MigrationLandingPageIlustration.module.css'

interface MigrationLandingPageIlustrationProps {
  iconName: IconNamesList
  title: string
  description: string
}

export const MigrationLandingPageIlustration: FC<MigrationLandingPageIlustrationProps> = ({
  iconName,
  title,
  description,
}) => {
  return (
    <div key={title} className={classNames.migrationLandingPageIlustrationWrapper}>
      <div className={classNames.cardIconWrapper}>
        <IllustrationCircle icon={iconName} size="large" />
      </div>
      <div className={classNames.cardContentWrapper}>
        <Text as="p" variant="p1semi">
          {title}
        </Text>
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          {description}
        </Text>
      </div>
    </div>
  )
}
