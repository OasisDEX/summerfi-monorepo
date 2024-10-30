import {
  Button,
  Expander,
  InputWithDropdown,
  ProjectedEarnings,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  Text,
  VaultGridPreview,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'

import {
  detailsLinks,
  userActivityRawData,
  vaultExposureRawData,
} from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import { RebalancingActivity } from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/components/organisms/UserActivity/UserActivity'
import { VaultExposure } from '@/components/organisms/VaultExposure/VaultExposure'
import { rebalancingActivityRawData } from '@/features/rebalance-activity/table/dummyData'
import { useTransaction } from '@/hooks/use-transaction'

import vaultOpenViewStyles from './VaultOpenView.module.scss'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export const VaultOpenViewComponent = ({
  vault,
  vaults,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
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
  const displayGraph = !!amount && amount.gt(0)

  const sidebarProps = {
    title: capitalize(Action.DEPOSIT),
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

  return (
    <VaultGridPreview
      vault={vault}
      vaults={vaults}
      displayGraph={displayGraph}
      simulationGraph={<VaultSimulationGraph vault={vault} amount={amount} />}
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
            <RebalancingActivity rawData={rebalancingActivityRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                User activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity rawData={userActivityRawData} />
          </Expander>
        </div>
      }
      sidebarContent={<Sidebar {...sidebarProps} />}
    />
  )
}
