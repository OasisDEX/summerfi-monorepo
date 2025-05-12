import { type FC, type PropsWithChildren } from 'react'
import { Icon, LinkCard, type LinkCardWithIcon } from '@summerfi/app-earn-ui'

import classNames from './CryptoUtilitiesBasics.module.css'

const IconWrapper: FC<PropsWithChildren> = ({ children }) => (
  <div className={classNames.iconWrapper}>{children}</div>
)

const basicUtilities: LinkCardWithIcon[] = [
  {
    title: 'Swap',
    description:
      'Crypto utilities are the different ways you can actually use a cryptocurrency, beyond just holding or trading it. ',
    link: { action: () => null },
    icon: (
      <IconWrapper>
        <Icon iconName="exchange" variant="s" color="rgba(255, 251, 253, 1)" />
      </IconWrapper>
    ),
  },
  {
    title: 'Send or receive',
    description:
      'Crypto utilities are the different ways you can actually use a cryptocurrency, beyond just holding or trading it. ',
    link: { action: () => null },
    icon: (
      <IconWrapper>
        <Icon iconName="send" variant="s" color="rgba(255, 251, 253, 1)" />
      </IconWrapper>
    ),
  },
  {
    title: 'Migrate existing earn positions',
    description:
      'Crypto utilities are the different ways you can actually use a cryptocurrency, beyond just holding or trading it. ',
    link: { action: () => null },
    icon: (
      <IconWrapper>
        <Icon iconName="arrow_forward" variant="s" color="rgba(255, 251, 253, 1)" />
      </IconWrapper>
    ),
  },
  {
    title: 'Bridge',
    description:
      'Crypto utilities are the different ways you can actually use a cryptocurrency, beyond just holding or trading it. ',
    link: { action: () => null },
    icon: (
      <IconWrapper>
        <Icon iconName="bridge" variant="s" color="rgba(255, 251, 253, 1)" />
      </IconWrapper>
    ),
  },
]

export const CryptoUtilitiesBasics = () => {
  return (
    <div className={classNames.wrapper}>
      {basicUtilities.map((item) => (
        <LinkCard
          key={item.title}
          title={item.title}
          icon={item.icon}
          description={item.description}
          link={item.link}
          variant="cardPrimary"
        />
      ))}
    </div>
  )
}
