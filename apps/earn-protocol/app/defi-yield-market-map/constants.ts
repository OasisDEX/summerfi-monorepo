import { type StaticImageData } from 'next/image'

import {
  type DYMAssetSection,
  type DYMCategory,
  type DYMChainItem,
  type DYMCuratorItem,
} from './types'

import aave from '@/public/img/protocol_icons_market_map/aave.png'
import aerodrome from '@/public/img/protocol_icons_market_map/aerodrome.png'
import arbitrum from '@/public/img/protocol_icons_market_map/arbitrum.png'
import avalanche from '@/public/img/protocol_icons_market_map/avalanche.png'
import base from '@/public/img/protocol_icons_market_map/base.png'
import beefy from '@/public/img/protocol_icons_market_map/beefy.png'
import benji from '@/public/img/protocol_icons_market_map/benji.png'
import buidl from '@/public/img/protocol_icons_market_map/buidl.png'
import cap from '@/public/img/protocol_icons_market_map/cap.png'
import coinbaseWrappedStakedEth from '@/public/img/protocol_icons_market_map/coinbase-wrapped-staked-eth.png'
import compound from '@/public/img/protocol_icons_market_map/compound.png'
import convexFinance from '@/public/img/protocol_icons_market_map/convex-finance.png'
import curveDex from '@/public/img/protocol_icons_market_map/curve-dex.png'
import drift from '@/public/img/protocol_icons_market_map/drift.png'
import eigenlayer from '@/public/img/protocol_icons_market_map/eigenlayer.png'
import etherFi from '@/public/img/protocol_icons_market_map/ether_fi.png'
import ethereum from '@/public/img/protocol_icons_market_map/ethereum.png'
import euler from '@/public/img/protocol_icons_market_map/euler.png'
import felixProtocol from '@/public/img/protocol_icons_market_map/felix-protocol.png'
import fluid from '@/public/img/protocol_icons_market_map/fluid.png'
import fraxEther from '@/public/img/protocol_icons_market_map/frax-ether.png'
import hyperbeat from '@/public/img/protocol_icons_market_map/hyperbeat.png'
import hyperevm from '@/public/img/protocol_icons_market_map/hyperevm.png'
import hyperlend from '@/public/img/protocol_icons_market_map/hyperlend.png'
import hyperliquid from '@/public/img/protocol_icons_market_map/hyperliquid.png'
import idleFinance from '@/public/img/protocol_icons_market_map/idle-finance.png'
import jito from '@/public/img/protocol_icons_market_map/jito.png'
import jtrsy from '@/public/img/protocol_icons_market_map/jtrsy.png'
import jupiter from '@/public/img/protocol_icons_market_map/jupiter.png'
import kaminoLend from '@/public/img/protocol_icons_market_map/kamino-lend.png'
import karak from '@/public/img/protocol_icons_market_map/karak.png'
import kelpDao from '@/public/img/protocol_icons_market_map/kelp-dao.png'
import kinetiq from '@/public/img/protocol_icons_market_map/kinetiq.png'
import lido from '@/public/img/protocol_icons_market_map/lido.png'
import lighter from '@/public/img/protocol_icons_market_map/lighter.png'
import linea from '@/public/img/protocol_icons_market_map/linea.png'
import maple from '@/public/img/protocol_icons_market_map/maple.png'
import mapollo from '@/public/img/protocol_icons_market_map/mapollo.png'
import marginfi from '@/public/img/protocol_icons_market_map/marginfi.png'
import marinadeFinance from '@/public/img/protocol_icons_market_map/marinade-finance.png'
import medge from '@/public/img/protocol_icons_market_map/medge.png'
import mfOne from '@/public/img/protocol_icons_market_map/mf-one.png'
import mhyper from '@/public/img/protocol_icons_market_map/mhyper.png'
import mmev from '@/public/img/protocol_icons_market_map/mmev.png'
import morpho from '@/public/img/protocol_icons_market_map/morpho.png'
import neutraFinance from '@/public/img/protocol_icons_market_map/neutra-finance.png'
import optimism from '@/public/img/protocol_icons_market_map/optimism.png'
import ousg from '@/public/img/protocol_icons_market_map/ousg.png'
import pendle from '@/public/img/protocol_icons_market_map/pendle.png'
import plasma from '@/public/img/protocol_icons_market_map/plasma.png'
import pufferFinance from '@/public/img/protocol_icons_market_map/puffer-finance.png'
import raydium from '@/public/img/protocol_icons_market_map/raydium.png'
import renzo from '@/public/img/protocol_icons_market_map/renzo.png'
import resolv from '@/public/img/protocol_icons_market_map/resolv.png'
import rocketPool from '@/public/img/protocol_icons_market_map/rocket-pool.png'
import royco from '@/public/img/protocol_icons_market_map/royco.png'
import sanctum from '@/public/img/protocol_icons_market_map/sanctum.png'
import sdai from '@/public/img/protocol_icons_market_map/sdai.png'
import silo from '@/public/img/protocol_icons_market_map/silo.png'
import solana from '@/public/img/protocol_icons_market_map/solana.png'
import spark from '@/public/img/protocol_icons_market_map/spark.png'
import spectra from '@/public/img/protocol_icons_market_map/spectra.png'
import stakewise from '@/public/img/protocol_icons_market_map/stakewise.png'
import summerFi from '@/public/img/protocol_icons_market_map/summer_fi.png'
import susde from '@/public/img/protocol_icons_market_map/susde.png'
import susds from '@/public/img/protocol_icons_market_map/susds.png'
import swell from '@/public/img/protocol_icons_market_map/swell.png'
import symbiotic from '@/public/img/protocol_icons_market_map/symbiotic.png'
import syrupusdc from '@/public/img/protocol_icons_market_map/syrupusdc.png'
import syrupusdt from '@/public/img/protocol_icons_market_map/syrupusdt.png'
import tbbill from '@/public/img/protocol_icons_market_map/tbbill.png'
import termFinance from '@/public/img/protocol_icons_market_map/term-finance.png'
import traderJoe from '@/public/img/protocol_icons_market_map/trader-joe.png'
import uniswap from '@/public/img/protocol_icons_market_map/uniswap.png'
import usdal from '@/public/img/protocol_icons_market_map/usdal.png'
import usr from '@/public/img/protocol_icons_market_map/usr.png'
import ustb from '@/public/img/protocol_icons_market_map/ustb.png'
import usyc from '@/public/img/protocol_icons_market_map/usyc.png'
import velodromeV2 from '@/public/img/protocol_icons_market_map/velodrome-v2.png'
import wtgxx from '@/public/img/protocol_icons_market_map/wtgxx.png'
import yearnFinance from '@/public/img/protocol_icons_market_map/yearn-finance.png'
import yoProtocol from '@/public/img/protocol_icons_market_map/yo-protocol.png'

