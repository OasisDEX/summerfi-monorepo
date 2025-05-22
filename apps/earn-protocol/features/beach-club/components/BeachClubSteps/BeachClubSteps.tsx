import { Card, Text } from '@summerfi/app-earn-ui'

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

export const BeachClubSteps = () => {
  return (
    <div className={classNames.beachClubStepsWrapper}>
      {steps.map((step, idx) => (
        <Card className={classNames.card} key={step.label}>
          <div className={classNames.stepNumber}>{idx + 1}</div>
          <Text as="p" variant="p1semi" style={{ maxWidth: '200px' }}>
            {step.label}
          </Text>
        </Card>
      ))}
    </div>
  )
}
