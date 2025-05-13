import { useEffect, useMemo } from 'react'
import { LiFiWalletManagement, supportedWallets } from '@lifi/wallet-management'
import { LiFiWidget } from '@lifi/widget'
import { Button, useOnboarding } from '@summerfi/app-ui'
import { IconX } from '@tabler/icons-react'
import { useConnectWallet } from '@web3-onboard/react'

import { BridgeSwapOnboarding } from '@/components/molecules/BridgeSwap/BridgeSwapOnboarding'
import { swapWidgetConfig } from '@/constants/swap-widget-config'

import bridgeSwapHandlerStyles from './BridgeSwapHandler.module.css'

type BridgeSwapHandlerProps = {
  showNavigationModule: 'swap' | 'bridge' | undefined
  setShowNavigationModule: (show: 'swap' | 'bridge' | undefined) => void
}

export default ({ showNavigationModule, setShowNavigationModule }: BridgeSwapHandlerProps) => {
  const [{ wallet }] = useConnectWallet()
  const [isOnboarded] = useOnboarding('SwapWidget')
  const walletManagement = useMemo(() => new LiFiWalletManagement(), [])

  useEffect(() => {
    async function autoConnectLiFi() {
      if (!wallet || !isOnboarded) {
        const activeWallets = supportedWallets.filter(
          (supportedWallet) => wallet?.label === supportedWallet.name,
        )

        if (!activeWallets.length) {
          return
        }
        await walletManagement.connect(activeWallets[0])
      }
    }
    void autoConnectLiFi()
  }, [isOnboarded, wallet, walletManagement])

  return (
    <>
      {!isOnboarded ? (
        <BridgeSwapOnboarding />
      ) : (
        <LiFiWidget
          integrator={swapWidgetConfig.integrator}
          config={{ ...swapWidgetConfig, subvariantOptions: showNavigationModule }}
        />
      )}
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
