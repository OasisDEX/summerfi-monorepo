'use client'

import { type FC, type ReactNode } from 'react'
import { getVaultRiskTooltipLabel } from '@summerfi/app-utils'

import { Box } from '@/components/atoms/Box/Box'
import { Icon } from '@/components/atoms/Icon/Icon'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { riskColors } from '@/helpers/risk-colors'

import vaultManageGridStyles from './VaultManageGrid.module.scss'

interface VaultManageLoadingGridProps {
  detailsContent: ReactNode
  sidebarContent: ReactNode
}

export const VaultManageLoadingGrid: FC<VaultManageLoadingGridProps> = ({
  detailsContent,
  sidebarContent,
}) => {
  const riskTooltipLabel = getVaultRiskTooltipLabel({
    risk: 'lower',
  })

  return (
    <>
      <div className={vaultManageGridStyles.vaultManageGridBreadcrumbsWrapper}>
        <div style={{ display: 'flex' }}>
          <Text as="div" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            Earn / &nbsp;
          </Text>
          <SkeletonLine height={17} width={300} style={{ marginTop: '2px' }} />
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            &nbsp;/&nbsp;
          </Text>
          <SkeletonLine height={17} width={300} style={{ marginTop: '2px' }} />
        </div>
      </div>
      <div className={vaultManageGridStyles.vaultManageGridPositionWrapper}>
        <div>
          <div className={vaultManageGridStyles.vaultManageGridTopLeftWrapper}>
            <Dropdown
              options={[]}
              dropdownValue={{
                content: null,
                value: '',
              }}
            >
              <VaultTitle
                symbol=""
                isLoading
                value={
                  <>
                    <SkeletonLine height={22} width={120} style={{ marginTop: '2px' }} />
                    <Tooltip
                      tooltip={riskTooltipLabel}
                      tooltipWrapperStyles={{ minWidth: '200px' }}
                    >
                      <Icon iconName="question_o" variant="s" color={riskColors.lower} />
                    </Tooltip>
                  </>
                }
              />
            </Dropdown>
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              <BonusLabel isLoading withTokenBonus />
            </Text>
          </div>
          <SimpleGrid
            columns={3}
            rows={1}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Market Value"
                value={
                  <SkeletonLine
                    radius="16px"
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    height={30}
                    width={100}
                  />
                }
                subValue={<SkeletonLine style={{ marginTop: '4px' }} height={24} width={70} />}
                subValueType="neutral"
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Net Contribution"
                value={
                  <SkeletonLine
                    radius="16px"
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    height={30}
                    width={100}
                  />
                }
                subValue={<SkeletonLine style={{ marginTop: '4px' }} height={24} width={70} />}
                subValueType="neutral"
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Current APY"
                value={
                  <SkeletonLine
                    radius="16px"
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    height={30}
                    width={100}
                  />
                }
                subValue={<SkeletonLine style={{ marginTop: '4px' }} height={24} width={70} />}
                subValueType="neutral"
                subValueSize="medium"
              />
            </Box>
          </SimpleGrid>
          <Box className={vaultManageGridStyles.leftBlock}>{detailsContent}</Box>
        </div>
        <div className={vaultManageGridStyles.rightBlockWrapper}>
          <div className={vaultManageGridStyles.rightBlock}>{sidebarContent}</div>
        </div>
      </div>
    </>
  )
}
