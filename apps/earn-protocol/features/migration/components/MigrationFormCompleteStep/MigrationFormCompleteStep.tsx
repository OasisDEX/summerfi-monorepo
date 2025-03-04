import { type FC } from 'react'
import { IllustrationCircle, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'

import classNames from './MigrationFormCompleteStep.module.scss'

interface MigrationFormCompleteStepProps {
  vaultTokenSymbol: string
  vaultApy?: number
  amount?: number
}

export const MigrationFormCompleteStep: FC<MigrationFormCompleteStepProps> = ({
  vaultTokenSymbol,
  vaultApy = 0,
  amount = 0,
}) => {
  return (
    <div className={classNames.migrationFormCompleteStepWrapper}>
      <IllustrationCircle icon="checkmark_colorful" size="extraLarge" iconSize={24} />
      <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        Congratulations, you are now earning {formatDecimalAsPercent(vaultApy)} on{' '}
        {formatCryptoBalance(amount)} {vaultTokenSymbol}
      </Text>
    </div>
  )
}
