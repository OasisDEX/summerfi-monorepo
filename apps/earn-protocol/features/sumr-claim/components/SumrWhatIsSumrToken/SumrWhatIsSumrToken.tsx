import { Button, Card, Emphasis, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import sumrTokenBubbles from '@/public/img/sumr/sumr_token_bubbles.svg'

import classNames from './SumrWhatIsSumrToken.module.scss'

export const SumrWhatIsSumrToken = () => {
  return (
    <Card variant="cardPrimary" className={classNames.sumrWhatIsSumrTokenWrapper}>
      <div className={classNames.content}>
        <div className={classNames.textual}>
          <Text variant="h2" as="h2" style={{ marginBottom: 'var(--general-space-24)' }}>
            What is <Emphasis variant="h2colorful">$SUMR</Emphasis>&nbsp;Token?
          </Text>
          <Text as="p" variant="p1" style={{ marginBottom: 'var(--general-space-40)' }}>
            $SUMR is the governance token for Lazy Summer Protocol. A DeFi yield curation protocol
            that optimizes DeFi’s highest quality yields, for everyone.
          </Text>
          <Link href="/" target="_blank">
            <Button variant="primaryLarge" className={classNames.actionable}>
              <span>&#9654;</span> Watch the video
            </Button>
          </Link>
        </div>
        <Image src={sumrTokenBubbles} alt="$SUMR Token Bubbles" />
      </div>
    </Card>
  )
}
