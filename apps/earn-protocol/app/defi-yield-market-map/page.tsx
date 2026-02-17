'use client'
import { useState } from 'react'
import { Card, Emphasis, Modal, Text } from '@summerfi/app-earn-ui'
import Image, { type StaticImageData } from 'next/image'

import defYieldMarketMapPageStyles from './DefYieldMarketMapPage.module.css'

import aave from '@/public/img/protocol_icons_market_map/aave.png'
import aerodrome from '@/public/img/protocol_icons_market_map/aerodrome.png'
import beefy from '@/public/img/protocol_icons_market_map/beefy.png'
import cap from '@/public/img/protocol_icons_market_map/cap.png'
import coinbaseWrappedStakedEth from '@/public/img/protocol_icons_market_map/coinbase-wrapped-staked-eth.png'
import compound from '@/public/img/protocol_icons_market_map/compound.png'
import convexFinance from '@/public/img/protocol_icons_market_map/convex-finance.png'
import curveDex from '@/public/img/protocol_icons_market_map/curve-dex.png'
import drift from '@/public/img/protocol_icons_market_map/drift.png'
import eigenlayer from '@/public/img/protocol_icons_market_map/eigenlayer.png'
import etherFi from '@/public/img/protocol_icons_market_map/ether_fi.png'
import euler from '@/public/img/protocol_icons_market_map/euler.png'
import felixProtocol from '@/public/img/protocol_icons_market_map/felix-protocol.png'
import fluid from '@/public/img/protocol_icons_market_map/fluid.png'
import fraxEther from '@/public/img/protocol_icons_market_map/frax-ether.png'
import hyperbeat from '@/public/img/protocol_icons_market_map/hyperbeat.png'
import hyperlend from '@/public/img/protocol_icons_market_map/hyperlend.png'
import hyperliquid from '@/public/img/protocol_icons_market_map/hyperliquid.png'
import idleFinance from '@/public/img/protocol_icons_market_map/idle-finance.png'
import jito from '@/public/img/protocol_icons_market_map/jito.png'
import jupiter from '@/public/img/protocol_icons_market_map/jupiter.png'
import kaminoLend from '@/public/img/protocol_icons_market_map/kamino-lend.png'
import karak from '@/public/img/protocol_icons_market_map/karak.png'
import kelpDao from '@/public/img/protocol_icons_market_map/kelp-dao.png'
import kinetiq from '@/public/img/protocol_icons_market_map/kinetiq.png'
import lido from '@/public/img/protocol_icons_market_map/lido.png'
import lighter from '@/public/img/protocol_icons_market_map/lighter.png'
import maple from '@/public/img/protocol_icons_market_map/maple.png'
import marginfi from '@/public/img/protocol_icons_market_map/marginfi.png'
import marinadeFinance from '@/public/img/protocol_icons_market_map/marinade-finance.png'
import morpho from '@/public/img/protocol_icons_market_map/morpho.png'
import neutraFinance from '@/public/img/protocol_icons_market_map/neutra-finance.png'
import pendle from '@/public/img/protocol_icons_market_map/pendle.png'
import pufferFinance from '@/public/img/protocol_icons_market_map/puffer-finance.png'
import raydium from '@/public/img/protocol_icons_market_map/raydium.png'
import renzo from '@/public/img/protocol_icons_market_map/renzo.png'
import resolv from '@/public/img/protocol_icons_market_map/resolv.png'
import rocketPool from '@/public/img/protocol_icons_market_map/rocket-pool.png'
import royco from '@/public/img/protocol_icons_market_map/royco.png'
import sanctum from '@/public/img/protocol_icons_market_map/sanctum.png'
import silo from '@/public/img/protocol_icons_market_map/silo.png'
import spark from '@/public/img/protocol_icons_market_map/spark.png'
import spectra from '@/public/img/protocol_icons_market_map/spectra.png'
import stakewise from '@/public/img/protocol_icons_market_map/stakewise.png'
import summerFi from '@/public/img/protocol_icons_market_map/summer_fi.png'
import swell from '@/public/img/protocol_icons_market_map/swell.png'
import symbiotic from '@/public/img/protocol_icons_market_map/symbiotic.png'
import termFinance from '@/public/img/protocol_icons_market_map/term-finance.png'
import traderJoe from '@/public/img/protocol_icons_market_map/trader-joe.png'
import uniswap from '@/public/img/protocol_icons_market_map/uniswap.png'
import velodromeV2 from '@/public/img/protocol_icons_market_map/velodrome-v2.png'
import yearnFinance from '@/public/img/protocol_icons_market_map/yearn-finance.png'
import yoProtocol from '@/public/img/protocol_icons_market_map/yo-protocol.png'

const iconsMap: { [key: string]: StaticImageData } = {
  aave,
  aerodrome,
  beefy,
  cap,
  'coinbase-wrapped-staked-eth': coinbaseWrappedStakedEth,
  compound,
  'convex-finance': convexFinance,
  'curve-dex': curveDex,
  drift,
  eigenlayer,
  'ether.fi': etherFi,
  euler,
  'felix-protocol': felixProtocol,
  fluid,
  'frax-ether': fraxEther,
  hyperbeat,
  hyperlend,
  hyperliquid,
  'idle-finance': idleFinance,
  jito,
  jupiter,
  'kamino-lend': kaminoLend,
  karak,
  'kelp-dao': kelpDao,
  kinetiq,
  lido,
  lighter,
  maple,
  marginfi,
  'marinade-finance': marinadeFinance,
  morpho,
  'neutra-finance': neutraFinance,
  pendle,
  'puffer-finance': pufferFinance,
  raydium,
  renzo,
  resolv,
  'rocket-pool': rocketPool,
  royco,
  sanctum,
  silo,
  spark,
  spectra,
  stakewise,
  'summer.fi': summerFi,
  swell,
  symbiotic,
  'term-finance': termFinance,
  'trader-joe': traderJoe,
  uniswap,
  'velodrome-v2': velodromeV2,
  'yearn-finance': yearnFinance,
  'yo-protocol': yoProtocol,
  ethena: etherFi,
}

interface ProtocolItem {
  name: string
  slug: string
}

interface Subcategory {
  label: string | null
  items: ProtocolItem[]
}

interface Category {
  id: string
  title: string
  color: string
  subcategories: Subcategory[]
}

