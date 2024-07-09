'use client'
import { FC, ReactNode, useEffect, useRef } from 'react'

interface ModalProps {
  openModal: boolean
  closeModal: () => void
  children: ReactNode
}

export const Modal: FC<ModalProps> = ({ openModal, closeModal, children }) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [openModal])

  return (
    <dialog
      ref={ref}
      onCancel={closeModal}
      style={{ border: 'unset', padding: 'unset', background: 'unset' }}
    >
      {children}
    </dialog>
  )
}
