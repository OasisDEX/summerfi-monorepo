import { useEffect } from 'react'
import {
  Expander,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  Text,
  useLocalStorageOnce,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type ForecastData,
  type SDKUsersActivityType,
  type SDKVaultsListType,
  type SDKVaultType,
  type TokenSymbolsList,
  type UsersActivity,
} from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { detailsLinks } from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { Approval } from '@/components/molecules/SidebarElements/Approval'
import { InitialDeposit } from '@/components/molecules/SidebarElements/InitialDeposit'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { HistoricalYieldChart } from '@/components/organisms/Charts/HistoricalYieldChart'
import { TransactionAction } from '@/constants/transaction-actions'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { useAmount } from '@/hooks/use-amount'
import { useClient } from '@/hooks/use-client'
import { useForecast } from '@/hooks/use-forecast'
import { usePosition } from '@/hooks/use-position'
import { useRedirectToPosition } from '@/hooks/use-redirect-to-position'
import { useTransaction } from '@/hooks/use-transaction'

import vaultOpenViewStyles from './VaultOpenView.module.scss'

type VaultOpenViewComponentProps = {
  vault: SDKVaultType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  preloadedForecast?: ForecastData
}

export const VaultOpenViewComponent = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  preloadedForecast,
}: VaultOpenViewComponentProps) => {
  const { getStorageOnce } = useLocalStorageOnce<string>({
    key: `${vault.id}-amount`,
  })
  const { tokenBalance, tokenBalanceLoading } = useClient({
    vault,
  })
  const { amountParsed, manualSetAmount, amountDisplay, handleAmountChange, onBlur, onFocus } =
    useAmount({ vault })
  const { sidebar, txHashes, removeTxHash, vaultChainId, nextTransaction, reset } = useTransaction({
    vault,
    amountParsed,
    manualSetAmount,
  })

  const position = usePosition({
    chainId: vaultChainId,
    vaultId: vault.id,
  })

  const { forecast, isLoadingForecast } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: amountParsed.toString(),
    preloadedForecast,
  })

  useEffect(() => {
    const savedAmount = getStorageOnce()

    if (savedAmount) {
      manualSetAmount(savedAmount)
    }
  })
  useRedirectToPosition({ vault, position })

  const options: DropdownOption[] = [
    ...[...new Set(vaults.map(({ inputToken }) => inputToken.symbol))].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })),
  ]

  const dropdownValue =
    options.find((option) => option.value === vault.inputToken.symbol) ?? options[0]

  const displayGraph = amountParsed.gt(0)

  const sidebarContent = nextTransaction?.label ? (
    {
      approve: <Approval vault={vault} />,
      deposit: <div>deposit</div>,
    }[nextTransaction.label]
  ) : (
    <InitialDeposit
      amountDisplay={amountDisplay}
      handleAmountChange={handleAmountChange}
      options={options}
      dropdownValue={dropdownValue}
      onFocus={onFocus}
      onBlur={onBlur}
      tokenBalance={tokenBalance}
      tokenBalanceLoading={tokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      vault={vault}
    />
  )

  const sidebarProps = {
    title: nextTransaction?.label
      ? capitalize(nextTransaction.label)
      : capitalize(TransactionAction.DEPOSIT),
    content: sidebarContent,
    goBackAction: nextTransaction?.label ? reset : undefined,

    primaryButton: sidebar.primaryButton,
    footnote: (
      <>
        {txHashes.map((transactionData) => (
          <TransactionHashPill
            key={transactionData.hash}
            transactionData={transactionData}
            removeTxHash={removeTxHash}
            chainId={vaultChainId}
          />
        ))}
        <SidebarFootnote
          title={sidebarFootnote.title}
          list={sidebarFootnote.list}
          tooltip={sidebarFootnote.tooltip}
        />
      </>
    ),
    error: sidebar.error,
  }

  // needed due to type duality
  const rebalancesList = `rebalances` in vault ? vault.rebalances : []

  return (
    <VaultOpenGrid
      vault={vault}
      vaults={vaults}
      displayGraph={displayGraph}
      simulationGraph={
        <VaultSimulationGraph
          vault={vault}
          forecast={forecast}
          isLoadingForecast={isLoadingForecast}
          amount={amountParsed}
        />
      }
      detailsContent={
        <div className={vaultOpenViewStyles.leftContentWrapper}>
          <VaultOpenHeaderBlock detailsLinks={detailsLinks} vault={vault} />
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Historical yield
              </Text>
            }
            defaultExpanded
          >
            <HistoricalYieldChart aprHourlyList={vault.aprValues} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure vault={vault} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Rebalancing activity
              </Text>
            }
            defaultExpanded
          >
            <RebalancingActivity rebalancesList={rebalancesList} vaultId={vault.id} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Users activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity
              userActivity={userActivity}
              topDepositors={topDepositors}
              vaultId={vault.id}
              page="open"
            />
          </Expander>
        </div>
      }
      sidebarContent={<Sidebar {...sidebarProps} />}
    />
  )
}
