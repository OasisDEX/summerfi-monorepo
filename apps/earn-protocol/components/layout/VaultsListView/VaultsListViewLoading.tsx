'use client'

import {
  DataBlock,
  Sidebar,
  SimpleGrid,
  SkeletonLine,
  Text,
  useMobileCheck,
  VaultGrid,
} from '@summerfi/app-earn-ui'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

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
      leftContent={
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Choose a strategy
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              <SkeletonLine width={130} height={35} style={{ margin: '5px 0 5px' }} />
              <SkeletonLine width={130} height={35} style={{ margin: '5px 0 5px' }} />
            </div>
            <SkeletonLine width={160} height={35} style={{ margin: '5px 0 5px' }} />
          </div>
          <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
          <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
          <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
          <SkeletonLine width="100%" height={208} radius="var(--radius-roundish)" />
        </>
      }
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
