import { Card, GradientBox, INTERNAL_LINKS, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import summerFiProBoxStyles from '@/components/layout/LandingPageContent/content/SummerFiProBox.module.css'

export const SummerFiProBox = () => {
  return (
    <GradientBox selected className={summerFiProBoxStyles.summerProInfoBox}>
      <Card variant="cardGradientLight" className={summerFiProBoxStyles.summerProInfoBoxCard}>
        <div>
          <Text variant="p2semi" as="span">
            <Text variant="p2semiColorful" as="span">
              Looking to borrow or multiply?&nbsp;
            </Text>
            Summer.fi Pro, advanced DeFi features all in one app.
          </Text>
        </div>
        <Text variant="p3semi" className={summerFiProBoxStyles.summerProInfoBoxLinks}>
          <Link href={`${INTERNAL_LINKS.summerPro}/multiply`} target="_blank" prefetch={false}>
            Multiply
          </Link>
          &nbsp;・&nbsp;
          <Link href={`${INTERNAL_LINKS.summerPro}/borrow`} target="_blank" prefetch={false}>
            Borrow
          </Link>
          &nbsp;・&nbsp;
          <Link href={`${INTERNAL_LINKS.summerPro}/earn`} target="_blank" prefetch={false}>
            Yield Loops
          </Link>
        </Text>
      </Card>
    </GradientBox>
  )
}
