'use client'

import { type FC, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  Card,
  ERROR_TOAST_CONFIG,
  Table,
  TableCellNodes,
  TableCellText,
  Text,
  useEarnProtocolChain,
} from '@summerfi/app-earn-ui'
import type { NetworkNames } from '@summerfi/app-types'
import { chainIdToSDKNetwork, formatDecimalAsPercent } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { EditPercentageValueModal } from '@/components/molecules/EditValueModal/EditValueModal'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { feeRevenueColumns } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/tables/fee-revenue/columns'
import { thirdPartyCostsColumns } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/tables/third-party-costs/columns'
import { getRwaSetTipRateId } from '@/helpers/get-transaction-id'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import classNames from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin.module.css'

interface PanelRwaFeeRevenueAdminProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
  // Decimal fractions (0.01 = 1%), read on-chain. `null` = unavailable (n/a).
  managementFee: number | null
  performanceFee: number | null
}

// The FleetCommander reverts (`TipRateCannotExceedFivePercent`) above 5%; guard before queuing a tx.
const MAX_TIP_RATE_FRACTION = 0.05

export const PanelRwaFeeRevenueAdmin: FC<PanelRwaFeeRevenueAdminProps> = ({
  institutionName,
  clientId,
  vaultAddress,
  network,
  managementFee,
  performanceFee,
}) => {
  const chainId = urlNetworkToChainId(network)
  // Cache tags are keyed by the SDK network name (e.g. `arbitrum_one`), not the URL slug
  // (`arbitrum`), so derive it from the chain id to bust the right entry.
  const sdkNetworkName = chainIdToSDKNetwork(chainId)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  // RWA vaults are FleetCommander contracts, so the generic `setTipRate` admin setter applies.
  const { setTipRate, getTargetChainInfo } = useAdminAppRwaSDK(clientId)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain

  const onSetManagementFee = (next: BigNumber) => {
    // The modal value is a decimal fraction (0.01 = 1%); the contract caps the tip rate at 5%.
    if (next.isGreaterThan(MAX_TIP_RATE_FRACTION)) {
      toast.error('Management fee cannot exceed 5%', ERROR_TOAST_CONFIG)

      return
    }

    // `Percentage` expects percent units, so scale the fraction up by 100.
    const ratePercent = next.times(100)

    try {
      addTransaction(
        {
          id: getRwaSetTipRateId({
            address: fleetAddress,
            chainId,
            rate: ratePercent.toString(),
          }),
          txDescription: (
            <Text variant="p3">
              management&nbsp;fee&nbsp;from&nbsp;
              <Text as="span" variant="p4semi">
                {managementFee != null
                  ? formatDecimalAsPercent(managementFee, { precision: 2 })
                  : 'n/a'}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi">
                {formatDecimalAsPercent(next.toNumber(), { precision: 2 })}
              </Text>
            </Text>
          ),
          txLabel: { label: 'Set', charge: 'neutral' },
        },
        setTipRate({
          fleetAddress,
          chainInfo: getTargetChainInfo(chainId),
          rate: ratePercent.toNumber(),
        }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }

  const feeRevenueRows = [
    {
      content: {
        name: <TableCellText>Management Fee</TableCellText>,
        // The value itself is the edit affordance (gray, underlined-on-hover) — matching the Risk
        // Parameters tables — rather than a separate "Edit" button in the action column.
        'aum-fee': (
          <TableCellNodes>
            {managementFee != null ? (
              <EditPercentageValueModal
                buttonLabel={formatDecimalAsPercent(managementFee, { precision: 2 })}
                modalTitle="Edit Management Fee"
                modalDescription="Edit the vault management fee (tip rate). Capped at 5%."
                editValue={{ label: 'Management Fee', valueNormalized: managementFee }}
                onAddTransaction={onSetManagementFee}
                loading={controlsDisabled}
              />
            ) : (
              'n/a'
            )}
          </TableCellNodes>
        ),
        action: null,
      },
    },
    {
      content: {
        name: <TableCellText>Performance Fee</TableCellText>,
        'aum-fee': (
          <TableCellNodes>
            {performanceFee != null
              ? formatDecimalAsPercent(performanceFee, { precision: 2 })
              : 'n/a'}
          </TableCellNodes>
        ),
        // Performance fee has no on-chain setter exposed by the contracts/SDK — read-only for now.
        action: null,
      },
    },
  ]

  const onTxSuccess = () => {
    revalidateTags({
      tags: [
        `institution-vault-fleet-fees-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
      ],
    })
  }

  return (
    <Card variant="cardSecondary" className={classNames.panelFeeRevenueAdminWrapper}>
      <Text as="h5" variant="h5">
        Fee & revenue admin
      </Text>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          Fee Revenue
        </Text>
        <Table
          rows={feeRevenueRows}
          columns={feeRevenueColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
        />
      </Card>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          3rd Party Costs
        </Text>
        <Table
          rows={[]}
          columns={thirdPartyCostsColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
          noRowsContent={
            <Text as="p" variant="p2">
              No third party costs.
            </Text>
          }
        />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        transactionQueue={transactionQueue}
        chainId={chainId}
        removeTransaction={removeTransaction}
        onTxSuccess={onTxSuccess}
      />
    </Card>
  )
}
