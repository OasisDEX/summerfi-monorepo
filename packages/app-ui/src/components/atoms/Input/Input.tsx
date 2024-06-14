import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { Icon } from '@/components/atoms/Icon/Icon'
import { IconNamesList } from '@/tokens/types'

import classNames, { ClassNames } from '@/components/atoms/Input/Input.module.scss'

export const Input: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    variant?: ClassNames
    className?: string
    icon?: {
      name: IconNamesList
      size?: number
    }
  }
> = ({ variant = 'default', className, icon, ...rest }) => {
  return (
    <div className={classNames.wrapper}>
      {icon && (
        <div className={classNames.iconWrapper}>
          <Icon iconName={icon.name} size={icon.size} variant="s" />
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
