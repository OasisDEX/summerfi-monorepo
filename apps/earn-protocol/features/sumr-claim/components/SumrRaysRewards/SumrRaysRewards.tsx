import type { FC } from 'react'
import {
  Button,
  Card,
  EXTERNAL_LINKS,
  type IconNamesList,
  IconWithBackground,
  INTERNAL_LINKS,
  MarketingPointsList,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { isOutsideLink } from '@/helpers/is-outside-link'

import classNames from './SumrRaysRewards.module.css'

interface SumrRaysRewardsContentProps {
  icon: { iconName: IconNamesList; size?: number }
  title: string
  description: string
  button: {
    label: string
    href: string
  }
  link: {
    label: string
    href: string
  }
}

const SumrRaysRewardsContent: FC<SumrRaysRewardsContentProps> = ({
  icon,
  title,
  description,
  button,
  link,
}) => {
  return (
    <div className={classNames.sumrRaysRewardsContent}>
      <Card variant="cardSecondary" className={classNames.customCard}>
        <IconWithBackground
          iconName={icon.iconName}
          size={icon.size}
          backgroundSize={64}
          wrapperStyle={{ width: 'fit-content' }}
        />
        <Text as="h5" variant="h5">
          {title}
        </Text>
        <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {description}
        </Text>
      </Card>
      <div className={classNames.actionableWrapper}>
        <Link href={button.href} target="_blank">
          <Button variant="primaryLarge">{button.label}</Button>
        </Link>
        <Link href={link.href} target={isOutsideLink(link.href) ? '_blank' : undefined}>
          <WithArrow variant="p3semi">{link.label}</WithArrow>
        </Link>
      </div>
    </div>
  )
}

const data = {
  borrow: {
    title: 'Borrow',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'stack_colorful', size: 24 }}
        title="Borrow for Rays"
        description="Unlock liquidity from your favourite crypto assets with the best protocols."
        button={{ label: 'Borrow', href: `${INTERNAL_LINKS.summerPro}/borrow` }}
        link={{ label: 'Learn more', href: EXTERNAL_LINKS.KB.HELP }}
      />
    ),
  },
  multiply: {
    title: 'Multiply',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'x_colorful', size: 20 }}
        title="Multiply for Rays"
        description="The easiest way to Amplify Exposure to your favourite assets like ETH and BTC."
        button={{ label: 'Multiply', href: `${INTERNAL_LINKS.summerPro}/multiply` }}
        link={{ label: 'Learn more', href: EXTERNAL_LINKS.KB.HELP }}
      />
    ),
  },
  'yield-loop': {
    title: 'Yield loop',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'plant_colorful' }}
        title="Yield loop for Rays"
        description="Enhance your yield up to 7x in a single transaction."
        button={{ label: 'Yield Loop', href: `${INTERNAL_LINKS.summerPro}/earn` }}
        link={{ label: 'Learn more', href: EXTERNAL_LINKS.KB.HELP }}
      />
    ),
  },
  refer: {
    title: 'Refer',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'referer_colorful' }}
        title="Refer for Rays"
        description="Get rewarded in Rays for onboarding your friends to Summer.fi pro products.  "
        button={{ label: 'Refer', href: `${INTERNAL_LINKS.summerPro}/referrals` }}
        link={{ label: 'Learn more', href: EXTERNAL_LINKS.KB.HELP }}
      />
    ),
  },
}

export const SumrRaysRewards = () => {
  return (
    <div className={classNames.sumrRaysRewadsWrapper}>
      <MarketingPointsList header="Get rewarded in $RAYS that convert to $SUMR" data={data} />
    </div>
  )
}
