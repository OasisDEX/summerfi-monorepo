import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import titleWithIconStyles from './TitleWithIcon.module.scss'
import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

export type TitleWithIconProps = {
  title: string
  titleVariant?: TextVariants
  tooltip?: string
  iconName?: IconNamesList
  className?: string
  color?: string
}

export const TitleWithIcon = ({
  title,
  titleVariant,
  tooltip,
  iconName,
  className,
  color,
}: TitleWithIconProps) => {
  return (
    <div className={clsx(className, titleWithIconStyles.titleWithIcon)}>
      <Text as="p" variant={titleVariant ?? 'p3semi'} style={{ color }}>
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
