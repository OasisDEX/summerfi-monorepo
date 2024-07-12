import {
  type CSSProperties,
  type DetailedHTMLProps,
  type FC,
  type InputHTMLAttributes,
} from 'react'
import { type IconNamesList } from '@summerfi/app-types'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { Icon } from '@/components/atoms/Icon/Icon'

import classNames, { type ClassNames } from '@/components/atoms/Input/Input.module.scss'

export const Input: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    variant?: ClassNames
    className?: string
    icon?: {
      name: IconNamesList
      size?: number
    }
    CustomIcon?: FC
    wrapperStyles?: CSSProperties
  }
> = ({ variant = 'default', className, CustomIcon, icon, wrapperStyles, ...rest }) => {
  return (
    <div className={classNames.wrapper} style={wrapperStyles}>
      {icon && (
        <div className={classNames.iconWrapper}>
          <Icon iconName={icon.name} size={icon.size} variant="s" />
        </div>
      )}
      {CustomIcon && (
        <div className={classNames.iconWrapper}>
          <CustomIcon />
        </div>
      )}
      <input
        className={[
          icon ? classNames.withIconOffset : '',
          getAtomClassList({ className, variant: classNames[variant] }),
        ].join(' ')}
        {...rest}
      />
    </div>
  )
}
