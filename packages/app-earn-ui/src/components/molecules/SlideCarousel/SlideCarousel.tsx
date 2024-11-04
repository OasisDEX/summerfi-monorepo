'use client'
import { type FC, type ReactNode, useEffect, useState } from 'react'
import { type EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import { SlideCarouselButton, usePrevNextButtons } from './SlideCarouselButtons'

import classNames from './SlideCarousel.module.scss'

export enum SlideCarouselButtonPosition {
  TOP = 'TOP',
  ON_SIDES = 'ON_SIDES',
}

type PropType = {
  title?: ReactNode
  slides: ReactNode[]
  options?: EmblaOptionsType
  buttonPosition?: SlideCarouselButtonPosition
  slidesPerPage?: number
  withDots?: boolean
  withAutoPlay?: boolean
}

export const SlideCarousel: FC<PropType> = ({
  slides,
  options,
  title,
  buttonPosition = SlideCarouselButtonPosition.TOP,
  slidesPerPage = 2,
  withDots = false,
  withAutoPlay = false,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [autoSlideDirection, setAutoSlideDirection] = useState<'prev' | 'next'>('next')

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick, currentSnap } =
    usePrevNextButtons(emblaApi)

  const sectionClassName = {
    1: classNames.emblaOneSlide,
    2: classNames.emblaTwoSlides,
    3: classNames.emblaThreeSlides,
  }

  useEffect(() => {
    if (withAutoPlay) {
      const directionFn = {
        prev: () => onPrevButtonClick(),
        next: () => onNextButtonClick(),
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
  ])

  return (
    <section className={`${classNames.embla} ${sectionClassName[slidesPerPage]}`}>
      {buttonPosition === SlideCarouselButtonPosition.TOP && (
        <div className={classNames.emblaControls}>
          {title}
          <div className={classNames.emblaButtons}>
            <SlideCarouselButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              direction="left"
              iconVariant="xxs"
            />
            <SlideCarouselButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              direction="right"
              iconVariant="xxs"
            />
          </div>
        </div>
      )}
      {buttonPosition === SlideCarouselButtonPosition.ON_SIDES && (
        <div className={classNames.emblaButtonsOnSidesWrapper}>
          <div className={classNames.emblaSideButton}>
            <SlideCarouselButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              direction="left"
              iconVariant="xs"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {withDots && (
              <div className={classNames.dots}>
                {slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${classNames.dot} ${idx === currentSnap ? classNames.dotActive : ''}`}
                  />
                ))}
              </div>
            )}
            <div className={classNames.emblaViewport} ref={emblaRef}>
              <div className={classNames.emblaContainer}>
                {slides.map((slide, idx) => (
                  <div className={classNames.emblaSlide} key={idx}>
                    <div className={classNames.emblaSlideNumber}>{slide}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={classNames.emblaSideButton}>
            <SlideCarouselButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              direction="right"
              iconVariant="xs"
            />
          </div>
        </div>
      )}
      {buttonPosition === SlideCarouselButtonPosition.TOP && (
        <div className={classNames.emblaViewport} ref={emblaRef}>
          <div className={classNames.emblaContainer}>
            {slides.map((slide, idx) => (
              <div className={classNames.emblaSlide} key={idx}>
                <div className={classNames.emblaSlideNumber}>{slide}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
