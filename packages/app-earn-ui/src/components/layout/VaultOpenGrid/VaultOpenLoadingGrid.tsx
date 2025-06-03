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

import vaultOpenGridStyles from './VaultOpenGrid.module.css'

interface VaultOpenLoadingGridProps {
  detailsContent: ReactNode
  sidebarContent: ReactNode
  isMobile?: boolean
}

export const VaultOpenLoadingGrid: FC<VaultOpenLoadingGridProps> = ({
  detailsContent,
  sidebarContent,
  isMobile,
}) => {
  const riskTooltipLabel = getVaultRiskTooltipLabel({
    risk: 'lower',
  })

  return (
    <>
      <div className={vaultOpenGridStyles.vaultOpenGridBreadcrumbsWrapper}>
        <div style={{ display: 'flex' }}>
          <Text as="div" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            Earn / &nbsp;
          </Text>
          <SkeletonLine height={17} width={300} style={{ marginTop: '2px' }} />
        </div>
      </div>
      <div className={vaultOpenGridStyles.vaultOpenGridPositionWrapper}>
        <div>
          <div className={vaultOpenGridStyles.vaultOpenGridTopLeftWrapper}>
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
            <Text
              style={{
                color: 'var(--earn-protocol-secondary-100)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <BonusLabel isLoading withTokenBonus />
            </Text>
          </div>
          <SimpleGrid
            columns={isMobile ? 1 : 2}
            rows={isMobile ? 4 : 2}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="30d APY"
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
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Assets in vault"
                value={
                  <SkeletonLine
                    radius="16px"
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    height={30}
                    width={100}
                  />
                }
                subValue={<SkeletonLine style={{ marginTop: '4px' }} height={24} width={70} />}
                subValueSize="medium"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Deposit cap"
                value={
                  <SkeletonLine
                    radius="16px"
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    height={30}
                    width={100}
                  />
                }
                subValue={<SkeletonLine style={{ marginTop: '4px' }} height={24} width={70} />}
                subValueSize="medium"
              />
            </Box>
          </SimpleGrid>
          <Box className={vaultOpenGridStyles.leftBlock}>{detailsContent}</Box>
        </div>
        <div className={vaultOpenGridStyles.rightBlockWrapper}>
          <div className={vaultOpenGridStyles.rightBlock}>{sidebarContent}</div>
        </div>
      </div>
    </>
  )
}
