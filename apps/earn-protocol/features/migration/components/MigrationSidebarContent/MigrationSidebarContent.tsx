import { type FC } from 'react'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { type BigNumber } from 'bignumber.js'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { MigrationFormCompleteStep } from '@/features/migration/components/MigrationFormCompleteStep/MigrationFormCompleteStep'
import { MigrationFormMigrateStep } from '@/features/migration/components/MigrationFormMigrateStep/MigrationFormMigrateStep'
import { type MigrationState, MigrationSteps } from '@/features/migration/types'

interface MigrationSidebarContentProps {
  estimatedEarnings: string
  migratablePosition: MigratablePosition
  vault: SDKVaultType | SDKVaultishType
  amount?: BigNumber
  state: MigrationState
  transactionFeeLoading: boolean
  transactionFee?: string
  vaultApy?: number
  isLoadingForecast: boolean
}

export const MigrationSidebarContent: FC<MigrationSidebarContentProps> = ({
  estimatedEarnings,
  migratablePosition,
  vault,
  amount,
  state,
  transactionFeeLoading,
  transactionFee,
  vaultApy,
  isLoadingForecast,
}) => {
  return (
    <>
      {[MigrationSteps.INIT, MigrationSteps.APPROVE, MigrationSteps.MIGRATE].includes(
        state.step,
      ) && (
        <MigrationFormMigrateStep
          estimatedEarnings={estimatedEarnings}
          migratablePosition={migratablePosition}
          vault={vault}
          amount={amount}
          state={state}
          transactionFeeLoading={transactionFeeLoading}
          transactionFee={transactionFee}
          vaultApy={vaultApy}
          isLoadingForecast={isLoadingForecast}
        />
      )}
      {state.step === MigrationSteps.COMPLETED && (
        <MigrationFormCompleteStep
          vaultApy={vaultApy}
          vaultTokenSymbol={vault.inputToken.symbol}
          amount={amount?.toNumber()}
        />
      )}
    </>
  )
}
