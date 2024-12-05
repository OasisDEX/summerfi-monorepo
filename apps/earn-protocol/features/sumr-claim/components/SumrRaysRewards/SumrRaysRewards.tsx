import type { FC } from 'react'
import {
  Button,
  Card,
  type IconNamesList,
  IconWithBackground,
  MarketingPointsList,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './SumrRaysRewards.module.scss'

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
        <Link href={button.href}>
          <Button variant="primaryLarge">{button.label}</Button>
        </Link>
        <Link href={link.href}>
          <WithArrow>{link.label}</WithArrow>
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
        description="Approve or off board markets, ensuring only the best and safest yield opportunities are available."
        button={{ label: 'Borrow', href: '/' }}
        link={{ label: 'Learn more', href: '/' }}
      />
    ),
  },
  multiply: {
    title: 'Multiply',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'x_colorful', size: 20 }}
        title="Multiply for Rays"
        description="Approve or off board markets, ensuring only the best and safest yield opportunities are available."
        button={{ label: 'Multiply', href: '/' }}
        link={{ label: 'Learn more', href: '/' }}
      />
    ),
  },
  'yield-loop': {
    title: 'Yield loop',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'plant_colorful' }}
        title="Yield loop for Rays"
        description="Approve or off board markets, ensuring only the best and safest yield opportunities are available."
        button={{ label: 'Multiply', href: '/' }}
        link={{ label: 'Learn more', href: '/' }}
      />
    ),
  },
  refer: {
    title: 'Refer',
    content: (
      <SumrRaysRewardsContent
        icon={{ iconName: 'referer_colorful' }}
        title="Refer for Rays"
        description="Approve or off board markets, ensuring only the best and safest yield opportunities are available."
        button={{ label: 'Refer', href: '/' }}
        link={{ label: 'Learn more', href: '/' }}
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
