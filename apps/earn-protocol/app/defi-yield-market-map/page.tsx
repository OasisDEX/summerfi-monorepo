'use client'

import { useEffect, useState } from 'react'
import { Card, Emphasis, Modal, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import {
  DYM_CATEGORIES,
  DYM_CHAINS,
  DYM_ICONS,
  DYM_RISK_CURATORS,
  DYM_YIELD_ASSETS,
} from '@/app/defi-yield-market-map/constants'
import { type DYMCategory, type DYMProtocolItem } from '@/app/defi-yield-market-map/types'
import {
  dymFindProtocolItem,
  dymFormatTVL,
  dymGetInitials,
} from '@/app/defi-yield-market-map/utils'

import {
  type DefiLlamaPool,
  fetchProtocolModalData,
  type ProtocolModalData,
} from './defi-llama-api'

import defYieldMarketMapPageStyles from './DefYieldMarketMapPage.module.css'

function ProtocolIcon({ slug, label }: { slug: string; label: string }) {
  const icon = slug in DYM_ICONS ? DYM_ICONS[slug] : undefined

  return (
    <div className={defYieldMarketMapPageStyles.protocolIcon}>
      {icon !== undefined ? (
        <Image src={icon} alt={label} width={48} height={48} style={{ objectFit: 'cover' }} />
      ) : (
        <div className={defYieldMarketMapPageStyles.projectAvatarIcon}>{dymGetInitials(label)}</div>
      )}
    </div>
  )
}

function PoolRow({ pool }: { pool: DefiLlamaPool }) {
  const tvlStr =
    pool.tvlUsd >= 1e6
      ? `$${(pool.tvlUsd / 1e6).toFixed(1)}M`
      : `$${(pool.tvlUsd / 1e3).toFixed(0)}K`

  return (
    <div className={defYieldMarketMapPageStyles.modalPool}>
      <span className={defYieldMarketMapPageStyles.modalPoolName}>{pool.symbol}</span>
      <div className={defYieldMarketMapPageStyles.modalPoolDetails}>
        <span className={defYieldMarketMapPageStyles.modalPoolApy}>
          {(pool.apy || 0).toFixed(2)}%
        </span>
        <span>{tvlStr}</span>
        <span>{pool.chain}</span>
      </div>
    </div>
  )
}

function ModalContent({
  item,
}: {
  type: 'protocol' | 'chain' | 'asset' | 'curator' | null
  item: string | null
}) {
  const [data, setData] = useState<ProtocolModalData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!item) {
      return undefined
    }

    let cancelled = false

    setLoading(true)
    setData(null)
    fetchProtocolModalData(item).then((result) => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [item])

  if (item === null) return null

  const protocol = dymFindProtocolItem(item)
  const protocolName = protocol?.name ?? item
  const protocolUrl = protocol?.url
  const protocolDesc = protocol?.description

  return (
    <Card className={defYieldMarketMapPageStyles.modalContentWrapper}>
      <div className={defYieldMarketMapPageStyles.modalHeader}>
        <div className={defYieldMarketMapPageStyles.modalHeaderIcon}>
          <ProtocolIcon slug={item} label={protocolName} />
        </div>
        <div>
          <Text variant="h5">{protocolName}</Text>
          {protocolUrl && (
            <Text variant="p4" style={{ color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>
              {protocolUrl}
            </Text>
          )}
        </div>
      </div>

      {protocolDesc && (
        <Text
          variant="p3"
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          {protocolDesc}
        </Text>
      )}

      <div className={defYieldMarketMapPageStyles.modalStats}>
        <Card variant="cardSecondarySmallPaddings" style={{ flexDirection: 'column' }}>
          <Text
            variant="p4"
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}
          >
            Total Value Locked
          </Text>
          {loading ? (
            <SkeletonLine width={80} height={24} />
          ) : (
            <Text variant="h5">
              {data?.tvl !== null && data?.tvl !== undefined ? dymFormatTVL(data.tvl) : '--'}
            </Text>
          )}
        </Card>
        <Card variant="cardSecondarySmallPaddings" style={{ flexDirection: 'column' }}>
          <Text
            variant="p4"
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}
          >
            Avg APY (Top Pools)
          </Text>
          {loading ? (
            <SkeletonLine width={80} height={24} />
          ) : (
            <Text variant="h5" style={{ color: '#10b981' }}>
              {data?.avgApy !== null && data?.avgApy !== undefined
                ? `${data.avgApy.toFixed(2)}%`
                : '--'}
            </Text>
          )}
        </Card>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <SkeletonLine width={200} height={16} />
        </div>
      )}

      {!loading && data && data.pools.length > 0 && (
        <div className={defYieldMarketMapPageStyles.modalPools}>
          <Text
            variant="p4"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '12px',
            }}
          >
            Top Yield Pools
          </Text>
          {data.pools.map((pool) => (
            <PoolRow key={pool.pool} pool={pool} />
          ))}
        </div>
      )}

      <div className={defYieldMarketMapPageStyles.modalLinks}>
        {protocolUrl && (
          <a
            className={defYieldMarketMapPageStyles.modalLink}
            href={`https://${protocolUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit {protocolUrl} \u2192
          </a>
        )}
        <a
          className={defYieldMarketMapPageStyles.modalLink}
          href={`https://defillama.com/protocol/${item}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          DefiLlama \u2192
        </a>
      </div>
    </Card>
  )
}

function ProtocolItemCard({
  item,
  openModal,
}: {
  item: DYMProtocolItem
  openModal: (type: 'protocol' | 'chain' | 'asset' | 'curator', item: string) => void
}) {
  return (
    <div
      className={defYieldMarketMapPageStyles.protocolItem}
      onClick={() => openModal('protocol', item.slug)}
    >
      <ProtocolIcon slug={item.slug} label={item.name} />
      <span className={defYieldMarketMapPageStyles.protocolLabel}>{item.name}</span>
    </div>
  )
}

function CategoryCard({
  category,
  openModal,
}: {
  category: DYMCategory
  openModal: (type: 'protocol' | 'chain' | 'asset' | 'curator', item: string) => void
}) {
  return (
    <Card className={defYieldMarketMapPageStyles.masonryItem} variant="cardSecondarySmallPaddings">
      <div className={defYieldMarketMapPageStyles.categoryHeader}>
        <Text variant="p3semi" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {category.title}
        </Text>
      </div>
      {category.subcategories.map((sub, i) => (
        <div key={sub.label ?? i} className={defYieldMarketMapPageStyles.subcategoryDivider}>
          {sub.label && (
            <div className={defYieldMarketMapPageStyles.subcategoryTitle}>{sub.label}</div>
          )}
          <div className={defYieldMarketMapPageStyles.protocolGrid}>
            {sub.items.map((item) => (
              <ProtocolItemCard key={item.slug + item.name} item={item} openModal={openModal} />
            ))}
          </div>
        </div>
      ))}
    </Card>
  )
}

function ChainsCard() {
  return (
    <Card className={defYieldMarketMapPageStyles.masonryItem} variant="cardSecondarySmallPaddings">
      <div className={defYieldMarketMapPageStyles.categoryHeader}>
        <Text variant="p3semi" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Supported Chains
        </Text>
      </div>
      <div className={defYieldMarketMapPageStyles.subcategoryDivider}>
        <div className={defYieldMarketMapPageStyles.chainsGrid}>
          {DYM_CHAINS.map((chain) => (
            <div key={chain.slug} className={defYieldMarketMapPageStyles.protocolItem}>
              <ProtocolIcon slug={chain.slug} label={chain.name} />
              <span className={defYieldMarketMapPageStyles.protocolLabel}>{chain.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function AssetsCard() {
  const sections = Object.entries(DYM_YIELD_ASSETS)

  return (
    <Card className={defYieldMarketMapPageStyles.masonryItem} variant="cardSecondarySmallPaddings">
      <div className={defYieldMarketMapPageStyles.categoryHeader}>
        <Text variant="p3semi" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Yield-Bearing Assets
        </Text>
      </div>
      {sections.map(([key, section]) => (
        <div key={key} className={defYieldMarketMapPageStyles.subcategoryDivider}>
          <div className={defYieldMarketMapPageStyles.subcategoryTitle}>{section.label}</div>
          <div className={defYieldMarketMapPageStyles.protocolGrid}>
            {section.items.map((asset) => (
              <div key={asset.name} className={defYieldMarketMapPageStyles.protocolItem}>
                <div className={defYieldMarketMapPageStyles.protocolIcon}>
                  <div className={defYieldMarketMapPageStyles.projectAvatarIcon}>
                    {dymGetInitials(asset.name)}
                  </div>
                </div>
                <span className={defYieldMarketMapPageStyles.protocolLabel}>{asset.name}</span>
                <span className={defYieldMarketMapPageStyles.assetSub}>{asset.sub}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  )
}

function CuratorsCard() {
  return (
    <Card className={defYieldMarketMapPageStyles.masonryItem} variant="cardSecondarySmallPaddings">
      <div className={defYieldMarketMapPageStyles.categoryHeader}>
        <Text variant="p3semi" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Risk Curators
        </Text>
      </div>
      <div className={defYieldMarketMapPageStyles.subcategoryDivider}>
        <div className={defYieldMarketMapPageStyles.chainsGrid}>
          {DYM_RISK_CURATORS.map((curator) => (
            <div key={curator.name} className={defYieldMarketMapPageStyles.protocolItem}>
              <div className={defYieldMarketMapPageStyles.protocolIcon}>
                <div className={defYieldMarketMapPageStyles.projectAvatarIcon}>
                  {dymGetInitials(curator.name)}
                </div>
              </div>
              <span className={defYieldMarketMapPageStyles.protocolLabel}>{curator.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function DefYieldMarketMapPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'protocol' | 'chain' | 'asset' | 'curator' | null>(
    null,
  )
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const openModal = (type: 'protocol' | 'chain' | 'asset' | 'curator', item: string) => {
    setModalType(type)
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalType(null)
    setSelectedItem(null)
  }

  return (
    <div className={defYieldMarketMapPageStyles.wrapper}>
      <Text variant="h1" as="h1">
        Where will you get your&nbsp;
        <Emphasis variant="h1colorful" as="span">
          DeFi yield?
        </Emphasis>
      </Text>
      <Text variant="p2" as="p" className={defYieldMarketMapPageStyles.subTitle}>
        The complete DeFi Yield Market Map. Discover DeFi yield, then future proof it with Lazy
        Summer.
      </Text>
      <div className={defYieldMarketMapPageStyles.masonryGrid}>
        {DYM_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} openModal={openModal} />
        )).reduce<React.ReactNode[]>((acc, card, i) => {
          acc.push(card)
          if (i === 1) acc.push(<ChainsCard key="chains" />)
          if (i === 3) acc.push(<AssetsCard key="assets" />)
          if (i === 5) acc.push(<CuratorsCard key="curators" />)

          return acc
        }, [])}
      </div>
      <Modal openModal={isModalOpen} closeModal={closeModal} noScroll>
        <ModalContent type={modalType} item={selectedItem} />
      </Modal>
    </div>
  )
}
