'use client'
import { type FC, useCallback, useMemo, useState } from 'react'
import { AllocationBar, Badge, Card, Text, VaultExposure } from '@summerfi/app-earn-ui'
import {
  type GetInterestRatesQuery,
  type InterestRates,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, zero } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { calculateAverageApy } from '@/helpers/calculate-average-apy'
import { type ArksDeployedOnChain } from '@/types/arks'

import { getArksAllocation } from './get-arks-allocation'

import styles from './PanelVaultExposure.module.css'

const columnsToHide = ['yearlyLow', 'yearlyHigh', 'avgApy1y']

interface PanelVaultExposureProps {
  vault: SDKVaultType
  arkInterestRates: InterestRates
  vaultApyData: VaultApyData
  arksDeployedOnChain: ArksDeployedOnChain
}

const ArkDeployedOnChainCard: FC<{
  ark: ArksDeployedOnChain[number]
  active?: boolean
  arkInterestRate?: GetInterestRatesQuery
}> = ({ ark, active, arkInterestRate }) => {
  const avgApy30d = arkInterestRate
    ? calculateAverageApy(arkInterestRate.dailyInterestRates, 30)
    : null

  return (
    <Card variant="cardSecondary" style={{ flexDirection: 'column' }}>
      <Text as="p" variant={active ? 'p1semiColorful' : 'p1semi'}>
        {ark.name}
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        <Text as="div" variant="p4semi">
          APY:&nbsp;
          {avgApy30d
            ? formatDecimalAsPercent(avgApy30d, {
                precision: 2,
              })
            : 'N/A'}
        </Text>
        <Text as="div" variant="p4semi">
          Protocol&nbsp;TVL:&nbsp;
          {ark.protocolAllocation ? formatCryptoBalance(ark.protocolAllocation) : 'N/A'}
        </Text>
      </div>
      <Text
        as="p"
        variant="p4"
        style={{
          opacity: ark.description ? 1 : 0.6,
        }}
      >
        {ark.description ? <>{ark.description}</> : 'No description available'}
      </Text>
      {ark.link && (
        <Link href={ark.link} target="_blank" rel="noopener noreferrer">
          <Text
            as="p"
            variant="p4semi"
            style={{ marginTop: '8px', color: 'var(--earn-protocol-primary-100)' }}
          >
            Learn more
          </Text>
        </Link>
      )}
    </Card>
  )
}

export const PanelVaultExposure: FC<PanelVaultExposureProps> = ({
  vault,
  arkInterestRates,
  vaultApyData,
  arksDeployedOnChain,
}) => {
  const [sortingType, setSortingType] = useState<'protocolAllocation' | 'apy'>('apy')
  const [includeOtherToken, setIncludeOtherToken] = useState(false)
  const allocation = getArksAllocation(vault)

  const isArkInCurrentVault = useCallback(
    (arkProductId: string) => {
      return vault.arks.some((ark) => ark.productId === arkProductId)
    },
    [vault],
  )

  const sortedFilteredArksDeployedOnChain = useMemo(() => {
    return [...arksDeployedOnChain]
      .sort((a, b) => {
        switch (sortingType) {
          case 'apy': {
            const aApy = arkInterestRates[a.name]
            const bApy = arkInterestRates[b.name]

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const aAvgApy30d = aApy
              ? calculateAverageApy(aApy.dailyInterestRates, 30)
              : new BigNumber(-100)
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const bAvgApy30d = bApy
              ? calculateAverageApy(bApy.dailyInterestRates, 30)
              : new BigNumber(-100)

            return bAvgApy30d.minus(aAvgApy30d).toNumber()
          }
          case 'protocolAllocation': {
            const aAllocation = a.protocolAllocation ? new BigNumber(a.protocolAllocation) : zero
            const bAllocation = b.protocolAllocation ? new BigNumber(b.protocolAllocation) : zero

            return bAllocation.minus(aAllocation).toNumber()
          }
          default:
            return 0
        }
      })
      .filter((ark) => {
        if (includeOtherToken) {
          return true
        }

        return ark.symbol === vault.inputToken.symbol
      })
  }, [
    arksDeployedOnChain,
    arkInterestRates,
    sortingType,
    includeOtherToken,
    vault.inputToken.symbol,
  ])

  return (
    <Card variant="cardSecondary" className={styles.panelVaultExposureWrapper}>
      <Text as="h5" variant="h5">
        Vault exposure
      </Text>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          Asset allocation
        </Text>
        <AllocationBar items={allocation} variant="large" />
      </div>
      <Card className={styles.tableSection}>
        <VaultExposure
          vault={vault}
          arksInterestRates={arkInterestRates}
          vaultApyData={vaultApyData}
          columnsToHide={columnsToHide}
          tableId="vault-exposure"
          buttonClickEventHandler={() => {}}
          isDaoManaged={false}
        />
      </Card>
      <Text as="h5" variant="h5">
        Arks available on chain
      </Text>
      <Text as="p" variant="p2">
        List of arks that are currently deployed on-chain. Highlighted arks are the ones utilized by
        this vault.
      </Text>
      <Card className={styles.availableArksSection}>
        {arksDeployedOnChain.length ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className={styles.sortingButtons}>
              <Text as="p" variant="p4semi">
                Sort by:
              </Text>
              <Badge
                value="APY"
                onClick={() => {
                  setSortingType('apy')
                }}
                isActive={sortingType === 'apy'}
              />
              <Badge
                value={<>Protocol&nbsp;TVL</>}
                onClick={() => {
                  setSortingType('protocolAllocation')
                }}
                isActive={sortingType === 'protocolAllocation'}
              />
            </div>
            <div className={styles.sortingButtons}>
              <Text as="p" variant="p4semi">
                Filter tokens:
              </Text>
              <Badge
                value={vault.inputToken.symbol}
                onClick={() => {
                  setIncludeOtherToken(false)
                }}
                isActive={!includeOtherToken}
              />
              <Badge
                value="All"
                onClick={() => {
                  setIncludeOtherToken(true)
                }}
                isActive={includeOtherToken}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.availableArksSectionGrid}>
          {arksDeployedOnChain.length ? (
            sortedFilteredArksDeployedOnChain.map((ark) => (
              <ArkDeployedOnChainCard
                key={`${ark.productId}_${ark.name}`}
                ark={ark}
                arkInterestRate={arkInterestRates[ark.name]}
                active={isArkInCurrentVault(ark.productId)}
              />
            ))
          ) : (
            <Text as="p" variant="p4">
              No arks deployed on chain for this vault.
            </Text>
          )}
        </div>
      </Card>
    </Card>
  )
}
