import {
  Button,
  Expander,
  InputWithDropdown,
  ProjectedEarnings,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  type SidebarProps,
  Text,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
  type UsersActivity,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'

import { vaultExposureRawData } from '@/components/layout/VaultOpenView/mocks'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import { RebalancingActivity } from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/components/organisms/UserActivity/UserActivity'
import { VaultExposure } from '@/components/organisms/VaultExposure/VaultExposure'
import { TransactionAction } from '@/constants/transaction-actions'
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
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  viewWalletAddress: string
}) => {
  const {
    amountDisplayValue,
    handleAmountChange,
    sidebar,
    amount,
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    user,
    setTransactionType,
    transactionType,
  } = useTransaction({ vault })

  const options: DropdownOption[] = [
    ...[...new Set(vaults.map(({ inputToken }) => inputToken.symbol))].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })),
  ]

  const dropdownValue =
    options.find((option) => option.value === vault.inputToken.symbol) ?? options[0]

  const balance = new BigNumber(123123)

  const sidebarProps: SidebarProps = {
    title: capitalize(transactionType),
    titleTabs: [TransactionAction.DEPOSIT, TransactionAction.WITHDRAW],
    onTitleTabChange: (action) => {
      setTransactionType(action as TransactionAction)
    },
    content: (
      <>
        <InputWithDropdown
          value={amountDisplayValue}
          secondaryValue={amountDisplayValue ? `$${amountDisplayValue}` : undefined}
          handleChange={handleAmountChange}
          options={options}
          dropdownValue={dropdownValue}
          heading={{
            label: 'Balance',
            value: `${formatCryptoBalance(balance)} ${vault.inputToken.symbol}`,
            // eslint-disable-next-line no-console
            action: () => console.log('clicked'),
          }}
        />
        <ProjectedEarnings earnings="1353" symbol={vault.inputToken.symbol as TokenSymbolsList} />
      </>
    ),

    primaryButton: sidebar.primaryButton,
    footnote: (
      <>
        {sidebar.error ?? amount?.gt(0) ? (
          <Button
            variant="secondarySmall"
            style={{ width: '100%', marginBottom: 'var(--general-space-12)' }}
            onClick={reset}
          >
            reset
          </Button>
        ) : null}
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
            <MockedLineChart />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure rawData={vaultExposureRawData} />
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
    />
  )
}
