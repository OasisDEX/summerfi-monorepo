'use client'

import { Card, getArkNiceName, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

import { marketRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/mapper'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'

import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { type MarketRiskParameters } from './market-risk-parameters-table/types'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'

import styles from './PanelRiskParameters.module.css'

const mapArksToRiskParameters = (
  vault: SDKVaultishType,
  arksImpliedCapsMap: {
    [x: string]: string | undefined
  },
): MarketRiskParameters[] => {
  return vault.arks
    .filter((ark) => {
      return getArkNiceName(ark) !== null
    })
    .map((ark) => ({
      id: ark.id,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      market: <span title={ark.name ?? ark.id}>{getArkNiceName(ark) || 'Unknown Market'}</span>,
      marketCap: new BigNumber(ark.depositCap).shiftedBy(-ark.inputToken.decimals).toNumber(),
      maxPercentage: new BigNumber(ark.maxDepositPercentageOfTVL.toString())
        .shiftedBy(
          -18 - 2, // -18 because its 'in wei' and then -2 because we want to use formatDecimalAsPercent
        )
        .toNumber(),
      impliedCap: arksImpliedCapsMap[ark.id] ?? 'n/a',
    }))
}

export const PanelRiskParameters = ({
  vault,
  arksImpliedCapsMap,
}: {
  vault: SDKVaultishType
  arksImpliedCapsMap: {
    [x: string]: string | undefined
  }
}) => {
  const marketRows = marketRiskParametersMapper({
    rawData: mapArksToRiskParameters(vault, arksImpliedCapsMap),
  })

  const vaultRows = vaultRiskParametersMapper({
    rawData: [
      {
        id: '1',
        parameter: 'Vault Cap',
        value: new BigNumber(vault.depositCap).shiftedBy(-vault.inputToken.decimals).toNumber(),
      },
      {
        id: '2',
        parameter: 'Buffer',
        value: new BigNumber(vault.minimumBufferBalance)
          .shiftedBy(-vault.inputToken.decimals)
          .toNumber(),
      },
    ],
  })

  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <Text as="h5" variant="h5">
        Vault Risk Parameters
      </Text>
      <Card>
        <Table
          rows={vaultRows}
          columns={vaultRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Market Risk Parameters
      </Text>
      <Card>
        <Table
          rows={marketRows}
          columns={marketRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
    </Card>
  )
}
