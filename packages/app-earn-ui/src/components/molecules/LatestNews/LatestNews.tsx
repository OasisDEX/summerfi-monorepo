import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { type BlogPosts } from '@summerfi/app-types'
import clsx from 'clsx'
import dayjs from 'dayjs'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import styles from './LatestNews.module.css'

type LatestNewsProps = {
  news?: BlogPosts['news']
}

export const LatestNews: (props: LatestNewsProps) => ReactNode | null = ({ news }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    skipSnaps: false,
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

  if (!news || news.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <Text variant="h3" as="h3" className={styles.heading}>
        Latest news
      </Text>

      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {news.map((item) => (
            <article className={styles.slide} key={item.id}>
              <Link href={item.url} prefetch={false} className={styles.card} target="_blank">
                <div className={styles.media}>
                  {item.image ? (
                    <Image
                      className={styles.image}
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 744px) 62vw, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className={styles.imageFallback} aria-hidden="true" />
                  )}
                  <div className={styles.mediaOverlay} />
                </div>

                <div className={styles.content}>
                  <Text variant="p3" as="p" className={styles.date}>
                    {dayjs(item.date).format('MMM D, YYYY')}
                  </Text>
                  <Text variant="p1semi" as="h4" className={styles.title}>
                    {item.title}
                  </Text>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {scrollSnaps.length > 1 && (
        <div className={styles.controls}>
          <Button
            variant="unstyled"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className={clsx(styles.controlButton, !canScrollPrev && styles.controlButtonDisabled)}
            aria-label="Show previous news item"
          >
            <Icon
              iconName="chevron_left"
              variant="xs"
              color={
                canScrollPrev ? 'var(--color-text-primary)' : 'var(--color-text-primary-disabled)'
              }
            />
          </Button>

          <div className={styles.dots}>
            {scrollSnaps.map((_, index) => (
              <button
                key={`news-dot-${index}`}
                type="button"
                className={clsx(styles.dot, index === selectedIndex && styles.dotActive)}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to news slide ${index + 1}`}
                aria-pressed={index === selectedIndex}
              />
            ))}
          </div>

          <Button
            variant="unstyled"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className={clsx(styles.controlButton, !canScrollNext && styles.controlButtonDisabled)}
            aria-label="Show next news item"
          >
            <Icon
              iconName="chevron_right"
              variant="xs"
              color={
                canScrollNext ? 'var(--color-text-primary)' : 'var(--color-text-primary-disabled)'
              }
            />
          </Button>
        </div>
      )}
    </section>
  )
}
