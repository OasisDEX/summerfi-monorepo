'use client'
import { type FC, type ReactNode, useEffect, useRef } from 'react'

interface ModalProps {
  openModal: boolean
  closeModal: () => void
  children: ReactNode
}

export const Modal: FC<ModalProps> = ({ openModal, closeModal, children }) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && event.target === ref.current) {
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
    <dialog
      ref={ref}
      onCancel={closeModal}
      style={{ border: 'unset', padding: 'unset', background: 'unset' }}
    >
      {children}
    </dialog>
  )
}
