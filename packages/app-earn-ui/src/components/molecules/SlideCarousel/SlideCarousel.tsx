'use client'
import { type FC, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { type EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import { SlideCarouselButton, usePrevNextButtons } from './SlideCarouselButtons'

import classNames from './SlideCarousel.module.css'

export enum SlideCarouselButtonPosition {
  TOP = 'TOP',
  ON_SIDES = 'ON_SIDES',
}

export enum SliderCarouselDotsPosition {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

type PropType = {
  title?: ReactNode
  slides: ReactNode[]
  options?: EmblaOptionsType
  buttonPosition?: SlideCarouselButtonPosition
  withButtons?: boolean
  slidesPerPage?: number
  withDots?: boolean
  dotsPosition?: SliderCarouselDotsPosition
  withAutoPlay?: boolean
  portalElementId?: string
  carouselId?: string
  handleButtonClick?: (buttonName: string) => void
}

export const SlideCarousel: FC<PropType> = ({
  slides,
  options,
  title,
  buttonPosition = SlideCarouselButtonPosition.TOP,
  withButtons = true,
  slidesPerPage = 2,
  withDots = false,
  dotsPosition = SliderCarouselDotsPosition.TOP,
  withAutoPlay = false,
  portalElementId,
  carouselId,
  handleButtonClick,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [autoSlideDirection, setAutoSlideDirection] = useState<'prev' | 'next'>('next')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const handleOnPrevButtonClick = useCallback(() => {
    handleButtonClick?.(`${carouselId}-prev-button-click`)
    onPrevButtonClick()
  }, [onPrevButtonClick, carouselId, handleButtonClick])

  const handleOnNextButtonClick = useCallback(() => {
    handleButtonClick?.(`${carouselId}-next-button-click`)
    onNextButtonClick()
  }, [onNextButtonClick, carouselId, handleButtonClick])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const sectionClassName = {
    1: classNames.emblaOneSlide,
    2: classNames.emblaTwoSlides,
    3: classNames.emblaThreeSlides,
  }

  useEffect(() => {
    if (withAutoPlay) {
      const directionFn = {
        prev: () => handleOnPrevButtonClick(),
        next: () => handleOnNextButtonClick(),
      }

      const selfSlideInterval = setInterval(() => {
        if (nextBtnDisabled && !prevBtnDisabled) {
          setAutoSlideDirection('prev')
          directionFn.prev()

          return
        }

        if (prevBtnDisabled && !nextBtnDisabled) {
          setAutoSlideDirection('next')
          directionFn.next()

          return
        }

        directionFn[autoSlideDirection]()
      }, 7000)

      return () => clearInterval(selfSlideInterval)
    }

    return () => null
  }, [
    onNextButtonClick,
    onPrevButtonClick,
    nextBtnDisabled,
    prevBtnDisabled,
    autoSlideDirection,
    withAutoPlay,
    handleOnPrevButtonClick,
    handleOnNextButtonClick,
  ])

  const portal = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (portal.current === null && portalElementId) {
      const element = document.getElementById(portalElementId) as HTMLDivElement | null

      if (element) {
        portal.current = element
      }
    }
  }, [portal, portalElementId])

  const defaultControls = (
    <div
      className={classNames.emblaButtons}
      style={{ display: slides.length > 2 ? 'grid' : 'none' }}
    >
      <SlideCarouselButton
        onClick={handleOnPrevButtonClick}
        disabled={prevBtnDisabled}
        direction="left"
        iconVariant="xxs"
      />
      <SlideCarouselButton
        onClick={handleOnNextButtonClick}
        disabled={nextBtnDisabled}
        direction="right"
        iconVariant="xxs"
      />
    </div>
  )

  return (
    <section className={`${classNames.embla} ${sectionClassName[slidesPerPage]}`}>
      {buttonPosition === SlideCarouselButtonPosition.TOP && withButtons && (
        <div className={portal.current ? classNames.emblaControlsPortal : classNames.emblaControls}>
          {title}
          {portal.current ? createPortal(defaultControls, portal.current) : defaultControls}
        </div>
      )}
      {buttonPosition === SlideCarouselButtonPosition.ON_SIDES && (
        <div className={classNames.emblaButtonsOnSidesWrapper}>
          {withButtons && (
            <div className={classNames.emblaSideButton}>
              <SlideCarouselButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                direction="left"
                iconVariant="xs"
              />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {withDots && dotsPosition === SliderCarouselDotsPosition.TOP && (
              <div className={classNames.dots}>
                {slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${classNames.dot} ${idx === selectedIndex ? classNames.dotActive : ''}`}
                  />
                ))}
              </div>
            )}
            <div className={classNames.emblaViewport} ref={emblaRef}>
              <div className={classNames.emblaContainer}>
                {slides.map((slide, idx) => (
                  <div className={clsx(classNames.emblaSlide, 'embla__slide')} key={idx}>
                    <div className={classNames.emblaSlideNumber}>{slide}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {withButtons && (
            <div className={classNames.emblaSideButton}>
              <SlideCarouselButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                direction="right"
                iconVariant="xs"
              />
            </div>
          )}
        </div>
      )}
      {buttonPosition === SlideCarouselButtonPosition.TOP && (
        <div className={classNames.emblaViewport} ref={emblaRef}>
          <div className={classNames.emblaContainer}>
            {slides.map((slide, idx) => (
              <div className={clsx(classNames.emblaSlide, 'embla__slide')} key={idx}>
                <div className={classNames.emblaSlideNumber}>{slide}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {withDots && dotsPosition === SliderCarouselDotsPosition.BOTTOM && (
        <div className={classNames.dotsBottom}>
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`${classNames.dot} ${idx === selectedIndex ? classNames.dotActive : ''}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
