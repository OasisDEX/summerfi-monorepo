import { Card, DataBlock, Text } from '@summerfi/app-earn-ui'

import classNames from './VaultDetailsSecurity.module.scss'

const dataBlocks = [
  {
    title: 'Total Assets Managed',
    value: '4.2b',
  },
  {
    title: '30d Volume',
    value: '11.2b',
  },
  {
    title: 'Vault Automated',
    value: '249.6m',
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
        <Card variant="cardSecondary">
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
