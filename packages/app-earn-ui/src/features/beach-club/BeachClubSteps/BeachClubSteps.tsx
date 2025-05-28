import { type JSX } from 'react'

import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'

import classNames from './BeachClubSteps.module.css'

const steps = [
  {
    label: 'Share your unique referal code',
  },
  {
    label: 'New users deposit and you earn rewards',
  },
  {
    label: 'Claim your earned $SUMR and Fee’s',
  },
]

export const BeachClubSteps = (): JSX.Element => {
  return (
    <div className={classNames.beachClubStepsWrapper}>
      {steps.map((step, idx) => (
        <Card className={classNames.card} key={step.label}>
          <div className={classNames.stepNumber}>
            <Text as="h5" variant="h5colorfulBeachClub">
              {idx + 1}
            </Text>
          </div>
          <Text as="p" variant="p1semi" style={{ maxWidth: '200px' }}>
            {step.label}
          </Text>
        </Card>
      ))}
    </div>
  )
}
