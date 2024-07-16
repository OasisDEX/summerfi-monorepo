import { Button, Text } from '@summerfi/app-ui'
import { IconX } from '@tabler/icons-react'

import bridgeSwapHandlerStyles from './BridgeSwapHandler.module.scss'

type BridgeSwapHandlerProps = {
  showNavigationModule: 'swap' | 'bridge' | undefined
  setShowNavigationModule: (show: 'swap' | 'bridge' | undefined) => void
}

export default ({
  showNavigationModule: _showNavigationModule,
  setShowNavigationModule,
}: BridgeSwapHandlerProps) => {
  return (
    <>
      <Text as="p" style={{ textAlign: 'center', marginTop: '128px' }}>
        Disabled temporarily.
      </Text>
      <Button
        variant="unstyled"
        onClick={() => {
          setShowNavigationModule(undefined)
        }}
      >
        <div className={bridgeSwapHandlerStyles.closeButton}>
          <IconX color="var(--color-neutral-80)" />
        </div>
      </Button>
    </>
  )
}
