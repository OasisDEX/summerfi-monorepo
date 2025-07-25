'use client'
import { type FC, type ReactNode, useState } from 'react'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Modal } from '@/components/atoms/Modal/Modal'
import { MobileDrawer } from '@/components/molecules/MobileDrawer/MobileDrawer'

interface NavigationConfigProps {
  isMobileOrTablet: boolean
  children: (handleOpenClose: () => void) => ReactNode
}

export const NavigationConfig: FC<NavigationConfigProps> = ({ isMobileOrTablet, children }) => {
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
          {children(handleOpenClose)}
        </MobileDrawer>
      ) : (
        <Modal openModal={isOpen} closeModal={handleOpenClose}>
          {children(handleOpenClose)}
        </Modal>
      )}
    </>
  )
}
