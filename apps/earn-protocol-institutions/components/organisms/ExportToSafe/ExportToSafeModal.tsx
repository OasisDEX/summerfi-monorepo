'use client'

import { useMemo, useState } from 'react'
import { Button, Card, Modal, Text } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { formatAddress, sdkChainIdToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import {
  isExportable,
  safeBatchFilename,
  toSafeBatchJson,
} from '@/components/organisms/ExportToSafe/toSafeBatch'
import { type SDKTransactionItem } from '@/contexts/TransactionQueueContext/types'

const ChainBatchSection = ({
  chainId,
  items,
}: {
  chainId: SupportedNetworkIds
  items: SDKTransactionItem[]
}) => {
  const [copied, setCopied] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const json = useMemo(() => toSafeBatchJson(items, chainId), [items, chainId])
  const networkName = sdkChainIdToHumanNetwork(chainId) || `Chain ID ${chainId}`

  const handleCopy = () => {
    navigator.clipboard
      .writeText(json)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        // Clipboard can reject in non-secure contexts; nothing else to do.
      })
  }

  // Safe's Transaction Builder imports a .json file (not pasted text), so offer a download too.
  const handleDownload = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = safeBatchFilename(chainId, items.length)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Card variant="cardPrimary">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <Text as="p" variant="p3semi">
            {capitalize(networkName)}&nbsp;·&nbsp;{items.length} transaction
            {items.length > 1 ? 's' : ''}
          </Text>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primarySmall" onClick={handleDownload}>
              Download .json
            </Button>
            <Button variant="secondarySmall" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy JSON'}
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item) => (
            <Text key={item.id} as="p" variant="p3">
              {item.txLabel ? (
                <Text as="span" variant="p3semi">
                  {item.txLabel.label}&nbsp;
                </Text>
              ) : null}
              {item.txDescription}
              {item.vaultAddress ? (
                <Text as="span" variant="p4" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                  &nbsp;·&nbsp;{formatAddress(item.vaultAddress)}
                </Text>
              ) : null}
            </Text>
          ))}
        </div>

        <Button variant="textPrimarySmall" onClick={() => setShowJson((prev) => !prev)}>
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </Button>
        {showJson ? (
          <pre
            style={{
              margin: 0,
              maxHeight: '240px',
              overflow: 'auto',
              padding: '12px',
              borderRadius: 'var(--radius-roundish)',
              background: 'var(--earn-protocol-neutral-90)',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {json}
          </pre>
        ) : null}
      </div>
    </Card>
  )
}

export const ExportToSafeModal = ({
  transactions,
  isOpen,
  onClose,
}: {
  transactions: SDKTransactionItem[]
  isOpen: boolean
  onClose: () => void
}) => {
  const { groups, skippedCount } = useMemo(() => {
    const exportable = transactions.filter(isExportable)
    const byChain = new Map<SupportedNetworkIds, SDKTransactionItem[]>()

    for (const item of exportable) {
      byChain.set(item.chainId, [...(byChain.get(item.chainId) ?? []), item])
    }

    return {
      groups: [...byChain.entries()].map(([chainId, items]) => ({ chainId, items })),
      skippedCount: transactions.length - exportable.length,
    }
  }, [transactions])

  return (
    <Modal openModal={isOpen} closeModal={onClose} noScroll>
      <Card variant="cardSecondary">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '8px',
            maxWidth: '560px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Text as="h5" variant="h5" style={{ textAlign: 'center' }}>
            Export to Safe
          </Text>
          <Text as="p" variant="p3" style={{ textAlign: 'center' }}>
            Copy a Safe Transaction Builder batch (one per chain) and import it in the Safe
            Transaction Builder app.
          </Text>

          {groups.length === 0 ? (
            <Text as="p" variant="p2" style={{ textAlign: 'center' }}>
              Nothing to export.
            </Text>
          ) : (
            groups.map((group) => (
              <ChainBatchSection key={group.chainId} chainId={group.chainId} items={group.items} />
            ))
          )}

          {skippedCount > 0 ? (
            <Text as="p" variant="p4" style={{ textAlign: 'center' }}>
              {skippedCount} transaction{skippedCount > 1 ? 's' : ''} skipped (not yet prepared or
              errored).
            </Text>
          ) : null}
        </div>
      </Card>
    </Modal>
  )
}
