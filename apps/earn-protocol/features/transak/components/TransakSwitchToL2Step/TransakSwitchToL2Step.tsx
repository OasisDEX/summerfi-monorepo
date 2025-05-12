import { type Dispatch, type FC, Fragment } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'
import { useRouter } from 'next/navigation'

import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'
import { type TransakReducerAction, TransakSteps } from '@/features/transak/types'

import classNames from './TransakSwitchToL2Step.module.css'

const switchToL2Copies = [
  {
    description:
      'You are now on Ethereum network. You can switch to Layer 2 networks such as Arbitrum or Base to save transaction cost. Summer.fi will cover you the first 10 transaction fees.',
  },
]

interface TransakSwitchToL2StepProps {
  dispatch: Dispatch<TransakReducerAction>
}

export const TransakSwitchToL2Step: FC<TransakSwitchToL2StepProps> = ({ dispatch }) => {
  const { push } = useRouter()

  return (
    <div className={classNames.switchToL2Wrapper}>
      <TransakIconWrapper icon="dot_arrow_right_colorful" size={50} />
      {switchToL2Copies.map((item) => (
        <Fragment key={item.description.slice(0, 10)}>
          <Text
            as="p"
            variant="p2"
            style={{
              color: 'var(--earn-protocol-secondary-60)',
              marginBottom: 'var(--general-space-16)',
              textAlign: 'center',
            }}
          >
            {item.description}
          </Text>
        </Fragment>
      ))}
      <div className={classNames.buttonsWrapper}>
        <Button variant="primaryLarge" onClick={() => push('/earn/base')}>
          Switch network
        </Button>
        <Button
          variant="secondaryLarge"
          onClick={() => dispatch({ type: 'update-step', payload: TransakSteps.BUY_ETH })}
        >
          I want to stay on Ethereum
        </Button>
      </div>
    </div>
  )
}
