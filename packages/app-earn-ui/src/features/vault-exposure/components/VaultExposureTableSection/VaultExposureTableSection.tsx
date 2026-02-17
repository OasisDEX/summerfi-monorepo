import { type Dispatch, type FC, type SetStateAction, useMemo } from 'react'
import {
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { VaultExposureTable } from '@/features/vault-exposure/components/VaultExposureTable/VaultExposureTable'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'
import { type VaultExposureFilterType } from '@/features/vault-exposure/types'

interface VaultExposureTableSectionProps {
  allocationType: VaultExposureFilterType
  filteredVault: SDKVaultishType
  vault: SDKVaultishType
  resolvedRowsToDisplay: number
  seeAll: boolean
  setSeeAll: Dispatch<SetStateAction<boolean>>
  arksInterestRates: InterestRates
  hiddenColumns?: string[]
  vaultApyData: VaultApyData
  tableId: string
  buttonClickEventHandler: (buttonName: string) => void
  isDaoManaged: boolean
}

export const VaultExposureTableSection: FC<VaultExposureTableSectionProps> = ({
  allocationType,
  filteredVault,
  vault,
  resolvedRowsToDisplay,
  seeAll,
  setSeeAll,
  arksInterestRates,
  hiddenColumns,
  vaultApyData,
  tableId,
  buttonClickEventHandler,
  isDaoManaged,
}) => {
  const vaultExposureFiltered = useMemo(
    () => vaultExposureFilter({ vault: vault as SDKVaultType, allocationType }),
    [allocationType, vault],
  )

  const handleButtonClick = (buttonName: string) => () => {
    setSeeAll((prev) => !prev)
    buttonClickEventHandler(buttonName)
  }

  return (
    <>
      <VaultExposureTable
        arksInterestRates={arksInterestRates}
        vault={vaultExposureFiltered}
        rowsToDisplay={resolvedRowsToDisplay}
        hiddenColumns={hiddenColumns ?? []}
        vaultApyData={vaultApyData}
        isDaoManaged={isDaoManaged}
      />
      {filteredVault.arks.length > 5 && (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Button
            variant="unstyled"
            onClick={handleButtonClick(
              `${tableId}-vault-exposure-tab--${allocationType.toLowerCase()}-${seeAll ? 'all' : 'less'}`,
            )}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--general-space-4)',
              marginTop: 'var(--general-space-16)',
            }}
          >
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              View {seeAll ? 'less' : 'more'}
            </Text>
            <Icon
              iconName={seeAll ? 'chevron_up' : 'chevron_down'}
              variant="xxs"
              color="var(--earn-protocol-primary-100)"
            />
          </Button>
        </div>
      )}
    </>
  )
}
