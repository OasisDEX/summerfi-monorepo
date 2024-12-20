import { type PropsWithChildren, useState } from 'react'
import { Icon } from '@summerfi/app-earn-ui'
import { useToggle } from 'usehooks-ts'

import modalButtonStyles from './ModalButton.module.scss'

export type ModalButtonProps = { onClick: () => void }

type ModalProps = {
  Button: React.ComponentType<PropsWithChildren<ModalButtonProps>>
  ModalContent: React.ComponentType
  modalWrapperStyles?: React.CSSProperties
}

export const ModalButton = ({ Button, ModalContent, modalWrapperStyles }: ModalProps) => {
  const [isOpen, toggleModal] = useToggle(false)
  const [closing, setClosing] = useState(false)

  const handleModalClose = () => {
    setClosing(true)
    setTimeout(() => {
      setTimeout(() => {
        setClosing(false)
      }, 100) // for a good measure = no flicker
      toggleModal()
    }, 200)
  }

  return (
    <>
      <Button onClick={toggleModal} />
      {isOpen && (
        <>
          <div
            className={`${modalButtonStyles.overlay} ${closing ? modalButtonStyles.isOverlayClosing : ''}`}
            onClick={handleModalClose}
          />
          <div
            style={modalWrapperStyles}
            className={`${modalButtonStyles.modalWrapper} ${closing ? modalButtonStyles.isModalWrapperClosing : ''}`}
          >
            <ModalContent />
            <div className={modalButtonStyles.closeButton} onClick={handleModalClose}>
              <Icon
                iconName="tabler_x"
                style={{
                  stroke: 'white',
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
