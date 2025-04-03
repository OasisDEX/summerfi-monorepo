import { type CSSProperties, type FC, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

import { Card, type CardVariant } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'

import classNames from './LinkCard.module.scss'

export interface LinkCardWithIconName {
  title: string
  description: string
  link: { href?: string; action?: () => void; label?: string }
  iconName: IconNamesList
  variant?: CardVariant
  style?: CSSProperties
  target?: string
}

export interface LinkCardWithIcon {
  title: string
  description: string
  link: { href?: string; action?: () => void; label?: string }
  icon: ReactNode
  variant?: CardVariant
  style?: CSSProperties
  target?: string
}

type LinkCardProps = LinkCardWithIconName | LinkCardWithIcon

export const LinkCard: FC<LinkCardProps> = ({
  title,
  link,
  description,
  variant,
  style,
  target,
  ...rest
}) => {
  return (
    <Card
      variant={variant}
      key={title}
      style={{ cursor: link.action ? 'pointer' : 'default', ...style }}
      className={classNames.wrapper}
      onClick={link.action}
    >
      <div className={classNames.leftWrapper}>
        {'icon' in rest ? rest.icon : <Icon iconName={rest.iconName} variant="m" />}
        <div className={classNames.leftTextualWrapper}>
          <Text as="p" variant="p2">
            {title}
          </Text>
          <Text as="p" variant="p3" className={classNames.description}>
            {description}
          </Text>
        </div>
      </div>
      {link.href ? (
        <Link href={link.href} className={classNames.linkWrapper} target={target}>
          <WithArrow as="p" variant="p3semi" className={classNames.link}>
            {link.label}
          </WithArrow>
        </Link>
      ) : (
        <div className={classNames.linkWrapper}>
          <WithArrow as="p" variant="p3semi" className={classNames.link}>
            {link.label}
          </WithArrow>
        </div>
      )}
    </Card>
  )
}