const CATEGORIES: Category[] = [
  {
    id: 'lending',
    title: 'Lending',
    color: '#ff4d96',
    subcategories: [
      {
        label: 'Peer-to-Pool',
        items: [
          { name: 'Aave', slug: 'aave' },
          { name: 'Compound', slug: 'compound' },
          { name: 'Spark', slug: 'spark' },
          { name: 'Jupiter Lend', slug: 'jupiter' },
          { name: 'Fluid', slug: 'fluid' },
          { name: 'Felix Lending', slug: 'felix-protocol' },
          { name: 'Hyperlend', slug: 'hyperlend' },
          { name: 'Maple', slug: 'maple' },
          { name: 'Kamino', slug: 'kamino-lend' },
          { name: 'MarginFi', slug: 'marginfi' },
          { name: 'Drift', slug: 'drift' },
          { name: 'Cap', slug: 'cap' },
        ],
      },
      {
        label: 'Isolated / Modular',
        items: [
          { name: 'Euler', slug: 'euler' },
          { name: 'Morpho', slug: 'morpho' },
          { name: 'Silo', slug: 'silo' },
        ],
      },
    ],
  },
  {
    id: 'staking',
    title: 'Staking & Liquid Staking',
    color: '#ffd700',
    subcategories: [
      {
        label: null,
        items: [
          { name: 'Lido', slug: 'lido' },
          { name: 'Rocket Pool', slug: 'rocket-pool' },
          { name: 'cbETH', slug: 'coinbase-wrapped-staked-eth' },
          { name: 'sfrxETH', slug: 'frax-ether' },
          { name: 'StakeWise', slug: 'stakewise' },
          { name: 'Swell ETH', slug: 'swell' },
          { name: 'Jito Sol', slug: 'jito' },
          { name: 'Marinade', slug: 'marinade-finance' },
          { name: 'Sanctum', slug: 'sanctum' },
          { name: 'Jupiter', slug: 'jupiter' },
        ],
      },
    ],
  },
  {
    id: 'restaking',
    title: 'Restaking & LRTs',
    color: '#00d4ff',
    subcategories: [
      {
        label: 'Core Restaking',
        items: [
          { name: 'EigenLayer', slug: 'eigenlayer' },
          { name: 'Symbiotic', slug: 'symbiotic' },
          { name: 'Karak', slug: 'karak' },
        ],
      },
      {
        label: 'LRT Protocols',
        items: [
          { name: 'Ether.fi', slug: 'ether.fi' },
          { name: 'Renzo', slug: 'renzo' },
          { name: 'Kelp DAO', slug: 'kelp-dao' },
          { name: 'Puffer', slug: 'puffer-finance' },
          { name: 'Swell', slug: 'swell' },
          { name: 'Kinetiq', slug: 'kinetiq' },
        ],
      },
    ],
  },
  {
    id: 'dex',
    title: 'DEXes / Liquidity Provision',
    color: '#a238ff',
    subcategories: [
      {
        label: null,
        items: [
          { name: 'Uniswap', slug: 'uniswap' },
          { name: 'Curve', slug: 'curve-dex' },
          { name: 'Aerodrome', slug: 'aerodrome' },
          { name: 'Velodrome', slug: 'velodrome-v2' },
          { name: 'Trader Joe', slug: 'trader-joe' },
          { name: 'Raydium', slug: 'raydium' },
        ],
      },
    ],
  },
  {
    id: 'perps',
    title: 'Perp DEX LP Vaults',
    color: '#22b4ff',
    subcategories: [
      {
        label: 'Counterparty Yield',
        items: [
          { name: 'Hyperliquid (HLP)', slug: 'hyperliquid' },
          { name: 'Lighter (LLP)', slug: 'lighter' },
          { name: 'Drift (Insurance Fund)', slug: 'drift' },
        ],
      },
      {
        label: 'Basis Trading / Delta-Neutral',
        items: [
          { name: 'Ethena (USDe / sUSDe)', slug: 'ethena' },
          { name: 'Resolv (USR / RLP)', slug: 'resolv' },
          { name: 'Neutri (nUSD)', slug: 'neutra-finance' },
        ],
      },
    ],
  },
  {
    id: 'fixed',
    title: 'Fixed Rates / Yield Tokenization',
    color: '#ff8700',
    subcategories: [
      {
        label: null,
        items: [
          { name: 'Pendle', slug: 'pendle' },
          { name: 'Spectra', slug: 'spectra' },
          { name: 'Term', slug: 'term-finance' },
          { name: 'Morpho v2', slug: 'morpho' },
        ],
      },
    ],
  },
  {
    id: 'aggregators',
    title: 'Vaults / Yield Aggregators',
    color: '#10b981',
    subcategories: [
      {
        label: null,
        items: [
          { name: 'Summer.fi', slug: 'summer.fi' },
          { name: 'YO', slug: 'yo-protocol' },
          { name: 'Yearn Finance', slug: 'yearn-finance' },
          { name: 'Beefy Finance', slug: 'beefy' },
          { name: 'Convex Finance', slug: 'convex-finance' },
          { name: 'Hyperbeat', slug: 'hyperbeat' },
        ],
      },
    ],
  },
  {
    id: 'structured',
    title: 'Tranching / Risk Structuring',
    color: '#8b5cf6',
    subcategories: [
      {
        label: null,
        items: [
          { name: 'Royco', slug: 'royco' },
          { name: 'Pareto', slug: 'idle-finance' },
        ],
      },
    ],
  },
]

interface ChainItem {
  name: string
  slug: string
}

const CHAINS: ChainItem[] = [
  { name: 'Ethereum', slug: 'ethereum' },
  { name: 'Solana', slug: 'solana' },
  { name: 'Base', slug: 'base' },
  { name: 'Arbitrum', slug: 'arbitrum' },
  { name: 'HyperEVM', slug: 'hyperliquid' },
  { name: 'Plasma', slug: 'plasma' },
  { name: 'Optimism', slug: 'optimism' },
  { name: 'Linea', slug: 'linea' },
  { name: 'Avalanche', slug: 'avalanche' },
]

interface AssetItem {
  name: string
  sub: string
}

interface AssetSection {
  label: string
  items: AssetItem[]
}

const YIELD_ASSETS: { [key: string]: AssetSection } = {
  stablecoins: {
    label: 'Stablecoins',
    items: [
      { name: 'sUSDe', sub: 'Ethena' },
      { name: 'sUSDS', sub: 'Sky' },
      { name: 'sDAI', sub: 'MakerDAO/Sky' },
      { name: 'SyrupUSDC', sub: 'Maple' },
      { name: 'SyrupUSDT', sub: 'Maple' },
      { name: 'USDal', sub: 'Usual' },
      { name: 'USR', sub: 'Resolv' },
    ],
  },
  rwa: {
    label: 'Tokenized U.S. Treasuries / RWAs',
    items: [
      { name: 'BUIDL', sub: 'BlackRock' },
      { name: 'USYC', sub: 'Hashnote' },
      { name: 'BENJI', sub: 'Franklin Templeton' },
      { name: 'USTB', sub: 'Superstate' },
      { name: 'WTGXX', sub: 'WisdomTree' },
      { name: 'OUSG', sub: 'Ondo' },
      { name: 'JTRSY', sub: 'Anemoy/Centrifuge' },
      { name: 'tbBILL', sub: 'OpenEden' },
    ],
  },
  hedgeFunds: {
    label: 'Tokenized Hedge Funds',
    items: [
      { name: 'mF-ONE', sub: 'Midas' },
      { name: 'mHYPER', sub: 'Midas' },
      { name: 'mAPOLLO', sub: 'Midas' },
      { name: 'mMEV', sub: 'Midas' },
      { name: 'mEDGE', sub: 'Midas' },
    ],
  },
}

interface CuratorItem {
  name: string
}

const RISK_CURATORS: CuratorItem[] = [
  { name: 'Steakhouse' },
  { name: 'Gauntlet' },
  { name: 'MEV Capital' },
  { name: 'Re7 Capital' },
  { name: 'Block Analitica' },
  { name: 'August Digital' },
  { name: 'Clearstar' },
  { name: 'kpk' },
  { name: 'Sentora' },
  { name: 'Hyperithm' },
  { name: 'Bitwise' },
]

function getInitials(label: string): string {
  const words = label.split(/[\s-]+/u)

  return words.length > 1
    ? words
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : label.slice(0, 2).toUpperCase()
}

