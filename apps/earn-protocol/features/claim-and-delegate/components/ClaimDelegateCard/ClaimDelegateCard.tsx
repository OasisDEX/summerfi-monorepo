import { type FC } from 'react'
import {
  Card,
  getVotingPowerColor,
  Icon,
  LoadableAvatar,
  Text,
  Tooltip,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatShorthandNumber, safeBTOA } from '@summerfi/app-utils'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import classNames from './ClaimDelegateCard.module.css'

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
    etherscan: string | undefined
  }
  handleClick: () => void
  votingPower?: number
  selfDelegate?: boolean
  disabled?: boolean
  isFaded?: boolean
  picture?: string
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
  disabled,
  isFaded,
  picture,
}) => {
  return (
    <Card
      className={classNames.claimDelegateCardWrapper}
      variant={isActive ? 'cardPrimaryColorfulBorder' : 'cardPrimary'}
      style={{
        border: !isActive ? '1px solid transparent' : undefined,
        opacity: isFaded ? 0.6 : 1,
      }}
      onClick={handleClick}
      disabled={disabled}
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
            {picture && !selfDelegate && (
              <Image
                src={picture}
                alt="avatar"
                width={38}
                height={38}
                style={{ borderRadius: '50%' }}
              />
            )}
            {!selfDelegate && !picture && (
              <LoadableAvatar
                size={38}
                name={safeBTOA(address)}
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
        <Text
          as="p"
          variant="p3"
          style={{ color: 'var(--earn-protocol-secondary-60)', wordBreak: 'break-word' }}
        >
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
            {social?.etherscan && (
              <Link href={social.etherscan} target="_blank">
                <Icon iconName="etherscan" variant="s" />
              </Link>
            )}
          </div>
          {!selfDelegate && votingPower && (
            <div className={classNames.votingPower}>
              <Text as="p" variant="p3semi" style={{ color: getVotingPowerColor(votingPower) }}>
                Vote and Reward Power: {formatShorthandNumber(votingPower, { precision: 2 })}
              </Text>
              <Tooltip
                tooltip="Vote and Reward Power reflects a delegates activity within governance. A 1.0 Power will give you full staking rewards. Anything less will reduce your reward amounts."
                tooltipWrapperStyles={{ minWidth: '230px', left: '-200px' }}
              >
                <Icon iconName="info" variant="s" color={getVotingPowerColor(votingPower)} />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
