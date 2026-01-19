import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import dayjs from 'dayjs'

import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'
import { type ActivityLogData } from '@/features/panels/vaults/components/PanelActivity/types'

export const exportActivityAsCSV = ({
  activityLogBaseDataRaw,
  vault,
}: {
  activityLogBaseDataRaw: ActivityLogData
  vault: SDKVaultishType
}) => {
  const header = [
    'time_formatted',
    'timestamp',
    'tx_hash',
    'action_type',
    'action_caller',
    'action_target',
    'value_before',
    'value_after',
    'amount',
    'rebalance_from',
    'rebalance_to',
  ]
  const fileName = `vault-activity-${vault.id}-${subgraphNetworkToId(
    supportedSDKNetwork(vault.protocol.network),
  )}`

  const { curationEvents, roleEvents, vault: vaultEvents } = activityLogBaseDataRaw

  const csvContent = [header]

  curationEvents.forEach((curationEvent) => {
    const row = [
      dayjs.unix(curationEvent.timestamp).format(CHART_TIMESTAMP_FORMAT_DETAILED), // time_formatted
      String(curationEvent.timestamp), // timestamp
      curationEvent.hash, // tx_hash
      curationEvent.action, // action_type
      curationEvent.caller, // action_caller
      curationEvent.targetContract, // action_target
      String(curationEvent.valueBefore), // value_before
      String(curationEvent.valueAfter), // value_after
      '', // amount
    ]

    csvContent.push(row)
  })

  roleEvents.forEach((roleEvent) => {
    const row = [
      dayjs.unix(roleEvent.timestamp).format(CHART_TIMESTAMP_FORMAT_DETAILED), // time_formatted
      String(roleEvent.timestamp), // timestamp
      roleEvent.hash, // tx_hash
      roleEvent.action, // action_type
      roleEvent.caller, // action_caller
      roleEvent.role.owner, // action_target
      roleEvent.action !== 'REVOKE_ROLE' ? '' : roleEvent.role.name, // value_before
      roleEvent.action !== 'REVOKE_ROLE' ? roleEvent.role.name : '', // value_after
      '', // amount
    ]

    csvContent.push(row)
  })

  vaultEvents?.deposits.forEach((vaultDeposits) => {
    const row = [
      String(dayjs.unix(vaultDeposits.timestamp).format(CHART_TIMESTAMP_FORMAT_DETAILED)), // time_formatted
      String(vaultDeposits.timestamp), // timestamp
      vaultDeposits.hash, // tx_hash
      'DEPOSIT', // action_type
      vaultDeposits.from, // action_caller
      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`, // action_target
      '', // value_before
      '', // value_after
      String(vaultDeposits.amount), // amount
    ]

    csvContent.push(row)
  })

  vaultEvents?.withdraws.forEach((vaultWithdraws) => {
    const row = [
      String(dayjs.unix(vaultWithdraws.timestamp).format(CHART_TIMESTAMP_FORMAT_DETAILED)), // time_formatted
      String(vaultWithdraws.timestamp), // timestamp
      vaultWithdraws.hash, // tx_hash
      'WITHDRAW', // action_type
      vaultWithdraws.from, // action_caller
      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`, // action_target
      '', // value_before
      '', // value_after
      String(vaultWithdraws.amount), // amount
    ]

    csvContent.push(row)
  })

  vaultEvents?.rebalances.forEach((vaultRebalance) => {
    const row = [
      String(dayjs.unix(vaultRebalance.timestamp).format(CHART_TIMESTAMP_FORMAT_DETAILED)), // time_formatted
      String(vaultRebalance.timestamp), // timestamp
      vaultRebalance.hash, // tx_hash
      'REBALANCE', // action_type
      '', // action_caller
      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`, // action_target
      '', // value_before
      '', // value_after
      String(vaultRebalance.amount), // amount
      String(vaultRebalance.from.id), // rebalance_from
      String(vaultRebalance.to.id), // rebalance_to
    ]

    csvContent.push(row)
  })

  const csvContentString = csvContent
    .sort((a, b) => {
      // Sort by timestamp descending
      return Number(b[1]) - Number(a[1])
    })
    .map((e) =>
      e
        .map((cell) => {
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
            return `"${cell.replace(/"/gu, '""')}"`
          }

          return cell
        })
        .join(','),
    )
    .join('\n')

  const blob = new Blob([csvContentString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.setAttribute('download', `${fileName}.csv`)
  link.click()
  URL.revokeObjectURL(url)
}
