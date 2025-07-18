import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'

import institutionsPromoBlockStyles from './InstitutionsPromoBlock.module.css'

type InstitutionsPromoBlockProps = {
  title: string
  description: string
  bestFor: string
  coreFeatures: string[]
  ctaUrl: string
  ctaLabel?: string
  secondaryCtaUrl?: string
  secondaryCtaLabel?: string
}

export const InstitutionsPromoBlock = ({
  title,
  description,
  bestFor,
  coreFeatures,
  ctaUrl,
  ctaLabel = 'Learn more',
  secondaryCtaUrl,
  secondaryCtaLabel = 'Learn more',
}: InstitutionsPromoBlockProps) => {
  return (
    <div className={institutionsPromoBlockStyles.institutionsPromoBlockWrapper}>
      <div
        className={clsx(institutionsPromoBlockStyles.part, institutionsPromoBlockStyles.colorSide)}
      >
        <div>
          <Text variant="h4" as="h4">
            {title}
          </Text>
          <Text variant="p1" className={institutionsPromoBlockStyles.secondaryText}>
            {description}
          </Text>
        </div>
        <div>
          <Text variant="h5colorful" as="h5">
            <Icon iconName="stars_colorful" size={20} />
            Best For
          </Text>
          <Text variant="p1" className={institutionsPromoBlockStyles.secondaryText}>
            {bestFor}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={ctaUrl}>
            <Button variant="primaryMediumColorful">{ctaLabel}</Button>
          </Link>
          {secondaryCtaUrl && (
            <Link href={secondaryCtaUrl} target="_blank">
              <Button variant="secondaryMedium">{secondaryCtaLabel}</Button>
            </Link>
          )}
        </div>
      </div>
      <div
        className={clsx(institutionsPromoBlockStyles.part, institutionsPromoBlockStyles.darkSide)}
      >
        <div>
          <Text variant="h5" as="h5" className={institutionsPromoBlockStyles.colorful}>
            Core Features
          </Text>
          <ul>
            {coreFeatures.map((feature) => (
              <li key={feature}>
                <Icon iconName="checkmark" size={20} />
                <Text variant="p1" as="p">
                  {feature}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
