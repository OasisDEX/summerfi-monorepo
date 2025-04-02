import { Card, DataBlock, Text } from '@summerfi/app-earn-ui'

import classNames from './VaultDetailsSecurity.module.scss'

const dataBlocks = [
  {
    title: 'Total Assets Managed',
    value: '2.71B',
  },
  {
    title: '30d Volume',
    value: '$994.78M',
  },
  {
    title: 'Vault Automated',
    value: '$191.60M',
  },
  {
    title: 'Time operating',
    value: '6 years',
  },
]

export const VaultDetailsSecurityStats = () => {
  return (
    <>
      <Text as="h5" variant="h5" style={{ marginBottom: 'var(--spacing-space-x-small)' }}>
        Security
      </Text>
      <Text
        as="p"
        variant="p2"
        style={{
          marginBottom: 'var(--spacing-space-large)',
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Card>
          <div className={classNames.dataBlockWrapper}>
            {dataBlocks.map((block) => (
              <DataBlock key={block.title} title={block.title} size="small" value={block.value} />
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
