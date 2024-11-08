import { type CSSProperties, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'
import { identity, pickBy } from 'lodash-es'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import titleWithIconStyles from './TitleWithIcon.module.scss'
import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

export type TitleWithIconProps = {
  title: ReactNode
  titleVariant?: TextVariants
  tooltip?: string
  iconName?: IconNamesList
  className?: string
  color?: string
  titleStyle?: CSSProperties
}

export const TitleWithIcon = ({
  title,
  titleVariant,
  tooltip,
  iconName,
  className,
  color,
  titleStyle,
}: TitleWithIconProps) => {
  // clear undefined values from style properties to avoid overwrite
  const resolvedTitleStyle = pickBy(titleStyle, identity)

  return (
    <div className={clsx(className, titleWithIconStyles.titleWithIcon)}>
      <Text as="p" variant={titleVariant ?? 'p3semi'} style={{ color, ...resolvedTitleStyle }}>
        {title}
      </Text>
      {iconName && !tooltip && <Icon iconName={iconName} size={18} color={color} />}
      {iconName && tooltip && (
        <Tooltip tooltip={tooltip}>
          <Icon iconName={iconName} size={18} color={color} />
        </Tooltip>
      )}
    </div>
  )
}
