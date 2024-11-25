'use client'
import { type FC, type ReactNode, useEffect, useRef } from 'react'

import { Button } from '@/components/atoms/Button/Button.tsx'
import { Icon } from '@/components/atoms/Icon/Icon.tsx'

import modalStyles from '@/components/atoms/Modal/Modal.module.scss'

interface ModalProps {
  openModal: boolean
  closeModal: () => void
  children: ReactNode
  disableCloseOutside?: boolean
  withCloseButton?: boolean
}

export const Modal: FC<ModalProps> = ({
  openModal,
  closeModal,
  children,
  disableCloseOutside = false,
  withCloseButton = true,
}) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const handleOutsideClick = (ev: MouseEvent) => {
      if (
        ref.current &&
        ev.target instanceof Node &&
        ev.target === ref.current &&
        !disableCloseOutside
      ) {
        closeModal()
      }
    }

    if (openModal) {
      ref.current?.showModal()
      document.addEventListener('mousedown', handleOutsideClick)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      ref.current?.close()
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [openModal, closeModal, disableCloseOutside])

  return (
    <dialog ref={ref} onCancel={closeModal} className={modalStyles.dialog}>
      <div id="modal-portal" style={{ position: 'absolute' }} />
      {children}
      {withCloseButton && (
        <Button variant="unstyled" onClick={closeModal} className={modalStyles.closeButton}>
          <Icon iconName="close" variant="xs" color="var(--earn-protocol-secondary-40)" />
        </Button>
      )}
    </dialog>
  )
}
