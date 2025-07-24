'use client'

import { type FC, useState } from 'react'
import { Button, Card, Icon, ZoomableImage } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { MerchandiseType } from '@/features/merchandise/types'

import classNames from './MerchandiseImages.module.css'

import hoodieImageBack from '@/public/img/beach_club/merch_hoodie_back.png'
import hoodieImageFront from '@/public/img/beach_club/merch_hoodie_front.png'
import tShirtImageBack from '@/public/img/beach_club/merch_t_shirt_back.png'
import tShirtImageFront from '@/public/img/beach_club/merch_t_shirt_front.png'

const merchImagesMap = {
  [MerchandiseType.T_SHIRT]: [tShirtImageFront, tShirtImageBack],
  [MerchandiseType.HOODIE]: [hoodieImageFront, hoodieImageBack],
}

const imageCardBgColorMap = {
  [MerchandiseType.T_SHIRT]: 'rgba(92, 237, 242, 1)',
  [MerchandiseType.HOODIE]: 'var(--earn-protocol-primary-70)',
}

interface MerchandiseImagesProps {
  type: MerchandiseType
}

export const MerchandiseImages: FC<MerchandiseImagesProps> = ({ type }) => {
  const [slideIndex, setSlideIndex] = useState(0)

  if (type === MerchandiseType.NFT) {
    return null
  }

  const handleSlide = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && slideIndex > 0) {
      setSlideIndex(slideIndex - 1)
    } else if (direction === 'next' && slideIndex < merchImagesMap[type].length - 1) {
      setSlideIndex(slideIndex + 1)
    }
  }

  const isPrevDisabled = slideIndex === 0
  const isNextDisabled = slideIndex === merchImagesMap[type].length - 1

  const controls = (
    <div className={classNames.merchandiseControlsWrapper}>
      <Button variant="unstyled" onClick={() => handleSlide('prev')} disabled={isPrevDisabled}>
        <Icon iconName="chevron_left" size={14} />
      </Button>
      <Button variant="unstyled" onClick={() => handleSlide('next')} disabled={isNextDisabled}>
        <Icon iconName="chevron_right" size={14} />
      </Button>
    </div>
  )

  return (
    <Card variant="cardSecondary" className={classNames.merchandisePageViewMainContentRight}>
      <ZoomableImage
        className={classNames.imageWrapper}
        style={{ backgroundColor: imageCardBgColorMap[type] }}
        controls={controls}
      >
        <Image src={merchImagesMap[type][slideIndex]} alt={type} height={374} quality={100} />
      </ZoomableImage>
      {controls}
    </Card>
  )
}
