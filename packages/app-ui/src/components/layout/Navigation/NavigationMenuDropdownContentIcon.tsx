import { type NavigationMenuPanelIcon } from '@summerfi/app-types'
import clsx from 'clsx'
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
}: NavigationMenuDropdownContentIconProps): React.ReactNode {
  const isGlobal = position === 'global'
  const iconForceSize = isGlobal && tokens?.length === 1 ? 40 : 30

  return (
    <div
      className={clsx(
        navigationMenuDropdownContentIconStyles.navigationMenuDropdownContentIconWrapper,
        {
          [navigationMenuDropdownContentIconStyles.navigationMenuDropdownContentIconWrapperGlobal]:
            isGlobal,
        },
      )}
    >
      {icon && (
        <div
          className={clsx(
            'nav-icon',
            navigationMenuDropdownContentIconStyles.navigationMenuDropdownContentIcon,
          )}
        >
          <Icon iconName={icon} size={20} />
        </div>
      )}
      {image && <Image alt={tokens?.join('-') ?? ''} src={image} width={26} />}
      {tokens && <TokensGroup tokens={tokens} forceSize={iconForceSize} />}
    </div>
  )
}
