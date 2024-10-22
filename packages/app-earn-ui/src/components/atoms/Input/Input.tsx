import {
  type CSSProperties,
  type DetailedHTMLProps,
  type FC,
  type InputHTMLAttributes,
} from 'react'
import { type IconNamesList } from '@summerfi/app-types'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import inputStyles, { type ClassNames } from '@/components/atoms/Input/Input.module.scss'

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
    secondaryValue?: string
  }
> = ({ variant = 'default', className, CustomIcon, icon, wrapperStyles, ...rest }) => {
  return (
    <div className={inputStyles.wrapper} style={wrapperStyles}>
      {icon && (
        <div className={inputStyles.iconWrapper}>
          <Icon iconName={icon.name} size={icon.size} variant="s" />
        </div>
      )}
      {CustomIcon && (
        <div className={inputStyles.iconWrapper}>
          <CustomIcon />
        </div>
      )}
      <input
        className={[
          icon ? inputStyles.withIconOffset : '',
          getAtomClassList({ className, variant: inputStyles[variant] }),
        ].join(' ')}
        {...rest}
      />
      {rest.secondaryValue !== '0' && rest.secondaryValue !== '' && (
        <Text
          as="p"
          variant="p3semi"
          style={{
            position: 'absolute',
            right: 0,
            bottom: '-5px',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          {rest.secondaryValue}
        </Text>
      )}
    </div>
  )
}
