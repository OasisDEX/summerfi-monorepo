import { useState } from 'react'
import { Button, Icon, MobileDrawer, Modal, useMobileCheck } from '@summerfi/app-earn-ui'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { NavConfigContent } from '@/features/nav-config/components/NavConfigContent/NavConfigContent'

export const NavConfig = () => {
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)

  const [isOpen, setIsOpen] = useState(false)

  const handleOpenClose = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      <Button
        variant="secondarySmall"
        onClick={handleOpenClose}
        style={{ paddingLeft: '7px', paddingRight: '7px' }}
      >
        <Icon iconName="cog" size={20} />
      </Button>
      {isMobileOrTablet ? (
        <MobileDrawer isOpen={isOpen} onClose={handleOpenClose} height="auto">
          <NavConfigContent handleOpenClose={handleOpenClose} />
        </MobileDrawer>
      ) : (
        <Modal openModal={isOpen} closeModal={handleOpenClose}>
          <NavConfigContent handleOpenClose={handleOpenClose} />
        </Modal>
      )}
    </>
  )
}