export const DYM_ICONS: { [key: string]: StaticImageData } = {
  // protocols
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
  // networks
  arbitrum,
  avalanche,
  base,
  ethereum,
  hyperevm,
  linea,
  optimism,
  plasma,
  solana,
  // assets
  benji,
  buidl,
  jtrsy,
  mapollo,
  medge,
  mfOne,
  mhyper,
  mmev,
  ousg,
  sdai,
  susde,
  susds,
  syrupusdc,
  syrupusdt,
  tbbill,
  usdal,
  usr,
  ustb,
  usyc,
  wtgxx,
}

export const DYM_CATEGORIES: DYMCategory[] = [
  {
    id: 'lending',
    title: 'Lending',
    color: '#ff4d96',
    subcategories: [
      {
        label: 'Peer-to-Pool',
        items: [
          {
            name: 'Aave',
            slug: 'aave',
            url: 'aave.com',
            description:
              'Multi-chain lending protocol. Largest DeFi money market with $27B+ TVL across 15+ chains.',
          },
          {
            name: 'Compound',
            slug: 'compound',
            url: 'compound.finance',
            description:
              'Algorithmic money market protocol. Pioneer of DeFi lending with battle-tested architecture.',
          },
          {
            name: 'Spark',
            slug: 'spark',
            url: 'spark.fi',
            description: 'Sky (MakerDAO) ecosystem lending protocol built on Aave V3 architecture.',
          },
          {
            name: 'Jupiter Lend',
            slug: 'jupiter',
            url: 'jup.ag',
            description:
              'Solana\u2019s premier lending market integrated with Jupiter\u2019s liquidity network.',
          },
          {
            name: 'Fluid',
            slug: 'fluid',
            url: 'fluid.instadapp.io',
            description:
              'Unified lending, borrowing, and DEX protocol. $3.3B TVL with capital-efficient design.',
          },
          {
            name: 'Felix Lending',
            slug: 'felix-protocol',
            url: 'felix.bond',
            description: 'HyperEVM-native CDP lending protocol issuing feUSD stablecoin.',
          },
          {
            name: 'Hyperlend',
            slug: 'hyperlend',
            url: 'hyperlend.finance',
            description: 'Lending protocol native to Hyperliquid\u2019s HyperEVM ecosystem.',
          },
          {
            name: 'Maple',
            slug: 'maple',
            url: 'maple.finance',
            description:
              'Institutional-grade on-chain credit protocol. $4B+ deposits with SyrupUSDC/USDT products.',
          },
          {
            name: 'Kamino',
            slug: 'kamino-lend',
            url: 'kamino.finance',
            description:
              'Largest Solana lending protocol with $2.8B TVL. Automated vault strategies.',
          },
          {
            name: 'MarginFi',
            slug: 'marginfi',
            url: 'marginfi.com',
            description: 'Solana multi-market lending with isolated and global pool structures.',
          },
          {
            name: 'Drift',
            slug: 'drift',
            url: 'drift.trade',
            description: 'Solana perps + lending hybrid protocol with integrated yield strategies.',
          },
          {
            name: 'Cap',
            slug: 'cap',
            url: 'cap.finance',
            description:
              'Yield protocol on Hyperliquid with curated lending vaults and structured yield.',
          },
        ],
      },
      {
        label: 'Isolated / Modular',
        items: [
          {
            name: 'Euler',
            slug: 'euler',
            url: 'euler.finance',
            description:
              'Modular lending with Euler V2 vault architecture. Supports risk-isolated pools.',
          },
          {
            name: 'Morpho',
            slug: 'morpho',
            url: 'morpho.org',
            description:
              'Permissionless, modular lending with isolated markets. 29+ chain deployments, $3B+ loans.',
          },
          {
            name: 'Silo',
            slug: 'silo',
            url: 'silo.finance',
            description:
              'Risk-isolated lending pools. $400M+ TVL with Silo V2 on Sonic, Ethereum, Arbitrum.',
          },
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
          {
            name: 'Lido',
            slug: 'lido',
            url: 'lido.fi',
            description:
              'Largest liquid staking protocol. stETH has 60%+ market share with $18.8B+ TVL.',
          },
          {
            name: 'Rocket Pool',
            slug: 'rocket-pool',
            url: 'rocketpool.net',
            description:
              'Decentralized ETH staking with permissionless node operation. rETH token.',
          },
          {
            name: 'cbETH',
            slug: 'coinbase-wrapped-staked-eth',
            url: 'coinbase.com',
            description: 'Institutional liquid staking from Coinbase. cbETH wrapped staked ETH.',
          },
          {
            name: 'sfrxETH',
            slug: 'frax-ether',
            url: 'frax.finance',
            description: 'Frax dual-token ETH staking model. sfrxETH accrues validator yield.',
          },
          {
            name: 'StakeWise',
            slug: 'stakewise',
            url: 'stakewise.io',
            description: 'Individual staking positions with osETH liquid staking token.',
          },
          {
            name: 'Swell ETH',
            slug: 'swell',
            url: 'swellnetwork.io',
            description: 'Liquid staking (swETH) and liquid restaking (rswETH) for Ethereum.',
          },
          {
            name: 'Jito Sol',
            slug: 'jito',
            url: 'jito.network',
            description:
              'MEV-optimized Solana liquid staking. JitoSOL earns ~8% APR including MEV tips.',
          },
          {
            name: 'Marinade',
            slug: 'marinade-finance',
            url: 'marinade.finance',
            description: 'Solana liquid staking focused on validator diversity. mSOL token.',
          },
          {
            name: 'Sanctum',
            slug: 'sanctum',
            url: 'sanctum.so',
            description:
              'Validator-specific LSTs on Solana. $2.4B TVL with unified liquidity layer.',
          },
          {
            name: 'Jupiter',
            slug: 'jupiter',
            url: 'jup.ag',
            description:
              'Jupiter\u2019s liquid staked SOL (jupSOL) with MEV kickback and enhanced yield.',
          },
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
          {
            name: 'EigenLayer',
            slug: 'eigenlayer',
            url: 'eigenlayer.xyz',
            description:
              'Ethereum restaking pioneer. ~75% market share with $18.5B TVL. Secures AVS networks.',
          },
          {
            name: 'Symbiotic',
            slug: 'symbiotic',
            url: 'symbiotic.fi',
            description:
              'Permissionless, collateral-agnostic restaking. Immutable core contracts, ~8% market share.',
          },
          {
            name: 'Karak',
            slug: 'karak',
            url: 'karak.network',
            description:
              'Universal restaking layer. Broadest asset support including LSTs, LRTs, stablecoins.',
          },
        ],
      },
      {
        label: 'LRT Protocols',
        items: [
          {
            name: 'Ether.fi',
            slug: 'ether.fi',
            url: 'ether.fi',
            description:
              'Largest LRT provider. eETH/weETH for restaked ETH yield plus DeFi composability.',
          },
          {
            name: 'Renzo',
            slug: 'renzo',
            url: 'renzoprotocol.com',
            description:
              'Liquid restaking with ezETH. $1B+ TVL across multiple restaking protocols.',
          },
          {
            name: 'Kelp DAO',
            slug: 'kelp-dao',
            url: 'kelpdao.xyz',
            description: 'rsETH liquid restaking token built on EigenLayer infrastructure.',
          },
          {
            name: 'Puffer',
            slug: 'puffer-finance',
            url: 'puffer.fi',
            description: 'pufETH liquid restaking with anti-slashing technology and UniFi AVS.',
          },
          {
            name: 'Swell',
            slug: 'swell',
            url: 'swellnetwork.io',
            description: 'rswETH liquid restaking token with dual yield from staking + restaking.',
          },
          {
            name: 'Kinetiq',
            slug: 'kinetiq',
            url: 'kinetiq.xyz',
            description: 'Hyperliquid-native liquid restaking. kHYPE token for staked HYPE yield.',
          },
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
          {
            name: 'Uniswap',
            slug: 'uniswap',
            url: 'uniswap.org',
            description: 'Largest DEX. V3/V4 concentrated liquidity with hooks. $6.8B TVL.',
          },
          {
            name: 'Curve',
            slug: 'curve-dex',
            url: 'curve.fi',
            description:
              'Stablecoin-optimized AMM with veTokenomics. Deep liquidity for pegged assets.',
          },
          {
            name: 'Aerodrome',
            slug: 'aerodrome',
            url: 'aerodrome.finance',
            description:
              'Base chain\u2019s dominant DEX. veAERO model with concentrated + volatile pools.',
          },
          {
            name: 'Velodrome',
            slug: 'velodrome-v2',
            url: 'velodrome.finance',
            description: 'Optimism / Superchain DEX with ve(3,3) tokenomics and LP incentives.',
          },
          {
            name: 'Trader Joe',
            slug: 'trader-joe',
            url: 'traderjoexyz.com',
            description:
              'Liquidity Book AMM on Avalanche and Arbitrum with bin-based concentrated liquidity.',
          },
          {
            name: 'Raydium',
            slug: 'raydium',
            url: 'raydium.io',
            description: 'Solana AMM with concentrated liquidity. Integrated with OpenBook CLOB',
          },
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
          {
            name: 'Hyperliquid (HLP)',
            slug: 'hyperliquid',
            url: 'hyperliquid.xyz',
            description:
              'Onchain order book perp DEX. HLP vault earns ~10% APY from market making. 0 protocol fees.',
          },
          {
            name: 'Lighter (LLP)',
            slug: 'lighter',
            url: 'lighter.xyz',
            description:
              'Hyperliquid-native DEX. LLP vault earns from counterparty trading activity.',
          },
          {
            name: 'Drift (Insurance Fund)',
            slug: 'drift',
            url: 'drift.trade',
            description:
              'Solana perp DEX with insurance fund vault earning yield from liquidations.',
          },
        ],
      },
      {
        label: 'Basis Trading / Delta-Neutral',
        items: [
          {
            name: 'Ethena (USDe / sUSDe)',
            slug: 'ethena',
            url: 'ethena.fi',
            description:
              'Delta-neutral synthetic dollar (USDe). sUSDe earns funding rate yield, 5-15% APY. $5.8B+ supply.',
          },
          {
            name: 'Resolv (USR / RLP)',
            slug: 'resolv',
            url: 'resolv.xyz',
            description:
              'Delta-neutral USR stablecoin. USR holders earn 5-6% APY, RLP holders 20-40% APY.',
          },
          {
            name: 'Neutri (nUSD)',
            slug: 'neutra-finance',
            url: 'neutra.finance',
            description:
              'Delta-neutral yield protocol with nUSD stablecoin backed by hedged positions.',
          },
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
          {
            name: 'Pendle',
            slug: 'pendle',
            url: 'pendle.finance',
            description:
              'DeFi\u2019s fixed income layer. PT/YT tokenization with $5.7B avg TVL. Boros for funding rate trading.',
          },
          {
            name: 'Spectra',
            slug: 'spectra',
            url: 'spectra.finance',
            description:
              'Permissionless yield derivatives built on Curve\u2019s AMM. PT/YT with MetaVaults.',
          },
          {
            name: 'Term',
            slug: 'term-finance',
            url: 'term.finance',
            description:
              'Weekly auction-based fixed-rate lending. $150M+ volume. Blue Sheets for retail.',
          },
          {
            name: 'Morpho v2',
            slug: 'morpho',
            url: 'morpho.org',
            description:
              'Fixed-rate vaults via curator-managed Morpho markets with predictable yields.',
          },
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
          {
            name: 'Summer.fi',
            slug: 'summer.fi',
            url: 'summer.fi',
            description:
              'DeFi yield automation platform. Access optimized vaults across protocols with curated strategies.',
          },
          {
            name: 'YO',
            slug: 'yo-protocol',
            url: 'yo.xyz',
            description:
              'Yield optimization protocol aggregating the best DeFi yields across chains.',
          },
          {
            name: 'Yearn Finance',
            slug: 'yearn-finance',
            url: 'yearn.fi',
            description:
              'Battle-tested yield aggregator. V3 vaults with ~$4.5B AUM and veYFI tokenomics.',
          },
          {
            name: 'Beefy Finance',
            slug: 'beefy',
            url: 'beefy.com',
            description:
              'Multi-chain auto-compounding vaults across 20+ chains. Set-and-forget yield.',
          },
          {
            name: 'Convex Finance',
            slug: 'convex-finance',
            url: 'convexfinance.com',
            description:
              'Curve/Balancer LP boosting. Earn boosted CRV rewards without locking tokens.',
          },
          {
            name: 'Hyperbeat',
            slug: 'hyperbeat',
            url: 'hyperbeat.fi',
            description:
              'Hyperliquid-native yield layer. Automated strategies for HyperEVM ecosystem.',
          },
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
          {
            name: 'Royco',
            slug: 'royco',
            url: 'royco.org',
            description:
              'Incentive marketplace for DeFi liquidity. Connects yield seekers with protocols offering rewards.',
          },
          {
            name: 'Pareto',
            slug: 'idle-finance',
            url: 'pareto.credit',
            description:
              'Credit coordination protocol (formerly Idle). Perpetual yield tranches with no lockups.',
          },
        ],
      },
    ],
  },
]

