import { useLayoutEffect } from 'react'

import bridgeSwapHandlerStyles from './BridgeSwapHandler.module.css'

type BridgeSwapHandlerLoaderProps = {
  showNavigationModule: 'swap' | 'bridge' | undefined
  setShowNavigationModule: (show: 'swap' | 'bridge' | undefined) => void
  children: React.ReactNode
}

export const BridgeSwapWrapper = ({
  showNavigationModule,
  setShowNavigationModule,
  children,
}: BridgeSwapHandlerLoaderProps) => {
  const classesList = [
    bridgeSwapHandlerStyles.bridgeSwapWrapper,
    showNavigationModule ? bridgeSwapHandlerStyles.bridgeSwapWrapperActive : '',
  ]

  useLayoutEffect(() => {
    if (showNavigationModule) {
      const closeInfoBox = () => {
        setShowNavigationModule(undefined)
      }

      const listener = document.querySelectorAll(`.${bridgeSwapHandlerStyles.Overlay}`)

      listener[0].addEventListener('click', closeInfoBox)

      return () => {
        listener[0].removeEventListener('click', closeInfoBox)
      }
    }

    return () => {}
  }, [setShowNavigationModule, showNavigationModule])

  return (
    <>
      <div className={classesList.join(' ')}>{children}</div>
      {showNavigationModule && <div className={bridgeSwapHandlerStyles.Overlay} />}
    </>
  )
}
