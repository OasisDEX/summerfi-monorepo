'use client'
import { FC, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { ProxyLinkComponent } from '@/components/atoms/ProxyLinkComponent/ProxyLinkComponent'
import { Text } from '@/components/atoms/Text/Text'

import classNames from '@/components/molecules/BannerCard/BannerCard.module.scss'

interface BannerCardProps {
  title: ReactNode
  description: ReactNode
  link: {
    href: string
    label: string
  }
  image: {
    src: string
    alt: string
  }
  footer?: ReactNode
}

export const BannerCard: FC<BannerCardProps> = ({ title, description, footer, link, image }) => {
  return (
    <Card className={classNames.shadow}>
      <Image src={image.src} alt={image.alt} height={60} style={{ width: 'auto' }} />
      <div className={classNames.content}>
        <div className={classNames.contentTextual}>
          {typeof title === 'string' ? (
            <Text as="p" variant="p2semi">
              {title}
            </Text>
          ) : (
            title
          )}
          {typeof description === 'string' ? (
            <Text as="p" variant="p3" className={classNames.contentDescription}>
              {description}
            </Text>
          ) : (
            description
          )}
          {typeof footer === 'string' ? (
            <Text as="p" variant="p4semi" className={classNames.contentDescription}>
              {footer}
            </Text>
          ) : (
            footer
          )}
        </div>
        <Link passHref legacyBehavior prefetch={false} href={link.href}>
          <ProxyLinkComponent style={{ color: 'var(--color-neutral-80)' }}>
            <Button variant="neutralSmall">{link.label}</Button>
          </ProxyLinkComponent>
        </Link>
      </div>
    </Card>
  )
}
