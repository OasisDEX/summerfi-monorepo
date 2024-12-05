'use client'
import { useState } from 'react'
import { Button, Card, Emphasis, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import sumrTokenBubbles from '@/public/img/sumr/sumr_token_bubbles.svg'

import classNames from './SumrWhatIsSumrToken.module.scss'

export const SumrWhatIsSumrToken = () => {
  const [showVideo, setShowVideo] = useState(false)

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
          <Button
            variant="primaryLarge"
            className={classNames.actionable}
            onClick={() => setShowVideo((prev) => !prev)}
          >
            <span>&#9654;</span> {showVideo ? 'Hide' : 'Show'} the Video
          </Button>
        </div>
        <Image src={sumrTokenBubbles} alt="$SUMR Token Bubbles" />
      </div>
      {showVideo && (
        <div className={classNames.videoWrapper}>
          <iframe
            width="560px"
            height="315px"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ln0gmgcDkdEJqdjA"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ height: '100%', width: '100%' }}
          ></iframe>
        </div>
      )}
    </Card>
  )
}
