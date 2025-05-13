import { type FC } from 'react'
import { Button, Card, Icon, Text } from '@summerfi/app-earn-ui'

import classNames from './ClaimDelegateActionCard.module.css'

interface ClaimDelegateActionCardProps {
  title: string
  description: string
  actionLabel: string
  action: () => void
  closeAction?: () => void
}

export const ClaimDelegateActionCard: FC<ClaimDelegateActionCardProps> = ({
  title,
  description,
  actionLabel,
  action,
  closeAction,
}) => {
  return (
    <Card className={classNames.claimDelegateActionCardWrapper}>
      <div className={classNames.iconWrapper}>
        <div className={classNames.innerBackground}>
          <Icon iconName="info_colorful" size={32} />
        </div>
      </div>
      <Text as="p" variant="p1semi" style={{ marginBottom: 'var(--general-space-8)' }}>
        {title}
      </Text>
      <Text
        as="p"
        variant="p2"
        style={{
          color: 'var(--earn-protocol-secondary-40)',
          marginBottom: 'var(--general-space-24)',
        }}
      >
        {description}
      </Text>
      <Button variant="primarySmall" onClick={action}>
        {actionLabel}
      </Button>
      {closeAction && (
        <Button onClick={closeAction} className={classNames.closeButton}>
          <Icon iconName="close" size={10} />
        </Button>
      )}
    </Card>
  )
}
