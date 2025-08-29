import { type CSSProperties, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'
import identity from 'lodash-es/identity'
import pickBy from 'lodash-es/pickBy'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import type TextVariants from '@/components/atoms/Text/Text.module.css'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import titleWithIconStyles from './TitleWithIcon.module.css'

type TitleWithIconProps = {
  title: ReactNode
  titleVariant?: keyof typeof TextVariants
  tooltip?: string
  iconName?: IconNamesList
  className?: string
  color?: string
  titleStyle?: CSSProperties
  tooltipWrapperStyles?: CSSProperties
}

export const TitleWithIcon = ({
  title,
  titleVariant,
  tooltip,
  iconName,
  className,
  color,
  titleStyle,
  tooltipWrapperStyles,
}: TitleWithIconProps): React.ReactNode => {
  // clear undefined values from style properties to avoid overwrite
  const resolvedTitleStyle = pickBy(titleStyle, identity)

  return (
    <div className={clsx(className, titleWithIconStyles.titleWithIcon)}>
      <Text as="div" variant={titleVariant ?? 'p3semi'} style={{ color, ...resolvedTitleStyle }}>
        {title}
      </Text>
      {iconName && !tooltip && <Icon iconName={iconName} size={18} color={color} />}
      {iconName && tooltip && (
        <Tooltip tooltip={tooltip} tooltipWrapperStyles={tooltipWrapperStyles}>
          <Icon iconName={iconName} size={18} color={color} />
        </Tooltip>
      )}
    </div>
  )
}
