'use client'
import { type FC, type ReactNode, useEffect, useRef } from 'react'

import modalStyles from '@/components/atoms/Modal/Modal.module.css'

interface ModalProps {
  openModal: boolean
  closeModal: () => void
  children: ReactNode
  disableCloseOutside?: boolean
}

export const Modal: FC<ModalProps> = ({
  openModal,
  closeModal,
  children,
  disableCloseOutside = false,
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
    } else {
      ref.current?.close()
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [openModal, closeModal, disableCloseOutside])

  return (
    <dialog ref={ref} onCancel={closeModal} className={modalStyles.dialog}>
      {children}
    </dialog>
  )
}
