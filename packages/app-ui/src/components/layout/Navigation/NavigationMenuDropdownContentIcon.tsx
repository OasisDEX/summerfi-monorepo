import { type NavigationMenuPanelIcon } from '@summerfi/app-types'
import classNames from 'classnames'
import Image from 'next/image'

import { Icon } from '@/components/atoms/Icon/Icon'
import { TokensGroup } from '@/components/molecules/TokensGroup/TokensGroup'

import navigationMenuDropdownContentIconStyles from './NavigationMenuDropdownContentIcon.module.scss'

export type NavigationMenuDropdownContentIconProps = NavigationMenuPanelIcon

export function NavigationMenuDropdownContentIcon({
  icon,
  image,
  position,
  tokens,
  customIcon: CustomIcon,
  customIconProps,
}: NavigationMenuDropdownContentIconProps) {
  const isGlobal = position === 'global'
  const iconForceSize = isGlobal && tokens?.length === 1 ? 40 : 30

  return (
    <div
      className={classNames(
        navigationMenuDropdownContentIconStyles.navigationMenuDropdownContentIconWrapper,
        {
          [navigationMenuDropdownContentIconStyles.navigationMenuDropdownContentIconWrapperGlobal]:
            isGlobal,
        },
      )}
    >
      {(icon ?? CustomIcon) && (
        <div
          className={classNames(
            'nav-icon',
            navigationMenuDropdownContentIconStyles.navigationMenuDropdownContentIcon,
          )}
        >
          {icon && <Icon iconName={icon} size={20} />}
          {CustomIcon && <CustomIcon {...customIconProps} size={customIconProps?.size ?? 20} />}
        </div>
      )}
      {image && <Image alt={tokens?.join('-') ?? ''} src={image} width={26} />}
      {tokens && <TokensGroup tokens={tokens} forceSize={iconForceSize} />}
    </div>
  )
}
