import { type FC, type ReactNode } from 'react'
import { Icon, PillSelector, Text } from '@summerfi/app-earn-ui'
import { NetworkNames } from '@summerfi/app-types'

import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'

import classNames from '@/features/dca/components/dca.module.css'

const networkSelectorPillOptions: { value: NetworkNames; icon?: ReactNode; label?: ReactNode }[] = [
  {
    value: NetworkNames.ethereumMainnet,
    icon: <Icon iconName="earn_network_ethereum" variant="m" />,
    label: (
      <Text variant="p4semi" className={classNames.networkPillLabel}>
        Ethereum
      </Text>
    ),
  },
  {
    value: NetworkNames.baseMainnet,
    icon: <Icon iconName="earn_network_base" variant="m" />,
    label: (
      <Text variant="p4semi" className={classNames.networkPillLabel}>
        Base
      </Text>
    ),
  },
]

interface StepNetworkSelectorProps {
  selectedNetwork: NetworkNames
  onSelectNetwork: (network: NetworkNames) => void
}

export const StepNetworkSelector: FC<StepNetworkSelectorProps> = ({
  selectedNetwork,
  onSelectNetwork,
}) => {
  return (
    <DCAWizardStepCard title="Step 1 - Which Network would you like to execute your strategy on?">
      <PillSelector
        options={networkSelectorPillOptions}
        onSelect={(newNetwork) => onSelectNetwork(newNetwork as NetworkNames)}
        wrapperStyle={{ width: 'fit-content', margin: '0 auto' }}
        selectedPillStyle={{ background: 'rgba(255, 255, 255, 0.1)' }}
        defaultSelected={selectedNetwork}
      />
    </DCAWizardStepCard>
  )
}
