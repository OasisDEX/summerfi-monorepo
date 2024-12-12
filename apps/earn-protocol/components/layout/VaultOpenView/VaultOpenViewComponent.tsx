import { useEffect, useMemo, useState } from 'react'
import {
  Expander,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  Text,
  useForecast,
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import {
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
} from '@summerfi/app-types'

import { detailsLinks } from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import {
  ControlsApproval,
  ControlsDepositWithdraw,
  OrderInfoDeposit,
} from '@/components/molecules/SidebarElements'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { HistoricalYieldChart } from '@/components/organisms/Charts/HistoricalYieldChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { TransakWidget } from '@/features/transak/components/TransakWidget/TransakWidget'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { useAmount } from '@/hooks/use-amount'
import { useClient } from '@/hooks/use-client'
import { usePosition } from '@/hooks/use-position'
import { useRedirectToPosition } from '@/hooks/use-redirect-to-position'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transaction'

import vaultOpenViewStyles from './VaultOpenView.module.scss'

type VaultOpenViewComponentProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
}

export const VaultOpenViewComponent = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
}: VaultOpenViewComponentProps) => {
  const { getStorageOnce } = useLocalStorageOnce<string>({
    key: `${vault.id}-amount`,
  })
  const { publicClient } = useClient()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault,
  })

  const { token, tokenBalance, tokenBalanceLoading } = useTokenBalance({
    publicClient,
    tokenSymbol: selectedTokenOption.value,
  })

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({ vault })
  const {
    approvalType,
    setApprovalType,
    setApprovalCustomValue,
    approvalCustomValue,
    sidebar,
    txHashes,
    removeTxHash,
    vaultChainId,
    nextTransaction,
    backToInit,
    user,
    isTransakOpen,
    setIsTransakOpen,
  } = useTransaction({
    vault,
    amount: amountParsed,
    manualSetAmount,
    publicClient,
    token,
    tokenBalance,
    tokenBalanceLoading,
    flow: 'open',
  })

  const position = usePosition({
    chainId: vaultChainId,
    vaultId: vault.id,
  })

  const { forecast, isLoadingForecast, oneYearEarningsForecast } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: amountParsed.toString(),
  })

  useEffect(() => {
    const savedAmount = getStorageOnce()

    if (savedAmount) {
      manualSetAmount(savedAmount)
    }
  })
  useRedirectToPosition({ vault, position })

  const displayGraph = amountParsed.gt(0)

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const sidebarContent = nextTransaction?.label ? (
    {
      approve: (
        <ControlsApproval
          vault={vault}
          approvalType={approvalType}
          setApprovalType={setApprovalType}
          setApprovalCustomValue={setApprovalCustomValue}
          approvalCustomValue={approvalCustomValue}
          tokenBalance={tokenBalance}
        />
      ),
      deposit: (
        <OrderInfoDeposit
          vault={vault}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSD}
        />
      ),
      withdraw: null, // just for types, withdraw doesn't happen on open view
    }[nextTransaction.label]
  ) : (
    <ControlsDepositWithdraw
      amountDisplay={amountDisplay}
      amountDisplayUSD={amountDisplayUSD}
      handleAmountChange={handleAmountChange}
      handleDropdownChange={handleTokenSelectionChange}
      options={tokenOptions}
      dropdownValue={selectedTokenOption}
      onFocus={onFocus}
      onBlur={onBlur}
      tokenBalance={tokenBalance}
      tokenBalanceLoading={tokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      vault={vault}
      estimatedEarnings={estimatedEarnings}
      isLoadingForecast={isLoadingForecast}
    />
  )

  const sidebarProps = {
    title: sidebar.title,
    content: sidebarContent,
    customHeader:
      !isDrawerOpen && isMobile ? (
        <SidebarMobileHeader
          type="open"
          amount={estimatedEarnings}
          token={vault.inputToken.symbol}
          isLoadingForecast={isLoadingForecast}
        />
      ) : undefined,
    customHeaderStyles:
      !isDrawerOpen && isMobile ? { padding: 'var(--general-space-12) 0' } : undefined,
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
    goBackAction: nextTransaction?.label ? backToInit : undefined,
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
    isMobile,
  }

  // needed due to type duality
  const rebalancesList = `rebalances` in vault ? vault.rebalances : []

  return (
    <VaultOpenGrid
      isMobile={isMobile}
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
            <HistoricalYieldChart
              chartData={vault.customFields?.chartsData}
              summerVaultName={vault.customFields?.name ?? 'Summer Vault'}
            />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure vault={vault as SDKVaultType} />
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
      sidebarContent={
        <>
          <Sidebar {...sidebarProps} />
          {user?.address && (
            <TransakWidget
              cryptoCurrency={vault.inputToken.symbol}
              walletAddress={user.address}
              email={user.email}
              isOpen={isTransakOpen}
              onClose={() => setIsTransakOpen(false)}
            />
          )}
        </>
      }
    />
  )
}
