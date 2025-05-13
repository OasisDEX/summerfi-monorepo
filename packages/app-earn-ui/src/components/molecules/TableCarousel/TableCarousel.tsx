import { type FC } from 'react'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import {
  SlideCarousel,
  SlideCarouselButtonPosition,
} from '@/components/molecules/SlideCarousel/SlideCarousel'

import classNames from './TableCarousel.module.css'

interface TableCarouselProps {
  carouselData: {
    title: string
    description: string
    link: {
      label: string
      href: string
    }
  }[]
}

export const TableCarousel: FC<TableCarouselProps> = ({ carouselData }) => {
  return (
    <div className={classNames.wrapper}>
      <SlideCarousel
        slides={carouselData.map((item) => (
          <div
            key={item.title}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--general-space-8)',
            }}
          >
            <Text as="p" variant="p3semi">
              {item.title}
            </Text>
            <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {item.description}
            </Text>
            <Link href={item.link.href}>
              <WithArrow
                as="p"
                variant="p4semi"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                {item.link.label}
              </WithArrow>
            </Link>
          </div>
        ))}
        options={{ slidesToScroll: 'auto' }}
        buttonPosition={SlideCarouselButtonPosition.ON_SIDES}
        slidesPerPage={1}
        withDots
        withAutoPlay
      />
    </div>
  )
}
