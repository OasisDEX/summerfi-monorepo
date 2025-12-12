import { type FC } from 'react'
import { type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
import { type TransactionMetadataMigration } from '@summerfi/sdk-common'
import { type BigNumber } from 'bignumber.js'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { MigrationFormCompleteStep } from '@/features/migration/components/MigrationFormCompleteStep/MigrationFormCompleteStep'
import { MigrationFormMigrateStep } from '@/features/migration/components/MigrationFormMigrateStep/MigrationFormMigrateStep'
import { type MigrationState, MigrationSteps } from '@/features/migration/types'

interface MigrationSidebarContentProps {
  estimatedEarnings: string
  migratablePosition: MigratablePosition
  vault: SDKVaultishType
  amount?: BigNumber
  state: MigrationState
  transactionFeeLoading: boolean
  transactionFee?: string
  vaultApyData: VaultApyData
  isLoadingForecast: boolean
  isQuoteLoading: boolean
  txMetadata?: TransactionMetadataMigration
}

export const MigrationSidebarContent: FC<MigrationSidebarContentProps> = ({
  estimatedEarnings,
  migratablePosition,
  vault,
  amount,
  state,
  transactionFeeLoading,
  transactionFee,
  vaultApyData,
  isLoadingForecast,
  isQuoteLoading,
  txMetadata,
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
          vaultApyData={vaultApyData}
          isLoadingForecast={isLoadingForecast}
          isQuoteLoading={isQuoteLoading}
          txMetadata={txMetadata}
        />
      )}
      {state.step === MigrationSteps.COMPLETED && (
        <MigrationFormCompleteStep
          vaultApyData={vaultApyData}
          vaultTokenSymbol={vault.inputToken.symbol}
          amount={amount?.toNumber()}
        />
      )}
    </>
  )
}
