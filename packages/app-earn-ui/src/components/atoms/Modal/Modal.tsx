'use client'
import { type FC, type ReactNode, Suspense, useEffect, useMemo, useRef } from 'react'

import { Button } from '@/components/atoms/Button/Button.tsx'
import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { LoadingSpinner } from '@/components/molecules/LoadingSpinner/LoadingSpinner'

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
  const defaultBodyOverflow = useMemo(() => document.body.style.overflow, [])

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
      document.body.style.overflow = defaultBodyOverflow

      ref.current?.close()
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.body.style.overflow = defaultBodyOverflow
    }
  }, [openModal, closeModal, disableCloseOutside, defaultBodyOverflow])

  return (
    <dialog ref={ref} onCancel={closeModal} className={modalStyles.dialog}>
      <div id="modal-portal" style={{ position: 'absolute' }} />
      <Suspense fallback={<LoadingSpinner size={40} />}>{openModal ? children : null}</Suspense>
      {withCloseButton && (
        <Button variant="unstyled" onClick={closeModal} className={modalStyles.closeButton}>
          <Icon iconName="close" variant="xs" color="var(--earn-protocol-secondary-40)" />
        </Button>
      )}
    </dialog>
  )
}
