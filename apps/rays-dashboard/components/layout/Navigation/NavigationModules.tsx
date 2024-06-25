import { NavigationMenuDropdownContentListItem } from '@summerfi/app-ui'

type NavigationModuleBridgeProps = {
  setShowNavigationModule: (show: 'swap' | 'bridge' | undefined) => void
}

export const NavigationModuleBridge = ({
  setShowNavigationModule,
}: NavigationModuleBridgeProps) => (
  <NavigationMenuDropdownContentListItem
    title="Bridge on Summer.fi"
    description="Bridge to new networks in a click."
    icon={{
      position: 'global',
      icon: 'bridge',
    }}
    onClick={() => {
      setShowNavigationModule('bridge')
    }}
  />
)

export const NavigationModuleSwap = ({ setShowNavigationModule }: NavigationModuleBridgeProps) => (
  <NavigationMenuDropdownContentListItem
    title="Swap on Summer.fi"
    description="Swap any token, anytime."
    icon={{
      position: 'global',
      icon: 'exchange',
    }}
    onClick={() => {
      setShowNavigationModule('swap')
    }}
  />
)
