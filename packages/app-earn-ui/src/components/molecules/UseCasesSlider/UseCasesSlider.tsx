'use client'

import { type ReactNode, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import useCasesSliderStyles from './UseCasesSlider.module.css'

const useCaseSlides = [
  {
    number: '00.',
  },
  {
    number: '01.',
    title: 'Fintechs & Neobanks',
    points: [
      {
        title: 'Capture the Spread',
        body: 'Turn idle user deposits into high-yield stablecoins on the backend while paying a flat rate to retail.',
      },
      {
        title: 'Scale Compliantly',
        body: 'Build seamless global revenue streams perfect for operating out of progressive financial hubs like Singapore without taking on TradFi balance sheet risk.',
      },
    ],
  },
  {
    number: '02.',
    title: 'Custodians',
    points: [
      {
        title: 'Yield-in-Custody',
        body: 'Transform static cold storage into an active, automated revenue generator for your clients.',
      },
      {
        title: 'Complete Control',
        body: 'Maintain absolute authority over the whitelist, ensuring zero interaction with unverified capital.',
      },
    ],
  },
  {
    number: '03.',
    title: 'Exchanges',
    points: [
      {
        title: 'Institutional Treasury Growth',
        body: 'Activate corporate stablecoin reserves through automated, policy-driven RWA exposure.',
      },
      {
        title: 'Client Deposit Productization',
        body: 'Offer compliant yield products to verified participants without adding custody complexity.',
      },
    ],
  },
  {
    number: '04.',
    title: 'Asset Managers & Funds',
    points: [
      {
        title: 'Programmable Mandates',
        body: "Deploy capital into mathematically ring-fenced markets that physically enforce your fund's strict risk limits.",
      },
      {
        title: 'Contagion-Free Yield',
        body: 'Execute complex financial models and leveraged strategies completely isolated from retail market volatility.',
      },
    ],
  },
  {
    number: '05.',
  },
]

export const UseCasesSlider: () => ReactNode = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    startIndex: 0,
    slidesToScroll: 2,
    dragFree: false,
    skipSnaps: false,
    loop: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return

    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return () => {}

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()

    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('reInit', onSelect)
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <>
      <div className={useCasesSliderStyles.useCasesHeader}>
        <Text variant="p1semi">Use Cases</Text>
      </div>
      <div className={useCasesSliderStyles.useCasesCarouselWrapper}>
        <div className={useCasesSliderStyles.useCasesFadeLeft} />
        <div className={useCasesSliderStyles.viewport} ref={emblaRef}>
          <div className={useCasesSliderStyles.container}>
            {useCaseSlides.map((slide) => (
              <div
                className={clsx(useCasesSliderStyles.slide, {
                  [useCasesSliderStyles.smallerSlide]: !slide.title,
                })}
                key={slide.number}
              >
                <div className={useCasesSliderStyles.useCaseSlideCard}>
                  {slide.title ? <Text variant="p3colorful">{slide.number}</Text> : null}
                  <Text variant="h4" className={useCasesSliderStyles.useCaseSlideTitle}>
                    {slide.title}
                  </Text>
                  <div className={useCasesSliderStyles.useCasePoints}>
                    {slide.points?.map((point) => (
                      <div className={useCasesSliderStyles.useCasePoint} key={point.title}>
                        <span className={useCasesSliderStyles.useCasePointBullet} />
                        <div className={useCasesSliderStyles.useCasePointBody}>
                          <Text variant="p1semi">{point.title}</Text>
                          <Text variant="p2" className={useCasesSliderStyles.useCasePointText}>
                            {point.body}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={useCasesSliderStyles.useCasesFadeRight} />
      </div>

      {scrollSnaps.length > 1 && (
        <div className={useCasesSliderStyles.controls}>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className={clsx(
              useCasesSliderStyles.controlButton,
              !canScrollPrev && useCasesSliderStyles.controlButtonDisabled,
            )}
            aria-label="Show previous news item"
          >
            <Icon
              iconName="chevron_left"
              variant="xs"
              color={
                canScrollPrev ? 'var(--color-text-primary)' : 'var(--color-text-primary-disabled)'
              }
            />
          </button>

          <div className={useCasesSliderStyles.dots}>
            {scrollSnaps.map((_, index) => (
              <button
                key={`news-dot-${index}`}
                type="button"
                className={clsx(
                  useCasesSliderStyles.dot,
                  index === selectedIndex && useCasesSliderStyles.dotActive,
                )}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to news slide ${index + 1}`}
                aria-pressed={index === selectedIndex}
              />
            ))}
          </div>

          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className={clsx(
              useCasesSliderStyles.controlButton,
              !canScrollNext && useCasesSliderStyles.controlButtonDisabled,
            )}
            aria-label="Show next news item"
          >
            <Icon
              iconName="chevron_right"
              variant="xs"
              color={
                canScrollNext ? 'var(--color-text-primary)' : 'var(--color-text-primary-disabled)'
              }
            />
          </button>
        </div>
      )}
      <div className={useCasesSliderStyles.useCasesCarouselMobileWrapper}>
        {useCaseSlides
          .filter((slide) => !!slide.title)
          .map((slide) => (
            <div className={clsx(useCasesSliderStyles.slide)} key={`mobile-${slide.number}`}>
              <div className={useCasesSliderStyles.useCaseSlideCard}>
                {slide.title ? <Text variant="p3colorful">{slide.number}</Text> : null}
                <Text variant="h4" className={useCasesSliderStyles.useCaseSlideTitle}>
                  {slide.title}
                </Text>
                <div className={useCasesSliderStyles.useCasePoints}>
                  {slide.points?.map((point) => (
                    <div className={useCasesSliderStyles.useCasePoint} key={point.title}>
                      <span className={useCasesSliderStyles.useCasePointBullet} />
                      <div className={useCasesSliderStyles.useCasePointBody}>
                        <Text variant="p1semi">{point.title}</Text>
                        <Text variant="p2" className={useCasesSliderStyles.useCasePointText}>
                          {point.body}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}
