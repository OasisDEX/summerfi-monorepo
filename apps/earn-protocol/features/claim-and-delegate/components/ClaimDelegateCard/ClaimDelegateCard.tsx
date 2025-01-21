import { type FC } from 'react'
import { Card, Icon, LoadableAvatar, Text, Tooltip } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatShorthandNumber } from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import classNames from './ClaimDelegateCard.module.scss'

const getVotingPowerColor = (votingPower: number) => {
  if (votingPower === 1) {
    return 'var(--earn-protocol-success-100)'
  }

  if (votingPower > 0.7) {
    return 'var(--earn-protocol-warning-100)'
  }

  return 'var(--earn-protocol-critical-100)'
}

interface ClaimDelegateCardProps {
  isActive: boolean
  sumrAmount?: number
  ens: string
  address: string
  title: string
  description: string
  social?: {
    linkedin: string | undefined
    x: string | undefined
    link: string | undefined
  }
  handleClick: () => void
  votingPower?: number
  selfDelegate?: boolean
}

export const ClaimDelegateCard: FC<ClaimDelegateCardProps> = ({
  isActive,
  sumrAmount = '0',
  address,
  title,
  description,
  handleClick,
  social,
  votingPower,
  selfDelegate,
}) => {
  return (
    <Card
      className={classNames.claimDelegateCardWrapper}
      variant={isActive ? 'cardPrimaryColorfulBorder' : 'cardPrimary'}
      style={{ border: !isActive ? '1px solid transparent' : undefined }}
      onClick={handleClick}
    >
      <div className={clsx(classNames.checkmarkIcon, { [classNames.active]: isActive })}>
        <Icon
          iconName="checkmark"
          size={12}
          color={`var(${isActive ? '--earn-protocol-success-100' : '--earn-protocol-secondary-40'})`}
        />
      </div>
      <div className={classNames.content}>
        <div className={classNames.heading}>
          <div className={classNames.title}>
            {!selfDelegate && (
              <LoadableAvatar
                size={38}
                name={btoa(address)}
                variant="pixel"
                colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
              />
            )}
            <Text as="p" variant="p2semi">
              {title}
            </Text>
          </div>
          {!selfDelegate && (
            <div className={classNames.amount}>
              <Icon tokenName="SUMR" variant="s" />
              <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                {formatCryptoBalance(sumrAmount)}
              </Text>
            </div>
          )}
        </div>
        <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {description}
        </Text>
        <div className={classNames.footer}>
          <div className={classNames.social}>
            {social?.linkedin && (
              <Link href={social.linkedin} target="_blank">
                <Icon iconName="linkedin" variant="s" />
              </Link>
            )}
            {social?.x && (
              <Link href={social.x} target="_blank">
                <Icon iconName="x" variant="s" />
              </Link>
            )}
            {social?.link && (
              <Link href={social.link} target="_blank">
                <Icon iconName="link" variant="s" />
              </Link>
            )}
          </div>
          {!selfDelegate && votingPower && (
            <div className={classNames.votingPower}>
              <Text as="p" variant="p3semi" style={{ color: getVotingPowerColor(votingPower) }}>
                Voting and Reward Power: {formatShorthandNumber(votingPower, { precision: 2 })}
              </Text>
              <Tooltip tooltip="TBD">
                <Icon iconName="info" variant="s" color={getVotingPowerColor(votingPower)} />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