function ModalContent({
  type,
  item,
}: {
  type: 'protocol' | 'chain' | 'asset' | 'curator' | null
  item: string | null
}) {
  if (type === null || item === null) return null

  return (
    <Card variant="cardPrimaryMediumPaddings">
      <Text variant="h4">{`${type.toUpperCase()}: ${item}`}</Text>
    </Card>
  )
}

function ProtocolIcon({ slug, label }: { slug: string; label: string }) {
  const icon = slug in iconsMap ? iconsMap[slug] : undefined

  return (
    <div className={defYieldMarketMapPageStyles.protocolIcon}>
      {icon !== undefined ? (
        <Image src={icon} alt={label} width={48} height={48} style={{ objectFit: 'cover' }} />
      ) : (
        <div className={defYieldMarketMapPageStyles.projectAvatarIcon}>{getInitials(label)}</div>
      )}
    </div>
  )
}

function ProtocolItemCard({
  item,
  openModal,
}: {
  item: ProtocolItem
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
  category: Category
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
          {CHAINS.map((chain) => (
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
  const sections = Object.entries(YIELD_ASSETS)

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
                    {getInitials(asset.name)}
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
          {RISK_CURATORS.map((curator) => (
            <div key={curator.name} className={defYieldMarketMapPageStyles.protocolItem}>
              <div className={defYieldMarketMapPageStyles.protocolIcon}>
                <div className={defYieldMarketMapPageStyles.projectAvatarIcon}>
                  {getInitials(curator.name)}
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
        {CATEGORIES.map((cat) => (
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

/**
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeFi Yield Market Map - summer.fi</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box
        }

        html,
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #0b0b0b;
            color: #fff;
            overflow-x: hidden
        }

        .glow-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none
        }

        .glow-orb-1 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(162, 56, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
            top: -200px;
            left: 20%;
            border-radius: 50%;
            pointer-events: none
        }

        .glow-orb-2 {
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(255, 77, 150, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
            top: 100px;
            right: -100px;
            border-radius: 50%;
            pointer-events: none
        }

        .glow-orb-3 {
            position: absolute;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(50, 50, 100, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
            bottom: -300px;
            left: -200px;
            border-radius: 50%;
            pointer-events: none
        }

        .navbar {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(11, 11, 11, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding: 1rem 2rem
        }

        .navbar-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem
        }

        .navbar-logo {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(90deg, #ff4d96 0%, #a238ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            white-space: nowrap
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: 1rem
        }

        .summer-btn {
            background: linear-gradient(90deg, #ff4d96 0%, #a238ff 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
            white-space: nowrap;
            text-decoration: none;
            display: inline-block
        }

        .summer-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 0 20px rgba(162, 56, 255, 0.4)
        }

        .search-input {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            width: 250px;
            font-size: 0.9rem
        }

        .search-input::placeholder {
            color: rgba(255, 255, 255, 0.4)
        }

        .search-input:focus {
            outline: none;
            border-color: rgba(255, 77, 150, 0.5);
            background: rgba(255, 255, 255, 0.08)
        }

        .hero {
            text-align: center;
            padding: 4rem 2rem 2rem;
            max-width: 900px;
            margin: 0 auto
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 0.5rem
        }

        .hero-gradient {
            background: linear-gradient(90deg, #ff4d96 0%, #a238ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline
        }

        .hero-description {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 1rem;
            line-height: 1.6
        }

        @media(max-width:768px) {
            .hero-title {
                font-size: 2.2rem
            }

            .search-input {
                width: 150px
            }
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            border-radius: 1.5rem;
            padding: 1.5rem;
            transition: background 0.3s, border-color 0.3s
        }

        .glass-card:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.12)
        }

        .masonry-grid {
            column-count: 1;
            column-gap: 1.5rem;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto
        }

        @media(min-width:768px) {
            .masonry-grid {
                column-count: 2
            }
        }

        @media(min-width:1280px) {
            .masonry-grid {
                column-count: 3
            }
        }

        .masonry-item {
            break-inside: avoid;
            margin-bottom: 1.5rem
        }

        .category-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            border-left: 3px solid transparent;
            padding-left: 0.75rem;
            transition: border-color 0.3s
        }

        .glass-card:hover .category-header {
            border-left-color: #ff4d96
        }

        .category-icon {
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            font-size: 1.2rem
        }

        .category-title {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #fff
        }

        .protocol-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem
        }

        @media(max-width:768px) {
            .protocol-grid {
                grid-template-columns: repeat(3, 1fr)
            }
        }

        @media(max-width:480px) {
            .protocol-grid {
                grid-template-columns: repeat(2, 1fr)
            }
        }

        .protocol-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            text-align: center;
            transition: transform 0.2s;
            cursor: pointer
        }

        .protocol-item:hover {
            transform: translateY(-2px)
        }

        .protocol-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.02);
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease, border-color 0.2s ease
        }

        .protocol-item:hover .protocol-icon {
            transform: scale(1.05);
            border-color: rgba(255, 77, 150, 0.5);
            box-shadow: 0 4px 20px rgba(255, 77, 150, 0.2)
        }

        .protocol-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover
        }

        .protocol-label {
            font-size: 0.6875rem;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.2;
            transition: color 0.2s;
            max-width: 70px;
            word-break: break-word
        }

        .protocol-item:hover .protocol-label {
            color: #fff
        }

        .subcategory-divider {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 1rem;
            margin-top: 1rem
        }

        .subcategory-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 0.75rem
        }

        .chain-item,
        .asset-item,
        .curator-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s
        }

        .chain-item:hover,
        .asset-item:hover,
        .curator-item:hover {
            transform: translateY(-2px)
        }

        .chain-icon,
        .asset-icon,
        .curator-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.02);
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease, border-color 0.2s ease
        }

        .chain-item:hover .chain-icon,
        .asset-item:hover .asset-icon,
        .curator-item:hover .curator-icon {
            transform: scale(1.05);
            border-color: rgba(255, 77, 150, 0.5);
            box-shadow: 0 4px 20px rgba(255, 77, 150, 0.2)
        }

        .chain-icon img,
        .asset-icon img,
        .curator-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover
        }

        .chain-label,
        .asset-label,
        .curator-label {
            font-size: 0.6875rem;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.2;
            max-width: 70px;
            word-break: break-word;
            transition: color 0.2s
        }

        .chain-item:hover .chain-label,
        .asset-item:hover .asset-label,
        .curator-item:hover .curator-label {
            color: #fff
        }

        .asset-sub {
            font-size: 0.6rem;
            color: rgba(255, 255, 255, 0.3);
            margin-top: -0.25rem
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(6px);
            z-index: 200;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            opacity: 0;
            transition: opacity 0.3s
        }

        .modal-overlay.visible {
            display: flex;
            opacity: 1
        }

        .modal {
            background: linear-gradient(180deg, #141414 0%, #0f0f0f 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem;
            max-width: 560px;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
            animation: modalIn 0.25s ease-out
        }

        @keyframes modalIn {
            from {
                transform: scale(0.95) translateY(10px);
                opacity: 0
            }

            to {
                transform: scale(1) translateY(0);
                opacity: 1
            }
        }

        .modal-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem 1.5rem 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06)
        }

        .modal-header-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.02)
        }

        .modal-header-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover
        }

        .modal-header-text {
            flex: 1
        }

        .modal-title {
            font-size: 1.25rem;
            font-weight: 700
        }

        .modal-subtitle {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.4);
            margin-top: 0.15rem
        }

        .modal-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.2s;
            padding: 0.25rem;
            line-height: 1
        }

        .modal-close:hover {
            color: #fff
        }

        .modal-body {
            padding: 1.5rem
        }

        .modal-desc {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin-bottom: 1.5rem
        }

        .modal-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-bottom: 1.5rem
        }

        .modal-stat {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 0.75rem;
            padding: 1rem
        }

        .modal-stat-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 0.25rem
        }

        .modal-stat-value {
            font-size: 1.25rem;
            font-weight: 700
        }

        .modal-pools {
            margin-bottom: 1.5rem
        }

        .modal-pools-title {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 0.75rem
        }

        .modal-pool {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.6rem 0.75rem;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            margin-bottom: 0.4rem;
            font-size: 0.8rem
        }

        .modal-pool-name {
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }

        .modal-pool-details {
            display: flex;
            gap: 0.75rem;
            color: rgba(255, 255, 255, 0.4);
            flex-shrink: 0
        }

        .modal-pool-apy {
            color: #10b981;
            font-weight: 600
        }

        .modal-cta {
            background: linear-gradient(135deg, rgba(255, 77, 150, 0.08) 0%, rgba(162, 56, 255, 0.08) 100%);
            border: 1px solid rgba(255, 77, 150, 0.15);
            border-radius: 1rem;
            padding: 1.25rem;
            text-align: center
        }

        .modal-cta-title {
            font-size: 0.95rem;
            font-weight: 700;
            margin-bottom: 0.4rem
        }

        .modal-cta-desc {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 0.75rem;
            line-height: 1.5
        }

        .modal-cta-btn {
            background: linear-gradient(90deg, #ff4d96 0%, #a238ff 100%);
            color: white;
            border: none;
            padding: 0.6rem 1.5rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.2s;
            text-decoration: none;
            display: inline-block
        }

        .modal-cta-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px)
        }

        .modal-links {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06)
        }

        .modal-link {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.8rem;
            text-decoration: none;
            transition: color 0.2s
        }

        .modal-link:hover {
            color: #ff4d96
        }

        .loading-dots {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3rem;
            gap: 0.5rem
        }

        .loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 77, 150, 0.6);
            animation: loading-pulse 1.4s infinite
        }

        .loading-dot:nth-child(2) {
            animation-delay: 0.2s
        }

        .loading-dot:nth-child(3) {
            animation-delay: 0.4s
        }

        @keyframes loading-pulse {

            0%,
            100% {
                opacity: 0.3
            }

            50% {
                opacity: 1
            }
        }

        .cta-section {
            background: linear-gradient(135deg, rgba(255, 77, 150, 0.1) 0%, rgba(162, 56, 255, 0.1) 100%);
            border: 1px solid rgba(255, 77, 150, 0.2);
            border-radius: 1.5rem;
            padding: 2.5rem;
            text-align: center;
            margin: 2rem auto;
            max-width: 600px
        }

        .cta-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem
        }

        .cta-description {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            line-height: 1.6
        }
    </style>
</head>

<body>
    <div class="glow-container">
        <div class="glow-orb-1"></div>
        <div class="glow-orb-2"></div>
        <div class="glow-orb-3"></div>
    </div>

    <nav class="navbar">
        <div class="navbar-content">
            <div class="navbar-logo">summer.fi</div>
            <div class="navbar-right">
                <input type="text" class="search-input" id="searchInput" placeholder="Search protocols...">
                <a href="https://summer.fi/earn?vaults=dao-managed" target="_blank" class="summer-btn">Future proof your
                    DeFi yield</a>
            </div>
        </div>
    </nav>

    <section class="hero">
        <h1 class="hero-title">Where will you get your <span class="hero-gradient">DeFi yield?</span></h1>
        <p class="hero-description">The complete DeFi Yield Market Map. Discover DeFi yield, then future proof it with
            <strong>Lazy Summer</strong></p>
    </section>

    <div class="masonry-grid" id="mainGrid"></div>

    <div class="cta-section">
        <h3 class="cta-title">Future proof your DeFi yield</h3>
        <p class="cta-description">DAO-managed vaults automatically rebalance across the best yield sources, so you
            don&rsquo;t have to.</p>
        <a href="https://summer.fi/earn?vaults=dao-managed" target="_blank" class="summer-btn"
            style="padding:1rem 2rem;font-size:1rem">Explore DAO-Managed Vaults</a>
    </div>

    <div class="modal-overlay" id="modalOverlay">
        <div class="modal" id="modal">
            <div class="modal-header">
                <div class="modal-header-icon" id="modalIcon"></div>
                <div class="modal-header-text">
                    <div class="modal-title" id="modalTitle"></div>
                    <div class="modal-subtitle" id="modalSubtitle"></div>
                </div>
                <button class="modal-close" onclick="closeModal()">&#10005;</button>
            </div>
            <div class="modal-body" id="modalBody"></div>
        </div>
    </div>

    <script>


        // ===== MAPPING OBJECTS =====
        const SN = {
            'aave': 'aave',
            'compound': 'compound',
            'spark': 'spark',
            'jupiter': 'jupiter',
            'fluid': 'fluid',
            'felix-protocol': 'felix',
            'hyperlend': 'hyperlend',
            'maple': 'maple',
            'kamino-lend': 'kamino',
            'marginfi': 'marginfi',
            'drift': 'drift',
            'cap': 'cap',
            'euler': 'euler',
            'morpho': 'morpho',
            'silo': 'silo',
            'lido': 'lido',
            'rocket-pool': 'rocketpool',
            'coinbase-wrapped-staked-eth': 'cbETH',
            'frax-ether': 'sfrxETH',
            'stakewise': 'stakewise',
            'swell': 'swell',
            'jito': 'jitosol',
            'marinade-finance': 'marinade',
            'sanctum': 'sanctum',
            'eigenlayer': 'eigenlayer',
            'symbiotic': 'symbiotic',
            'karak': 'karak',
            'ether.fi': 'etherfi',
            'renzo': 'renzo',
            'kelp-dao': 'kelpdao',
            'puffer-finance': 'puffer',
            'kinetiq': 'Kinetiq',
            'uniswap': 'uniswap',
            'curve-dex': 'curve',
            'aerodrome': 'aerodrome',
            'velodrome-v2': 'velodrome',
            'trader-joe': 'traderjoe',
            'joe-v2': 'traderjoe',
            'raydium': 'raydium',
            'hyperliquid': 'hyperliquid',
            'lighter': 'lighter',
            'ethena': 'ethena',
            'resolv': 'resolv',
            'neutra-finance': 'neutrl',
            'pendle': 'pendle',
            'spectra': 'spectra',
            'term-finance': 'term',
            'summer.fi': 'summer.fi',
            'yo-protocol': 'yo',
            'yearn-finance': 'yearn',
            'beefy': 'beefy',
            'convex-finance': 'convex',
            'hyperbeat': 'hyperbeat',
            'royco': 'royco',
            'idle-finance': 'pareto',
            'idle': 'pareto',
            'sky': 'sky',
            'sky-money': 'sky',
            'gearbox': 'gearbox',
            'silo-finance': 'silo',
            'silo-v2': 'silo'
        };

        const CN = {
            'ethereum': 'ethereum', 'solana': 'solana', 'base': 'base',
            'arbitrum': 'arbitrum', 'hyperliquid': 'hyperliquid', 'plasma': 'plasma',
            'optimism': 'optimism', 'linea': 'linea', 'avalanche': 'avalanche'
        };

        const AN = {
            'sUSDe': 'susde', 'sUSDS': 'susds', 'sDAI': 'sdai',
            'SyrupUSDC': 'syrupusdc', 'SyrupUSDT': 'syrupusdt', 'USDal': 'usdai', 'USR': 'usr',
            'BUIDL': 'buidl', 'USYC': 'usyc', 'BENJI': 'benji', 'USTB': 'superstate',
            'WTGXX': 'wtgxx', 'OUSG': 'ousg', 'JTRSY': 'jtrsy', 'tbBILL': 'thbill',
            'mF-ONE': 'Midas_mF-ONE', 'mHYPER': 'mHYPER_', 'mAPOLLO': 'mAPOLLO',
            'mMEV': 'mMEV', 'mEDGE': 'mEDGE'
        };

        const CRN = {
            'Steakhouse': 'steakhouse', 'Gauntlet': 'gauntlet',
            'MEV Capital': 'mevcapital', 'Re7 Capital': 're7capital',
            'Block Analitica': 'Block_Analitica', 'August Digital': 'August_Digital',
            'Clearstar': 'clearstar', 'kpk': 'kpk', 'Sentora': 'sentora',
            'Hyperithm': 'Hyperithm', 'Bitwise': 'bitwise'
        };

        // Slug aliases for DefiLlama TVL API (try these in order)
        const TVL_SLUGS = {
            'silo': ['silo-v2', 'silo-finance', 'silo'],
            'trader-joe': ['joe-v2', 'trader-joe'],
            'idle-finance': ['idle', 'idle-finance'],
            'neutra-finance': ['neutra-finance', 'neutra'],
            'coinbase-wrapped-staked-eth': ['coinbase-wrapped-staked-eth', 'cbeth'],
            'frax-ether': ['frax-ether', 'frax'],
            'velodrome-v2': ['velodrome-v2', 'velodrome'],
            'puffer-finance': ['puffer-finance', 'puffer'],
            'kelp-dao': ['kelp-dao', 'kelpdao'],
            'kamino-lend': ['kamino-lend', 'kamino'],
            'marinade-finance': ['marinade-finance', 'marinade'],
            'yearn-finance': ['yearn-finance', 'yearn'],
            'convex-finance': ['convex-finance', 'convex'],
            'term-finance': ['term-finance', 'term'],
            'yo-protocol': ['yo-protocol', 'yo'],
            'felix-protocol': ['felix-protocol', 'felix'],
            'curve-dex': ['curve-dex', 'curve-finance', 'curve'],
            'rocket-pool': ['rocket-pool', 'rocketpool']
        };

        // Pool project name aliases (DefiLlama pools use different project names)
        const POOL_SLUGS = {
            'silo': ['silo-v2', 'silo-finance', 'silo'],
            'trader-joe': ['joe-v2', 'trader-joe'],
            'idle-finance': ['idle', 'idle-finance'],
            'velodrome-v2': ['velodrome-v2', 'velodrome'],
            'curve-dex': ['curve-dex', 'curve'],
            'rocket-pool': ['rocket-pool', 'rocketpool'],
            'ether.fi': ['ether.fi', 'etherfi'],
            'coinbase-wrapped-staked-eth': ['coinbase-wrapped-staked-eth', 'cbeth'],
            'frax-ether': ['frax-ether', 'frax-eth']
        };

        // ===== HELPERS =====
        function notionUrl(k) { return k ? NL[k] : null }
        function llamaIcon(s) { return 'https://icons.llama.fi/protocols/' + s }
        function getInitials(n) { const w = n.split(/[\s-]+/); return w.length > 1 ? w.map(x => x[0]).join('').toUpperCase().slice(0, 2) : n.slice(0, 2).toUpperCase() }

        function logoImg(slug, site) {
            const nk = SN[slug]; const nUrl = notionUrl(nk);
            const primarySrc = nUrl || llamaIcon(slug);
            const fb1 = nUrl ? llamaIcon(slug) : 'https://www.google.com/s2/favicons?sz=64&domain=' + (site || slug + '.fi');
            const fb2 = 'https://www.google.com/s2/favicons?sz=64&domain=' + (site || slug + '.fi');
            const ini = getInitials(slug.replace(/-/g, ' '));
            return '<img src="' + primarySrc + '" alt="' + slug + '" style="width:100%;height:100%;object-fit:cover;border-radius:9999px" onerror="this.onerror=function(){this.onerror=function(){this.style.display=\'none\';this.parentNode.innerHTML=\'<div style=\\\'width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff\\\'>' + ini + '</div>\'};this.src=\'' + fb2 + '\'};this.src=\'' + fb1 + '\'">';
        }

        function assetLogoImg(name) {
            const nk = AN[name]; const nUrl = notionUrl(nk);
            if (nUrl) return '<img src="' + nUrl + '" alt="' + name + '" style="width:100%;height:100%;object-fit:cover;border-radius:9999px" onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'<div style=\\\'width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff\\\'>' + getInitials(name) + '</div>\'">';
            return '<div style="width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">' + getInitials(name) + '</div>';
        }

        function curatorLogoImg(name) {
            const nk = CRN[name]; const nUrl = notionUrl(nk);
            if (nUrl) return '<img src="' + nUrl + '" alt="' + name + '" style="width:100%;height:100%;object-fit:cover;border-radius:9999px" onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'<div style=\\\'width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff\\\'>' + getInitials(name) + '</div>\'">';
            return '<div style="width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">' + getInitials(name) + '</div>';
        }

        function chainLogoImg(slug) {
            const nk = CN[slug]; const nUrl = notionUrl(nk);
            if (nUrl) return '<img src="' + nUrl + '" alt="' + slug + '" style="width:100%;height:100%;object-fit:cover;border-radius:9999px" onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'<div style=\\\'width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff\\\'>' + getInitials(slug) + '</div>\'">';
            return '<div style="width:100%;height:100%;border-radius:9999px;background:linear-gradient(135deg,#ff4d96,#a238ff);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">' + getInitials(slug) + '</div>';
        }

        // ===== PROTOCOL DATA =====
        const CATEGORIES = [
            {
                subcategories: [
                    {
                        label: 'Peer-to-Pool', items: [
                            { n: 'Aave', s: 'aave', u: 'aave.com', d: 'Multi-chain lending protocol. Largest DeFi money market with $27B+ TVL across 15+ chains.' },
                            { n: 'Compound', s: 'compound', u: 'compound.finance', d: 'Algorithmic money market protocol. Pioneer of DeFi lending with battle-tested architecture.' },
                            { n: 'Spark', s: 'spark', u: 'spark.fi', d: 'Sky (MakerDAO) ecosystem lending protocol built on Aave V3 architecture.' },
                            { n: 'Jupiter Lend', s: 'jupiter', u: 'jup.ag', d: 'Solana\u2019s premier lending market integrated with Jupiter\u2019s liquidity network.' },
                            { n: 'Fluid', s: 'fluid', u: 'fluid.instadapp.io', d: 'Unified lending, borrowing, and DEX protocol. $3.3B TVL with capital-efficient design.' },
                            { n: 'Felix Lending', s: 'felix-protocol', u: 'felix.bond', d: 'HyperEVM-native CDP lending protocol issuing feUSD stablecoin.' },
                            { n: 'Hyperlend', s: 'hyperlend', u: 'hyperlend.finance', d: 'Lending protocol native to Hyperliquid\u2019s HyperEVM ecosystem.' },
                            { n: 'Maple', s: 'maple', u: 'maple.finance', d: 'Institutional-grade on-chain credit protocol. $4B+ deposits with SyrupUSDC/USDT products.' },
                            { n: 'Kamino', s: 'kamino-lend', u: 'kamino.finance', d: 'Largest Solana lending protocol with $2.8B TVL. Automated vault strategies.' },
                            { n: 'MarginFi', s: 'marginfi', u: 'marginfi.com', d: 'Solana multi-market lending with isolated and global pool structures.' },
                            { n: 'Drift', s: 'drift', u: 'drift.trade', d: 'Solana perps + lending hybrid protocol with integrated yield strategies.' },
                            { n: 'Cap', s: 'cap', u: 'cap.finance', d: 'Yield protocol on Hyperliquid with curated lending vaults and structured yield.' }
                        ]
                    },
                    {
                        label: 'Isolated / Modular', items: [
                            { n: 'Euler', s: 'euler', u: 'euler.finance', d: 'Modular lending with Euler V2 vault architecture. Supports risk-isolated pools.' },
                            { n: 'Morpho', s: 'morpho', u: 'morpho.org', d: 'Permissionless, modular lending with isolated markets. 29+ chain deployments, $3B+ loans.' },
                            { n: 'Silo', s: 'silo', u: 'silo.finance', d: 'Risk-isolated lending pools. $400M+ TVL with Silo V2 on Sonic, Ethereum, Arbitrum.' }
                        ]
                    }
                ]
            },
            {
                subcategories: [{
                    label: null, items: [
                        { n: 'Lido', s: 'lido', u: 'lido.fi', d: 'Largest liquid staking protocol. stETH has 60%+ market share with $18.8B+ TVL.' },
                        { n: 'Rocket Pool', s: 'rocket-pool', u: 'rocketpool.net', d: 'Decentralized ETH staking with permissionless node operation. rETH token.' },
                        { n: 'cbETH', s: 'coinbase-wrapped-staked-eth', u: 'coinbase.com', d: 'Institutional liquid staking from Coinbase. cbETH wrapped staked ETH.' },
                        { n: 'sfrxETH', s: 'frax-ether', u: 'frax.finance', d: 'Frax dual-token ETH staking model. sfrxETH accrues validator yield.' },
                        { n: 'StakeWise', s: 'stakewise', u: 'stakewise.io', d: 'Individual staking positions with osETH liquid staking token.' },
                        { n: 'Swell ETH', s: 'swell', u: 'swellnetwork.io', d: 'Liquid staking (swETH) and liquid restaking (rswETH) for Ethereum.' },
                        { n: 'Jito Sol', s: 'jito', u: 'jito.network', d: 'MEV-optimized Solana liquid staking. JitoSOL earns ~8% APR including MEV tips.' },
                        { n: 'Marinade', s: 'marinade-finance', u: 'marinade.finance', d: 'Solana liquid staking focused on validator diversity. mSOL token.' },
                        { n: 'Sanctum', s: 'sanctum', u: 'sanctum.so', d: 'Validator-specific LSTs on Solana. $2.4B TVL with unified liquidity layer.' },
                        { n: 'Jupiter', s: 'jupiter', u: 'jup.ag', d: 'Jupiter\u2019s liquid staked SOL (jupSOL) with MEV kickback and enhanced yield.' }
                    ]
                }]
            },
            {
                subcategories: [
                    {
                        label: 'Core Restaking', items: [
                            { n: 'EigenLayer', s: 'eigenlayer', u: 'eigenlayer.xyz', d: 'Ethereum restaking pioneer. ~75% market share with $18.5B TVL. Secures AVS networks.' },
                            { n: 'Symbiotic', s: 'symbiotic', u: 'symbiotic.fi', d: 'Permissionless, collateral-agnostic restaking. Immutable core contracts, ~8% market share.' },
                            { n: 'Karak', s: 'karak', u: 'karak.network', d: 'Universal restaking layer. Broadest asset support including LSTs, LRTs, stablecoins.' }
                        ]
                    },
                    {
                        label: 'LRT Protocols', items: [
                            { n: 'Ether.fi', s: 'ether.fi', u: 'ether.fi', d: 'Largest LRT provider. eETH/weETH for restaked ETH yield plus DeFi composability.' },
                            { n: 'Renzo', s: 'renzo', u: 'renzoprotocol.com', d: 'Liquid restaking with ezETH. $1B+ TVL across multiple restaking protocols.' },
                            { n: 'Kelp DAO', s: 'kelp-dao', u: 'kelpdao.xyz', d: 'rsETH liquid restaking token built on EigenLayer infrastructure.' },
                            { n: 'Puffer', s: 'puffer-finance', u: 'puffer.fi', d: 'pufETH liquid restaking with anti-slashing technology and UniFi AVS.' },
                            { n: 'Swell', s: 'swell', u: 'swellnetwork.io', d: 'rswETH liquid restaking token with dual yield from staking + restaking.' },
                            { n: 'Kinetiq', s: 'kinetiq', u: 'kinetiq.xyz', d: 'Hyperliquid-native liquid restaking. kHYPE token for staked HYPE yield.' }
                        ]
                    }
                ]
            },
            {
                subcategories: [{
                    label: null, items: [
                        { n: 'Uniswap', s: 'uniswap', u: 'uniswap.org', d: 'Largest DEX. V3/V4 concentrated liquidity with hooks. $6.8B TVL.' },
                        { n: 'Curve', s: 'curve-dex', u: 'curve.fi', d: 'Stablecoin-optimized AMM with veTokenomics. Deep liquidity for pegged assets.' },
                        { n: 'Aerodrome', s: 'aerodrome', u: 'aerodrome.finance', d: 'Base chain\u2019s dominant DEX. veAERO model with concentrated + volatile pools.' },
                        { n: 'Velodrome', s: 'velodrome-v2', u: 'velodrome.finance', d: 'Optimism / Superchain DEX with ve(3,3) tokenomics and LP incentives.' },
                        { n: 'Trader Joe', s: 'trader-joe', u: 'traderjoexyz.com', d: 'Liquidity Book AMM on Avalanche and Arbitrum with bin-based concentrated liquidity.' },
                        { n: 'Raydium', s: 'raydium', u: 'raydium.io', d: 'Solana AMM with concentrated liquidity. Integrated with OpenBook CLOB.' }
                    ]
                }]
            },
            {
                subcategories: [
                    {
                        label: 'Counterparty Yield', items: [
                            { n: 'Hyperliquid (HLP)', s: 'hyperliquid', u: 'hyperliquid.xyz', d: 'Onchain order book perp DEX. HLP vault earns ~10% APY from market making. 0 protocol fees.' },
                            { n: 'Lighter (LLP)', s: 'lighter', u: 'lighter.xyz', d: 'Hyperliquid-native DEX. LLP vault earns from counterparty trading activity.' },
                            { n: 'Drift (Insurance Fund)', s: 'drift', u: 'drift.trade', d: 'Solana perp DEX with insurance fund vault earning yield from liquidations.' }
                        ]
                    },
                    {
                        label: 'Basis Trading / Delta-Neutral', items: [
                            { n: 'Ethena (USDe / sUSDe)', s: 'ethena', u: 'ethena.fi', d: 'Delta-neutral synthetic dollar (USDe). sUSDe earns funding rate yield, 5-15% APY. $5.8B+ supply.' },
                            { n: 'Resolv (USR / RLP)', s: 'resolv', u: 'resolv.xyz', d: 'Delta-neutral USR stablecoin. USR holders earn 5-6% APY, RLP holders 20-40% APY.' },
                            { n: 'Neutri (nUSD)', s: 'neutra-finance', u: 'neutra.finance', d: 'Delta-neutral yield protocol with nUSD stablecoin backed by hedged positions.' }
                        ]
                    }
                ]
            },
            {
                subcategories: [{
                    label: null, items: [
                        { n: 'Pendle', s: 'pendle', u: 'pendle.finance', d: 'DeFi\u2019s fixed income layer. PT/YT tokenization with $5.7B avg TVL. Boros for funding rate trading.' },
                        { n: 'Spectra', s: 'spectra', u: 'spectra.finance', d: 'Permissionless yield derivatives built on Curve\u2019s AMM. PT/YT with MetaVaults.' },
                        { n: 'Term', s: 'term-finance', u: 'term.finance', d: 'Weekly auction-based fixed-rate lending. $150M+ volume. Blue Sheets for retail.' },
                        { n: 'Morpho v2', s: 'morpho', u: 'morpho.org', d: 'Fixed-rate vaults via curator-managed Morpho markets with predictable yields.' }
                    ]
                }]
            },
            {
                subcategories: [{
                    label: null, items: [
                        { n: 'Summer.fi', s: 'summer.fi', u: 'summer.fi', d: 'DeFi yield automation platform. Access optimized vaults across protocols with curated strategies.' },
                        { n: 'YO', s: 'yo-protocol', u: 'yo.xyz', d: 'Yield optimization protocol aggregating the best DeFi yields across chains.' },
                        { n: 'Yearn Finance', s: 'yearn-finance', u: 'yearn.fi', d: 'Battle-tested yield aggregator. V3 vaults with ~$4.5B AUM and veYFI tokenomics.' },
                        { n: 'Beefy Finance', s: 'beefy', u: 'beefy.com', d: 'Multi-chain auto-compounding vaults across 20+ chains. Set-and-forget yield.' },
                        { n: 'Convex Finance', s: 'convex-finance', u: 'convexfinance.com', d: 'Curve/Balancer LP boosting. Earn boosted CRV rewards without locking tokens.' },
                        { n: 'Hyperbeat', s: 'hyperbeat', u: 'hyperbeat.fi', d: 'Hyperliquid-native yield layer. Automated strategies for HyperEVM ecosystem.' }
                    ]
                }]
            },
            {
                subcategories: [{
                    label: null, items: [
                        { n: 'Royco', s: 'royco', u: 'royco.org', d: 'Incentive marketplace for DeFi liquidity. Connects yield seekers with protocols offering rewards.' },
                        { n: 'Pareto', s: 'idle-finance', u: 'pareto.credit', d: 'Credit coordination protocol (formerly Idle). Perpetual yield tranches with no lockups.' }
                    ]
                }]
            }
        ];

        const CHAINS = [
            { name: 'Ethereum', slug: 'ethereum' }, { name: 'Solana', slug: 'solana' },
            { name: 'Base', slug: 'base' }, { name: 'Arbitrum', slug: 'arbitrum' },
            { name: 'HyperEVM', slug: 'hyperliquid' }, { name: 'Plasma', slug: 'plasma' },
            { name: 'Optimism', slug: 'optimism' }, { name: 'Linea', slug: 'linea' },
            { name: 'Avalanche', slug: 'avalanche' }
        ];

        const YIELD_ASSETS = {
            stablecoins: {
                label: 'Stablecoins', items: [
                    { name: 'sUSDe', sub: 'Ethena' }, { name: 'sUSDS', sub: 'Sky' },
                    { name: 'sDAI', sub: 'MakerDAO/Sky' }, { name: 'SyrupUSDC', sub: 'Maple' },
                    { name: 'SyrupUSDT', sub: 'Maple' }, { name: 'USDal', sub: 'Usual' },
                    { name: 'USR', sub: 'Resolv' }
                ]
            },
            rwa: {
                label: 'Tokenized U.S. Treasuries / RWAs', items: [
                    { name: 'BUIDL', sub: 'BlackRock' }, { name: 'USYC', sub: 'Hashnote' },
                    { name: 'BENJI', sub: 'Franklin Templeton' }, { name: 'USTB', sub: 'Superstate' },
                    { name: 'WTGXX', sub: 'WisdomTree' }, { name: 'OUSG', sub: 'Ondo' },
                    { name: 'JTRSY', sub: 'Anemoy/Centrifuge' }, { name: 'tbBILL', sub: 'OpenEden' }
                ]
            },
            hedgeFunds: {
                label: 'Tokenized Hedge Funds', items: [
                    { name: 'mF-ONE', sub: 'Midas' }, { name: 'mHYPER', sub: 'Midas' },
                    { name: 'mAPOLLO', sub: 'Midas' }, { name: 'mMEV', sub: 'Midas' },
                    { name: 'mEDGE', sub: 'Midas' }
                ]
            }
        };

        const RISK_CURATORS = [
            { name: 'Steakhouse', site: 'steakhouse.financial' },
            { name: 'Gauntlet', site: 'gauntlet.network' },
            { name: 'MEV Capital', site: 'mevcapital.com' },
            { name: 'Re7 Capital', site: 're7.capital' },
            { name: 'Block Analitica', site: 'blockanalitica.com' },
            { name: 'August Digital', site: 'augustdigital.io' },
            { name: 'Clearstar', site: 'clearstar.xyz' },
            { name: 'kpk', site: 'kpk.capital' },
            { name: 'Sentora', site: 'sentora.xyz' },
            { name: 'Hyperithm', site: 'hyperithm.com' },
            { name: 'Bitwise', site: 'bitwiseinvestments.com' }
        ];

        // ===== DEFILLAMA API =====
        let poolsCache = null; let poolsFetchPromise = null;
        function fetchAllPools() {
            if (poolsCache) return Promise.resolve(poolsCache);
            if (poolsFetchPromise) return poolsFetchPromise;
            poolsFetchPromise = fetch('https://yields.llama.fi/pools').then(r => r.json()).then(d => { poolsCache = d.data || []; return poolsCache }).catch(() => { poolsCache = []; return [] });
            return poolsFetchPromise;
        }

        async function fetchTVL(slug) {
            // Try primary slug first, then aliases
            const slugsToTry = TVL_SLUGS[slug] || [slug];
            for (const s of slugsToTry) {
                try {
                    const r = await fetch('https://api.llama.fi/tvl/' + s);
                    const v = await r.json();
                    if (typeof v === 'number' && v > 0) return v;
                } catch { }
            }
            return null;
        }

        function getProtocolPools(slug) {
            if (!poolsCache) return [];
            const slugsToTry = POOL_SLUGS[slug] || [slug];
            let matched = [];
            for (const s of slugsToTry) {
                const found = poolsCache.filter(p => p.project === s);
                if (found.length > matched.length) matched = found;
            }
            matched.sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0));
            return matched.slice(0, 6);
        }

        fetchAllPools();

        // ===== MODAL =====
        function openModal(name, slug, site, desc) {
            const ov = document.getElementById('modalOverlay');
            document.getElementById('modalIcon').innerHTML = logoImg(slug, site);
            document.getElementById('modalTitle').textContent = name;
            document.getElementById('modalSubtitle').textContent = site || '';
            document.getElementById('modalBody').innerHTML = '<div class="loading-dots"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>';
            ov.classList.add('visible');
            document.body.style.overflow = 'hidden';
            loadModalData(name, slug, site, desc);
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('visible');
            document.body.style.overflow = '';
        }

        async function loadModalData(name, slug, site, desc) {
            const body = document.getElementById('modalBody');
            const [tvl, pools] = await Promise.all([fetchTVL(slug), fetchAllPools()]);
            const protoPools = getProtocolPools(slug);
            let avgApy = null;
            if (protoPools.length > 0) {
                const sum = protoPools.reduce((s, p) => s + (p.apy || 0), 0);
                avgApy = sum / protoPools.length;
            }
            let h = '';
            if (desc) h += '<div class="modal-desc">' + desc + '</div>';
            h += '<div class="modal-stats">';
            h += '<div class="modal-stat"><div class="modal-stat-label">Total Value Locked</div><div class="modal-stat-value">' + (tvl !== null ? '$' + (tvl >= 1e9 ? (tvl / 1e9).toFixed(2) + 'B' : tvl >= 1e6 ? (tvl / 1e6).toFixed(1) + 'M' : tvl >= 1e3 ? '$' + (tvl / 1e3).toFixed(0) + 'K' : '$' + Math.round(tvl)) : 'Fetching...') + '</div></div>';
            h += '<div class="modal-stat"><div class="modal-stat-label">Avg APY (Top Pools)</div><div class="modal-stat-value" style="color:#10b981">' + (avgApy !== null ? avgApy.toFixed(2) + '%' : (protoPools.length === 0 && tvl === null ? 'See website' : '--')) + '</div></div>';
            h += '</div>';
            if (protoPools.length > 0) {
                h += '<div class="modal-pools"><div class="modal-pools-title">Top Yield Pools</div>';
                protoPools.forEach(function (p) {
                    var tvlStr = p.tvlUsd >= 1e6 ? '$' + (p.tvlUsd / 1e6).toFixed(1) + 'M' : '$' + (p.tvlUsd / 1e3).toFixed(0) + 'K';
                    h += '<div class="modal-pool"><span class="modal-pool-name">' + p.symbol + '</span><div class="modal-pool-details"><span class="modal-pool-apy">' + (p.apy || 0).toFixed(2) + '%</span><span>' + tvlStr + '</span><span>' + p.chain + '</span></div></div>';
                });
                h += '</div>';
            }
            h += '<div class="modal-cta">';
            h += '<div class="modal-cta-title">Future proof your DeFi yield</div>';
            h += '<div class="modal-cta-desc">DAO-managed vaults from Lazy Summer automatically rebalance across protocols like ' + name + ', so your yield stays optimized without manual effort.</div>';
            h += '<a href="https://summer.fi/earn?vaults=dao-managed" target="_blank" class="modal-cta-btn">Explore DAO-Managed Vaults</a>';
            h += '</div>';
            h += '<div class="modal-links">';
            if (site) h += '<a class="modal-link" href="https://' + site + '" target="_blank">Visit ' + site + ' \u2192</a>';
            h += '<a class="modal-link" href="https://defillama.com/protocol/' + slug + '" target="_blank">DefiLlama \u2192</a>';
            h += '<a class="modal-link" href="https://blog.summer.fi/dao-managed-vaults-how-to-future-proof-your-defi-yield-strategy/" target="_blank">Learn more \u2192</a>';
            h += '</div>';
            body.innerHTML = h;
        }

        document.getElementById('modalOverlay').addEventListener('click', function (e) { if (e.target === this) closeModal() });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal() });

        // ===== RENDER =====
        function renderProtocolItem(p) {
            var esc = p.n.replace(/'/g, "\\'");
            var escD = (p.d || '').replace(/'/g, "\\'");
            return '<div class="protocol-item" onclick="openModal(\'' + esc + '\',\'' + p.s + '\',\'' + p.u + '\',\'' + escD + '\')"><div class="protocol-icon">' + logoImg(p.s, p.u) + '</div><div class="protocol-label">' + p.n + '</div></div>';
        }

        function renderCategoryCard(cat) {
            var h = '<div class="masonry-item glass-card"><div class="category-header"><div class="category-icon" style="background:' + cat.color + '33">' + cat.icon + '</div><div class="category-title">' + cat.title + '</div></div>';
            cat.subcategories.forEach(function (sub) {
                if (sub.label) h += '<div class="subcategory-divider"><div class="subcategory-title">' + sub.label + '</div>';
                h += '<div class="protocol-grid">' + sub.items.map(renderProtocolItem).join('') + '</div>';
                if (sub.label) h += '</div>';
            });
            h += '</div>';
            return h;
        }

        function renderChainsCard() {
            var h = '<div class="masonry-item glass-card"><div class="category-header"><div class="category-icon" style="background:#a238ff33">\u{1F517}</div><div class="category-title">Supported Chains</div></div>';
            h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">';
            CHAINS.forEach(function (c) { h += '<div class="chain-item"><div class="chain-icon">' + chainLogoImg(c.slug) + '</div><div class="chain-label">' + c.name + '</div></div>' });
            h += '</div></div>';
            return h;
        }

        function renderAssetsCard() {
            var h = '<div class="masonry-item glass-card"><div class="category-header"><div class="category-icon" style="background:#ffd70033">\u{1F48E}</div><div class="category-title">Yield-Bearing Assets</div></div>';
            ['stablecoins', 'rwa', 'hedgeFunds'].forEach(function (key, i) {
                var sec = YIELD_ASSETS[key];
                if (i > 0) h += '<div class="subcategory-divider">';
                h += '<div class="subcategory-title">' + sec.label + '</div>';
                h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem">';
                sec.items.forEach(function (a) { h += '<div class="asset-item"><div class="asset-icon">' + assetLogoImg(a.name) + '</div><div class="asset-label">' + a.name + '</div><div class="asset-sub">' + a.sub + '</div></div>' });
                h += '</div>';
                if (i > 0) h += '</div>';
            });
            h += '</div>';
            return h;
        }

        function renderCuratorsCard() {
            var h = '<div class="masonry-item glass-card"><div class="category-header"><div class="category-icon" style="background:#ff4d9633">\u{1F6E1}\uFE0F</div><div class="category-title">Risk Curators</div></div>';
            h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">';
            RISK_CURATORS.forEach(function (c) { h += '<div class="curator-item"><div class="curator-icon">' + curatorLogoImg(c.name) + '</div><div class="curator-label">' + c.name + '</div></div>' });
            h += '</div></div>';
            return h;
        }

        function filterProtocols(term) {
            var t = term.toLowerCase();
            document.querySelectorAll('.masonry-item').forEach(function (item) {
                item.style.display = item.textContent.toLowerCase().includes(t) ? '' : 'none';
            });
        }

        function init() {
            var grid = document.getElementById('mainGrid');
            var h = '';
            CATEGORIES.forEach(function (cat, i) {
                h += renderCategoryCard(cat);
                if (i === 1) h += renderChainsCard();
                if (i === 3) h += renderAssetsCard();
                if (i === 5) h += renderCuratorsCard();
            });
            grid.innerHTML = h;
            document.getElementById('searchInput').addEventListener('input', function (e) { filterProtocols(e.target.value) });
        }
        window.addEventListener('DOMContentLoaded', init);

    </script>
</body>

</html>
*/
