'use client'
import { type FC, type ReactNode } from 'react'
import { type EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import { SlideCarouselButton, usePrevNextButtons } from './SlideCarouselButtons'

import classNames from './SlideCarousel.module.scss'

type PropType = {
  title: ReactNode
  slides: ReactNode[]
  options?: EmblaOptionsType
}

export const SlideCarousel: FC<PropType> = ({ slides, options, title }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  return (
    <section className={classNames.embla}>
      <div className={classNames.emblaControls}>
        {title}
        <div className={classNames.emblaButtons}>
          <SlideCarouselButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            direction="left"
          />
          <SlideCarouselButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            direction="right"
          />
        </div>
      </div>
      <div className={classNames.emblaViewport} ref={emblaRef}>
        <div className={classNames.emblaContainer}>
          {slides.map((slide, idx) => (
            <div className={classNames.emblaSlide} key={idx}>
              <div className={classNames.emblaSlideNumber}>{slide}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
