import { Button, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import { Emphasis } from '@/components/layout/LandingPageContent/components/Emphasis'
import sumrTokenBubbles from '@/public/img/landing-page/sumr-token_bubbles.svg'

import sumrTokenStyles from '@/components/layout/LandingPageContent/content/SumrToken.module.scss'

export const SumrToken = () => {
  return (
    <div className={sumrTokenStyles.sumrTokenWrapper}>
      <div className={sumrTokenStyles.sumrTokenDescription}>
        <Text variant="h2" as="h2">
          The <Emphasis variant="h2colorful">$SUMR</Emphasis>&nbsp;Token
        </Text>
        <Text variant="h5" as="h5">
          How to earn $SUMR
        </Text>
        <Text variant="p2" as="p">
          Deposit, Stake, Delegate
        </Text>

        <Text variant="h5" as="h5">
          Governed by $SUMR, governed by you.
        </Text>
        <Text variant="p2" as="p">
          The Lazy Summer Protocol is governed by the $SUMR token. Holders of $SUMR are responsible
          for curating the best of DeFi, keeping contributors accountable, and allocating protocol
          capital.
        </Text>
        <Link href="#">
          <Button variant="secondarySmall">Get $SUMR</Button>
        </Link>
      </div>
      <div>
        <Image src={sumrTokenBubbles} alt="$SUMR Token Bubbles" />
      </div>
    </div>
  )
}
