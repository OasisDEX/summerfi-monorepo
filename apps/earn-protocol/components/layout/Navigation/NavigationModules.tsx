import { NavigationMenuDropdownContentListItem } from '@summerfi/app-ui'

type NavigationModuleBridgeProps = {
  setShowNavigationModule: (show: 'swap' | 'bridge' | undefined) => void
}

export const NavigationModuleBridge = ({
  setShowNavigationModule,
}: NavigationModuleBridgeProps) => (
  <div style={{ cursor: 'pointer' }}>
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
  </div>
)

export const NavigationModuleSwap = ({ setShowNavigationModule }: NavigationModuleBridgeProps) => (
  <div style={{ cursor: 'pointer' }}>
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
  </div>
)
