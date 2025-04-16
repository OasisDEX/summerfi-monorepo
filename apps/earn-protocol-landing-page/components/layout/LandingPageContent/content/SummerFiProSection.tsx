import { Card, Icon, INTERNAL_LINKS, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { Emphasis } from '@/components/layout/LandingPageContent/components/Emphasis'

import summerFiProSectionStyles from '@/components/layout/LandingPageContent/content/SummerFiProSection.module.scss'

const SummerFiProSectionBlock = ({
  tag,
  title,
  pointsList,
  ctaLabel,
  ctaUrl,
}: {
  tag: string
  title: string
  pointsList: string[]
  ctaLabel: string
  ctaUrl: string
}) => {
  return (
    <Card className={summerFiProSectionStyles.summerFiProSectionCard}>
      <div className={summerFiProSectionStyles.summerFiProSectionCardDetails}>
        <Text variant="p3semiColorful">{tag}</Text>
        <Text variant="h5" as="h5">
          {title}
        </Text>
        <div className={summerFiProSectionStyles.summerFiProSectionCardDetailsList}>
          {pointsList.map((point) => (
            <Text variant="p2" key={`SummerFiProSectionBlockList_${title}${point}`}>
              <Icon iconName="checkmark_colorful_slim" size={20} />
              {point}
            </Text>
          ))}
        </div>
      </div>
      <div className={summerFiProSectionStyles.summerFiProSectionCardCta}>
        <Link href={ctaUrl} target="_blank">
          <WithArrow>
            <Text variant="p3semi">{ctaLabel}</Text>
          </WithArrow>
        </Link>
      </div>
    </Card>
  )
}

export const SummerFiProSection = () => {
  return (
    <div>
      <div className={summerFiProSectionStyles.summerFiProSectionHeaderWrapper}>
        <Text variant="h2" className={summerFiProSectionStyles.summerFiProSectionHeader}>
          <Emphasis variant="h2colorful">Summer.fi Pro</Emphasis>, advanced DeFi features all in one
          app, just a click away.
        </Text>
      </div>
      <div className={summerFiProSectionStyles.summerFiProSectionBlockWrapper}>
        <SummerFiProSectionBlock
          tag="Multiply"
          title="The easiest way to Amplify Exposure (and your profits)"
          pointsList={['Automation', 'Position swap', '$RAYS']}
          ctaLabel="Multiply"
          ctaUrl={`${INTERNAL_LINKS.summerPro}/multiply`}
        />
        <SummerFiProSectionBlock
          tag="Borrow"
          title="Unlock liquidity from your favorite crypto assets with best protocols."
          pointsList={['Automation', 'Position swap', '$RAYS']}
          ctaLabel="Borrow"
          ctaUrl={`${INTERNAL_LINKS.summerPro}/borrow`}
        />
        <SummerFiProSectionBlock
          tag="Yield Loops"
          title="Unlock liquidity from your favorite crypto assets with best protocols."
          pointsList={['$RAYS']}
          ctaLabel="Yield Loops"
          ctaUrl={`${INTERNAL_LINKS.summerPro}/earn`}
        />
      </div>
      <div className={summerFiProSectionStyles.summerFiProSectionBottomLink}>
        <Link href={INTERNAL_LINKS.summerPro} target="_blank">
          <WithArrow>
            <Text variant="p2semi">Go to Summer.fi Pro</Text>
          </WithArrow>
        </Link>
      </div>
    </div>
  )
}
