import {
  Button,
  Expander,
  InputWithDropdown,
  ProjectedEarnings,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SkeletonLine,
  Text,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKUsersActivityType,
  type SDKVaultsListType,
  type SDKVaultType,
  type TokenSymbolsList,
  type UsersActivity,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { detailsLinks } from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { HistoricalYieldChart } from '@/components/organisms/Charts/HistoricalYieldChart'
import { RebalancingActivity } from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/components/organisms/UserActivity/UserActivity'
import { VaultExposure } from '@/components/organisms/VaultExposure/VaultExposure'
import { TransactionAction } from '@/constants/transaction-actions'
import { useAmount } from '@/hooks/use-amount'
import { useClient } from '@/hooks/use-client'
import { usePosition } from '@/hooks/use-position'
import { useRedirectToPosition } from '@/hooks/use-redirect-to-position'
import { useTransaction } from '@/hooks/use-transaction'

import vaultOpenViewStyles from './VaultOpenView.module.scss'

export const VaultOpenViewComponent = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
}: {
  vault: SDKVaultType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
}) => {
  const { publicClient, transactionClient, tokenBalance, tokenBalanceLoading } = useClient({
    vault,
  })
  const { amountParsed, manualSetAmount, amountDisplay, handleAmountChange, onBlur, onFocus } =
    useAmount({ vault })
  const { sidebar, txHashes, removeTxHash, vaultChainId, reset } = useTransaction({
    vault,
    publicClient,
    transactionClient,
    amountParsed,
    manualSetAmount,
  })

  const position = usePosition({
    chainId: vaultChainId,
    vaultId: vault.id,
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

  const sidebarProps = {
    title: capitalize(TransactionAction.DEPOSIT),
    content: (
      <>
        <InputWithDropdown
          value={amountDisplay}
          secondaryValue={amountDisplay ? `$${amountDisplay}` : undefined}
          handleChange={handleAmountChange}
          options={options}
          dropdownValue={dropdownValue}
          onFocus={onFocus}
          onBlur={onBlur}
          heading={{
            label: 'Balance',
            value: tokenBalanceLoading ? (
              <SkeletonLine />
            ) : tokenBalance ? (
              `${formatCryptoBalance(tokenBalance)} ${vault.inputToken.symbol}`
            ) : (
              '-'
            ),
            action: () => {
              manualSetAmount(tokenBalance?.toString())
            },
          }}
        />
        <ProjectedEarnings earnings="1353" symbol={vault.inputToken.symbol as TokenSymbolsList} />
      </>
    ),

    primaryButton: sidebar.primaryButton,
    footnote: (
      <>
        {sidebar.error ?? amountParsed.gt(0) ? (
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
    <VaultOpenGrid
      vault={vault}
      vaults={vaults}
      displayGraph={displayGraph}
      simulationGraph={<VaultSimulationGraph vault={vault} amount={amountParsed} />}
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