export const DYM_CHAINS: DYMChainItem[] = [
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

export const DYM_YIELD_ASSETS: { [key: string]: DYMAssetSection } = {
  stablecoins: {
    label: 'Stablecoins',
    items: [
      { name: 'sUSDe', sub: 'Ethena', slug: 'susde' },
      { name: 'sUSDS', sub: 'Sky', slug: 'susds' },
      { name: 'sDAI', sub: 'MakerDAO/Sky', slug: 'sdai' },
      { name: 'SyrupUSDC', sub: 'Maple', slug: 'syrupusdc' },
      { name: 'SyrupUSDT', sub: 'Maple', slug: 'syrupusdt' },
      { name: 'USDal', sub: 'Usual', slug: 'usdal' },
      { name: 'USR', sub: 'Resolv', slug: 'usr' },
    ],
  },
  rwa: {
    label: 'Tokenized U.S. Treasuries / RWAs',
    items: [
      { name: 'BUIDL', sub: 'BlackRock', slug: 'buidl' },
      { name: 'USYC', sub: 'Hashnote', slug: 'usyc' },
      { name: 'BENJI', sub: 'Franklin Templeton', slug: 'benji' },
      { name: 'USTB', sub: 'Superstate', slug: 'ustb' },
      { name: 'WTGXX', sub: 'WisdomTree', slug: 'wtgxx' },
      { name: 'OUSG', sub: 'Ondo', slug: 'ousg' },
      { name: 'JTRSY', sub: 'Anemoy/Centrifuge', slug: 'jtrsy' },
      { name: 'tbBILL', sub: 'OpenEden', slug: 'tbbill' },
    ],
  },
  hedgeFunds: {
    label: 'Tokenized Hedge Funds',
    items: [
      { name: 'mF-ONE', sub: 'Midas', slug: 'mfOne' },
      { name: 'mHYPER', sub: 'Midas', slug: 'mhyper' },
      { name: 'mAPOLLO', sub: 'Midas', slug: 'mapollo' },
      { name: 'mMEV', sub: 'Midas', slug: 'mmev' },
      { name: 'mEDGE', sub: 'Midas', slug: 'medge' },
    ],
  },
}

export const DYM_RISK_CURATORS: DYMCuratorItem[] = [
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
