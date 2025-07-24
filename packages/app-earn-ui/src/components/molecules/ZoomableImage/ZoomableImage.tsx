'use client'

import { type FC, useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import styles from './ZoomableImage.module.css'

interface ZoomableImageProps {
  children: React.ReactElement<{ src: string; alt: string }>
  style?: React.CSSProperties
  className?: string
  controls?: React.ReactNode
}

export const ZoomableImage: FC<ZoomableImageProps> = ({ children, style, className, controls }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoomedImageSrc, setZoomedImageSrc] = useState('')
  const [zoomedImageAlt, setZoomedImageAlt] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setZoomedImageSrc('')
    setZoomedImageAlt('')
  }, [])

  const handleClickOutside = useCallback(
    (ev: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(ev.target as Node)) {
        closeModal()
      }
    },
    [closeModal],
  )

  const handleKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        closeModal()
      }
    },
    [closeModal],
  )

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, handleClickOutside, handleKeyDown])

  useEffect(() => {
    setZoomedImageSrc(children.props.src)
    setZoomedImageAlt(children.props.alt)
  }, [children.props.src, children.props.alt])

  const handleThumbnailClick = () => {
    const imageProps = children.props

    setZoomedImageSrc(imageProps.src)
    setZoomedImageAlt(imageProps.alt)
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        onClick={handleThumbnailClick}
        style={{ cursor: 'pointer', ...style }}
        className={className}
      >
        {children}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div
            className={clsx(styles.modalContent, className)}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={zoomedImageAlt}
            style={style}
          >
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close zoomed image"
            >
              &times;
            </button>
            {zoomedImageSrc && (
              <Image
                src={zoomedImageSrc}
                alt={zoomedImageAlt}
                quality={100}
                priority
                className={styles.zoomedImage}
              />
            )}
            <div className={styles.controls}>{controls}</div>
          </div>
        </div>
      )}
    </>
  )
}
