'use client'

import {
  DataBlock,
  Sidebar,
  SimpleGrid,
  SkeletonLine,
  useMobileCheck,
  VaultGrid,
} from '@summerfi/app-earn-ui'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

export const VaultsListLeftContentLoading = () => (
  <>
    <div
      style={{
        display: 'flex',
        gap: '12px',
      }}
    >
      <SkeletonLine width="20%" height={38} radius="var(--radius-roundish)" />
      <SkeletonLine width="20%" height={38} radius="var(--radius-roundish)" />
      <SkeletonLine width="20%" height={38} radius="var(--radius-roundish)" />
      <SkeletonLine width="20%" height={38} radius="var(--radius-roundish)" />
    </div>
    <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
    <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
    <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
    <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
  </>
)

export const VaultsListViewLoading = () => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const isMobileOrTablet = isMobile || isTablet

  return (
    <VaultGrid
      isMobileOrTablet={isMobileOrTablet}
      topContent={
        <SimpleGrid
          columns={isMobile ? 1 : 3}
          rows={isMobile ? 3 : 1}
          style={{ justifyItems: 'stretch' }}
          gap={isMobile ? 16 : 170}
        >
          <DataBlock
            title="Protocol TVL"
            size="large"
            value={<SkeletonLine width={80} height={30} style={{ margin: '5px 0 5px' }} />}
          />

          <DataBlock
            title="Instant Liquidity"
            size="large"
            value={<SkeletonLine width={80} height={30} style={{ margin: '5px 0 5px' }} />}
          />
          <DataBlock
            title="Protocols Supported"
            size="large"
            value={<SkeletonLine width={40} height={30} style={{ margin: '5px 0 5px' }} />}
          />
        </SimpleGrid>
      }
      additionalFullWithTopContent={
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginLeft: '40px',
          }}
        >
          <SkeletonLine
            width="10%"
            height={28}
            style={{
              margin: '8px 0 18px',
            }}
            radius="var(--radius-roundish)"
          />
          <SkeletonLine
            width="10%"
            height={28}
            style={{
              margin: '8px 0 18px',
            }}
            radius="var(--radius-roundish)"
          />
        </div>
      }
      leftContent={<VaultsListLeftContentLoading />}
      rightContent={
        <div style={{ position: 'relative', width: '100%', padding: '2px' }}>
          <Sidebar
            title="Deposit"
            content={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  margin: '32px 0 32px',
                }}
              >
                <SkeletonLine width="100%" height={25} radius="var(--radius-roundish)" />
                <SkeletonLine width="100%" height={40} radius="var(--radius-roundish)" />
              </div>
            }
            primaryButton={{
              label: '',
              action: () => null,
              loading: true,
            }}
            footnote={<SkeletonLine width="30%" height={15} radius="var(--radius-roundish)" />}
          />
        </div>
      }
    />
  )
}
