import { type ComponentPropsWithRef, type FC, useCallback, useEffect, useState } from 'react'
import { type EmblaCarouselType } from 'embla-carousel'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
  currentSnap: number
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [currentSnap, setCurrentSnap] = useState(0)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    setCurrentSnap(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    setCurrentSnap(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setPrevBtnDisabled(!api.canScrollPrev())
    setNextBtnDisabled(!api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
    currentSnap,
  }
}

type PropType = ComponentPropsWithRef<'button'> & {
  direction: 'left' | 'right'
  iconVariant: 'xs' | 'xxs'
}

export const SlideCarouselButton: FC<PropType> = (props) => {
  const { direction, iconVariant, ...restProps } = props

  return (
    <Button variant="unstyled" {...restProps}>
      <Icon
        iconName={`chevron_${direction}`}
        color={restProps.disabled ? 'rgba(119, 117, 118, 1)' : 'rgba(255, 251, 253, 1)'}
        variant={iconVariant}
      />
    </Button>
  )
}
