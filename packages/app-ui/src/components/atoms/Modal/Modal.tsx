'use client'
import { type FC, type ReactNode, useEffect, useRef } from 'react'

import classNames from '@/components/atoms/Modal/Modal.module.scss'

interface ModalProps {
  openModal: boolean
  closeModal: () => void
  children: ReactNode
}

export const Modal: FC<ModalProps> = ({ openModal, closeModal, children }) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const handleOutsideClick = (ev: MouseEvent) => {
      if (ref.current && ev.target instanceof Node && ev.target === ref.current) {
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
  }, [openModal, closeModal])

  return (
    <dialog ref={ref} onCancel={closeModal} className={classNames.dialog}>
      {children}
    </dialog>
  )
}
