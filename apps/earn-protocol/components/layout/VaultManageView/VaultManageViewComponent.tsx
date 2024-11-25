import { useMemo } from 'react'
import { useUser } from '@account-kit/react'
import {
  Expander,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  type SidebarProps,
  Text,
  useMobileCheck,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKUsersActivityType,
  type SDKVaultsListType,
  type SDKVaultType,
  type TokenSymbolsList,
  type UsersActivity,
} from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'
import BigNumber from 'bignumber.js'

import {
  ControlsApproval,
  ControlsDepositWithdraw,
  OrderInfoDeposit,
  OrderInfoWithdraw,
} from '@/components/molecules/SidebarElements'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { HistoricalYieldChart } from '@/components/organisms/Charts/HistoricalYieldChart'
import { TransactionAction } from '@/constants/transaction-actions'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { useAmount } from '@/hooks/use-amount'
import { useClient } from '@/hooks/use-client'
import { useTransaction } from '@/hooks/use-transaction'

import vaultManageViewStyles from './VaultManageView.module.scss'

export const VaultManageViewComponent = ({
  vault,
  vaults,
  position,
  userActivity,
  topDepositors,
  viewWalletAddress,
}: {
  vault: SDKVaultType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  viewWalletAddress: string
}) => {
  const user = useUser()
  const { tokenBalance, tokenBalanceLoading, publicClient } = useClient({
    vault,
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
    sidebar,
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    transactionType,
    setTransactionType,
    nextTransaction,
    approvalType,
    setApprovalType,
    setApprovalCustomValue,
    approvalCustomValue,
    backToInit,
  } = useTransaction({
    vault,
    amount: amountParsed,
    manualSetAmount,
    publicClient,
    tokenBalance,
    tokenBalanceLoading,
  })
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const ownerView = viewWalletAddress.toLowerCase() === user?.address.toLowerCase()

  const positionAmount = useMemo(() => {
    return new BigNumber(position.amount.amount)
  }, [position])

  const options: DropdownOption[] = [
    ...[...new Set(vaults.map(({ inputToken }) => inputToken.symbol))].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })),
  ]

  const dropdownValue =
    options.find((option) => option.value === vault.inputToken.symbol) ?? options[0]

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
      withdraw: (
        <OrderInfoWithdraw
          vault={vault}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSD}
        />
      ),
    }[nextTransaction.label]
  ) : (
    <ControlsDepositWithdraw
      amountDisplay={amountDisplay}
      amountDisplayUSD={amountDisplayUSD}
      handleAmountChange={handleAmountChange}
      options={options}
      dropdownValue={dropdownValue}
      onFocus={onFocus}
      onBlur={onBlur}
      tokenBalance={
        {
          [TransactionAction.DEPOSIT]: tokenBalance,
          [TransactionAction.WITHDRAW]: ownerView ? positionAmount : undefined,
        }[transactionType]
      }
      tokenBalanceLoading={tokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      vault={vault}
    />
  )

  const sidebarProps: SidebarProps = {
    title: !nextTransaction ? transactionType : sidebar.title,
    titleTabs: !nextTransaction
      ? [TransactionAction.DEPOSIT, TransactionAction.WITHDRAW]
      : undefined,
    onTitleTabChange: (action) => {
      setTransactionType(action as TransactionAction)
      if (amountParsed.gt(0)) {
        reset()
      }
    },
    content: sidebarContent,
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
  }

  // needed due to type duality
  const rebalancesList = `rebalances` in vault ? vault.rebalances : []

  return (
    <VaultManageGrid
      vault={vault}
      vaults={vaults}
      position={position}
      viewWalletAddress={viewWalletAddress}
      connectedWalletAddress={user?.address}
      detailsContent={
        <div className={vaultManageViewStyles.leftContentWrapper}>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Performance
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
                User activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity
              userActivity={userActivity}
              topDepositors={topDepositors}
              vaultId={vault.id}
              page="manage"
            />
          </Expander>
        </div>
      }
      sidebarContent={<Sidebar {...sidebarProps} />}
      isMobile={isMobile}
    />
  )
}
