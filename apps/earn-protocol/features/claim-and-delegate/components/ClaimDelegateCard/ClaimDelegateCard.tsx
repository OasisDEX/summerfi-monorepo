import { type FC } from 'react'
import { Card, Icon, LoadableAvatar, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, safeBTOA } from '@summerfi/app-utils'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import classNames from './ClaimDelegateCard.module.css'

interface ClaimDelegateCardProps {
  isActive: boolean
  sumrAmountV1?: number
  sumrAmountV2?: number
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
  selfDelegate?: boolean
  disabled?: boolean
  isFaded?: boolean
  picture?: string
}

export const ClaimDelegateCard: FC<ClaimDelegateCardProps> = ({
  isActive,
  sumrAmountV1 = '0',
  sumrAmountV2,
  address,
  title,
  description,
  handleClick,
  social,
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
            <>
              <div className={classNames.amount}>
                <Icon tokenName="SUMR" variant="s" />
                <Text
                  as="p"
                  variant="p3semi"
                  style={{ color: 'var(--earn-protocol-secondary-60)' }}
                >
                  v1: {formatCryptoBalance(sumrAmountV1)}
                </Text>
              </div>
              {sumrAmountV2 !== undefined && sumrAmountV2 > 0 && (
                <div className={classNames.amount}>
                  <Icon tokenName="SUMR" variant="s" />
                  <Text
                    as="p"
                    variant="p3semi"
                    style={{ color: 'var(--earn-protocol-secondary-60)' }}
                  >
                    v2: {formatCryptoBalance(sumrAmountV2)}
                  </Text>
                </div>
              )}
            </>
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
        </div>
      </div>
    </Card>
  )
}
