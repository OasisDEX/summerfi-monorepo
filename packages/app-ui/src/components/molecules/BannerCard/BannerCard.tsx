import { FC, ReactNode } from 'react'
import Image from 'next/image'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'

import classNames from '@/components/molecules/BannerCard/BannerCard.module.scss'

interface BannerCardProps {
  title: ReactNode
  description: ReactNode
  button: {
    action: () => void
    label: string
  }
  image: {
    src: string
    alt: string
  }
  footer?: ReactNode
}

export const BannerCard: FC<BannerCardProps> = ({ title, description, footer, button, image }) => {
  return (
    <Card className={classNames.shadow}>
      <Image src={image.src} alt={image.alt} width={60} height={60} />
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
        <Button onClick={button.action} variant="neutralSmall">
          {button.label}
        </Button>
      </div>
    </Card>
  )
}
