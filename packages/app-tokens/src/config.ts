import { TokenConfig } from './types'
import * as icons from './icons'

const deprecatedTokens = [
  'UNIV2WBTCETH',
  'UNIV2LINKETH',
  'UNIV2UNIETH',
  'UNIV2WBTCDAI',
  'UNIV2AAVEETH',
  'CRVV1ETHSTETH',
]

export const tokenConfigs: TokenConfig[] = [
  {
    symbol: 'USDP',
    precision: 18,
    digits: 5,
    name: 'Pax Dollar',
    icon: icons.usdp_circle_color,
    iconCircle: icons.usdp_circle_color,
    coinpaprikaTicker: 'usdp-paxos-standard-token',
    coinGeckoTicker: 'paxos-standard',
    color: '#0B9F74',
    background: 'linear-gradient(143.13deg, #0B9F74 12.24%, #64DFBB 85.9%) #FFFFFF',
    tags: [],
  },
  {
    symbol: 'STETH',
    precision: 18,
    digits: 5,
    name: 'Lido Staked ETH',
    icon: icons.steth_circle_color,
    iconCircle: icons.steth_circle_color,
    coinpaprikaTicker: 'steth-lido-staked-ether',
    coinGeckoTicker: 'staked-ether',
    color: '#0B91DD',
    rootToken: 'ETH',
    background: 'linear-gradient(143.37deg, #00A3FF 15.97%, #0B91DD 81.1%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'MKR',
    precision: 18,
    digits: 5,
    name: 'Maker',
    icon: icons.mkr_circle_color,
    iconCircle: icons.mkr_circle_color,
    coinpaprikaTicker: 'mkr-maker',
    coinbaseTicker: 'mkr-usd',
    color: '#1AAB9B',
    background: 'linear-gradient(133.41deg, #1AAB9B 17.25%, #22CAB7 86.54%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'WETH',
    precision: 18,
    digits: 5,
    name: 'Wrapped Ether',
    icon: icons.weth_circle_color,
    iconCircle: icons.weth_circle_color,
    coinpaprikaTicker: 'weth-weth',
    coinpaprikaFallbackTicker: 'eth-ethereum',
    coinGeckoTicker: 'weth',
    color: '#25ddfb',
    background: 'linear-gradient(158.87deg, #E2F7F9 0%, #D3F3F5 100%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'ETH',
    precision: 18,
    digits: 5,
    maxSell: '10000000',
    name: 'Ether',
    icon: icons.ether,
    iconCircle: icons.ether_circle_color,
    coinpaprikaTicker: 'eth-ethereum',
    coinbaseTicker: 'eth-usd',
    coinGeckoId: 'ethereum',
    color: '#667FE3',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'WBTC',
    precision: 8,
    digits: 5,
    digitsInstant: 3,
    safeCollRatio: 1.5,
    maxSell: '1000000000000000',
    name: 'Wrapped Bitcoin',
    icon: icons.wbtc,
    iconCircle: icons.wbtc_circle_color,
    coinpaprikaTicker: 'wbtc-wrapped-bitcoin',
    coinGeckoId: 'wrapped-bitcoin',
    coinGeckoTicker: 'wrapped-bitcoin',
    color: '#f09242',
    background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
    tags: [],
    rootToken: 'BTC',
  },
  {
    symbol: 'MANA',
    precision: 18,
    digits: 5,
    name: 'Decentraland',
    icon: icons.mana,
    iconCircle: icons.mana_circle_color,
    color: '#f05',
    coinbaseTicker: 'mana-usd',
    coinGeckoId: 'decentraland',
    background: 'linear-gradient(160.26deg, #FFEAEA 5.25%, #FFF5EA 100%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'LINK',
    precision: 18,
    digits: 5,
    name: 'Chainlink',
    icon: icons.chainlink,
    iconCircle: icons.chainlink_circle_color,
    color: '#375bd2',
    coinbaseTicker: 'link-usd',
    coinGeckoId: 'chainlink',
    background: 'linear-gradient(160.47deg, #E0E8F5 0.35%, #F0FBFD 99.18%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'GUSD',
    precision: 2,
    digits: 2,
    name: 'Gemini dollar',
    icon: icons.gemini,
    iconCircle: icons.gemini_circle_color,
    color: '#25ddfb',
    coinpaprikaTicker: 'gusd-gemini-dollar',
    coinGeckoId: 'gemini-dollar',
    coinGeckoTicker: 'gemini-dollar',
    background: 'linear-gradient(158.87deg, #E2F7F9 0%, #D3F3F5 100%), #FFFFFF',
    tags: ['stablecoin'],
  },
  {
    symbol: 'YFI',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Yearn',
    icon: icons.usdc,
    iconCircle: icons.yfi_circle_color,
    coinbaseTicker: 'yfi-usd',
    coinGeckoId: 'yearn-finance',
    color: '#0657f9',
    background: 'linear-gradient(160.47deg, #E0E8F5 0.35%, #F0FBFD 99.18%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'MATIC',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'MATIC',
    icon: icons.matic_circle_color,
    iconCircle: icons.matic_circle_color,
    color: '#ff077d',
    coinbaseTicker: 'matic-usd',
    coinGeckoId: 'polygon',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'UNIV2DAIETH',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'UNIV2DAIETH',
    icon: icons.deprecated_icon,
    iconCircle: icons.deprecated_icon,
    color: '#ff077d',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
    tags: ['lp-token'],
  },
  {
    symbol: 'WSTETH',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Wrapped Staked ETH',
    icon: icons.wsteth_circle_color,
    iconCircle: icons.wsteth_circle_color,
    oracleTicker: 'wsteth',
    color: '#ff077d',
    background: 'linear-gradient(158.87deg, #E2F7F9 0%, #D3F3F5 100%), #FFFFFF',
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'CBETH',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Coinbase Wrapped Staked ETH',
    icon: icons.cbeth_circle_color,
    iconCircle: icons.cbeth_circle_color,
    color: '#667FE3',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
    coinbaseTicker: 'cbeth-usd',
    coinGeckoTicker: 'coinbase-wrapped-staked-eth',
    coinpaprikaTicker: 'cbeth-coinbase-wrapped-staked-eth',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'BAT',
    precision: 18,
    digits: 5,
    name: 'Basic Attention Token',
    icon: icons.bat,
    iconCircle: icons.bat_circle_color,
    color: '#ff4625',
    background: '',
    tags: [],
  },
  {
    symbol: 'RENBTC',
    precision: 8,
    digits: 5,
    digitsInstant: 3,
    safeCollRatio: 1.5,
    maxSell: '1000000000000000',
    name: 'renBTC',
    icon: icons.renbtc_circle_color,
    iconCircle: icons.renbtc_circle_color,
    coinpaprikaTicker: 'renbtc-renbtc',
    coinGeckoId: 'renbtc',
    color: '#838489',
    background: 'linear-gradient(160.47deg, #F1F5F5 0.35%, #E5E7E8 99.18%), #FFFFFF',
    tags: [],
    rootToken: 'BTC',
  },
  {
    symbol: 'TUSD',
    precision: 18,
    digits: 2,
    name: 'Trust token',
    icon: icons.tusd,
    iconCircle: icons.tusd_circle_color,
    color: '#195aff',
    background: '',
    tags: ['stablecoin'],
  },
  {
    symbol: 'KNC',
    precision: 18,
    digits: 5,
    name: 'Kyber Network',
    icon: icons.kyber,
    iconCircle: icons.kyber_circle_color,
    color: '#30cb9e',
    background: '',
    tags: [],
  },
  {
    symbol: 'PAXUSD',
    precision: 18,
    digits: 2,
    name: 'Paxos Standard',
    icon: icons.pax,
    iconCircle: icons.pax_circle_color,
    color: '#005121',
    background: '',
    tags: ['stablecoin'],
  },
  {
    symbol: 'USDT',
    precision: 6,
    digits: 2,
    name: 'Tether',
    icon: icons.usdt,
    iconCircle: icons.usdt_circle_color,
    color: '259c77',
    background: '',
    tags: ['stablecoin'],
    coinpaprikaTicker: 'usdt-tether',
    coinGeckoTicker: 'tether',
  },
  {
    symbol: 'COMP',
    precision: 18,
    digits: 5,
    name: 'Compound',
    icon: icons.compound,
    iconCircle: icons.compound_circle_color,
    color: '#00D395',
    background: '',
    tags: [],
  },
  {
    symbol: 'LRC',
    precision: 18,
    digits: 5,
    name: 'Loopring',
    icon: icons.lrc,
    iconCircle: icons.lrc_circle_color,
    color: '#1c60ff',
    background: '',
    tags: [],
  },
  {
    symbol: 'ZRX',
    precision: 18,
    digits: 5,
    name: '0x',
    icon: icons.zerox,
    iconCircle: icons.zerox_circle_color,
    color: '#000',
    background: '',
    tags: [],
  },
  {
    symbol: 'USDA',
    precision: 18,
    digits: 2,
    name: 'Angle USD',
    coinGeckoTicker: 'angle-usd',
    icon: icons.usda,
    iconCircle: icons.usda,
    background: '',
    tags: [],
  },
  {
    symbol: 'USDC',
    precision: 6,
    digits: 2,
    digitsInstant: 2,
    maxSell: '1000000000000000',
    name: 'USD Coin',
    icon: icons.usdc,
    iconCircle: icons.usdc_circle_color,
    coinpaprikaTicker: 'usdc-usd-coin',
    coinGeckoTicker: 'usd-coin',
    color: '#2775ca',
    background: 'linear-gradient(152.45deg, #0666CE 8.53%, #61A9F8 91.7%)',
    tags: ['stablecoin'],
  },
  {
    symbol: 'UNI',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Uniswap',
    icon: icons.uni_circle_color,
    iconCircle: icons.uni_circle_color,
    color: '#ff077d',
    coinbaseTicker: 'uni-usd',
    background: 'linear-gradient(160.65deg, #FDEEF3 2.52%, #FFE6F5 101.43%), #FFFFFF',
    tags: [],
  },
  {
    symbol: 'AAVE',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Aave',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave',
    color: '#ff077d',
    background: 'linear-gradient(286.73deg, #B6509E 2.03%, #2EBAC6 100%)',
    tags: [],
  },
  {
    symbol: 'UNIV2USDCETH',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'UNIV2USDCETH',
    icon: icons.univ2_usdc_eth_circles_color,
    iconCircle: icons.univ2_usdc_eth_circles_color,
    color: '#ff077d',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
    tags: ['lp-token'],
  },
  {
    symbol: 'UNIV2DAIUSDC',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'UNIV2DAIUSDC',
    icon: icons.univ2_dai_usdc_circles_color,
    iconCircle: icons.univ2_dai_usdc_circles_color,
    color: '#ff077d',
    background: 'linear-gradient(160.47deg, #E0E8F5 0.35%, #F0FBFD 99.18%), #FFFFFF',
    tags: ['lp-token'],
  },
  {
    symbol: 'UNIV2ETHUSDT',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'UNIV2ETHUSDT',
    icon: icons.univ2_eth_usdt_circles_color,
    iconCircle: icons.univ2_eth_usdt_circles_color,
    color: '#ff077d',
    background: '',
    tags: ['lp-token'],
  },
  {
    symbol: 'UNIV2DAIUSDT',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'UNIV2DAIUSDT',
    icon: icons.univ2_dai_usdt_circles_color,
    iconCircle: icons.univ2_dai_usdt_circles_color,
    color: '#ff077d',
    background: '',
    tags: ['lp-token'],
  },
  {
    symbol: 'GUNIV3DAIUSDC1',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'GUNIV3 DAI / USDC 0.05%',
    icon: icons.guniv3_dai_usdc1_circles_color,
    iconCircle: icons.guniv3_dai_usdc1_circles_color,
    color: '#ff077d',
    background: 'linear-gradient(171.29deg, #FDDEF0 -2.46%, #FFF0F9 -2.45%, #FFF6F1 99.08%)',
    tags: ['lp-token'],
    token0: 'DAI',
    token1: 'USDC',
  },
  {
    symbol: 'GUNIV3DAIUSDC2',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'GUNIV3 DAI / USDC 0.01%',
    icon: icons.guniv3_dai_usdc1_circles_color,
    iconCircle: icons.guniv3_dai_usdc1_circles_color,
    color: '#ff077d',
    background: 'linear-gradient(171.29deg, #FDDEF0 -2.46%, #FFF0F9 -2.45%, #FFF6F1 99.08%)',
    tags: ['lp-token'],
    token0: 'DAI',
    token1: 'USDC',
  },
  {
    symbol: 'DAI',
    precision: 18,
    digits: 4,
    maxSell: '10000000',
    name: 'Dai',
    icon: icons.dai,
    iconCircle: icons.dai_circle_color,
    coinpaprikaTicker: 'dai-dai',
    coinGeckoTicker: 'dai',
    coinbaseTicker: 'dai-usd',
    color: '#fdc134',
    background: '',
    tags: ['stablecoin'],
  },
  {
    symbol: 'RETH',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Rocket Pool ETH',
    icon: icons.reth_circle_color,
    iconCircle: icons.reth_circle_color,
    color: '#FFEAEA',
    coinGeckoTicker: 'rocket-pool-eth',
    background: 'linear-gradient(160.26deg, #FFEAEA 5.25%, #FFF5EA 100%)',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'GNO',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Gnosis',
    icon: icons.gno_circle_color,
    iconCircle: icons.gno_circle_color,
    color: '#FFEAEA',
    coinGeckoTicker: 'gnosis',
    background: '',
    tags: [],
  },
  {
    symbol: 'GHO',
    precision: 18,
    digits: 5,
    name: 'GHO',
    icon: icons.gho_circle_color,
    iconCircle: icons.gho_circle_color,
    color: '#C9B9EE',
    background: '',
    coinGeckoTicker: 'gho',
    coinpaprikaTicker: 'gho-gho',
    tags: ['stablecoin'],
  },
  {
    symbol: 'SAFE',
    precision: 18,
    digits: 5,
    name: 'SAFE',
    coinGeckoTicker: 'safe',
    icon: icons.safe,
    iconCircle: icons.safe,
    background: '',
    tags: [],
  },
  {
    symbol: 'SDAI',
    precision: 18,
    digits: 4,
    name: 'Savings Dai',
    icon: icons.gho_circle_color,
    iconCircle: icons.sdai_circle_color,
    color: '#54ac3c',
    background: '',
    oracleTicker: 'sdai',
    rootToken: 'DAI',
    tags: [],
  },
  {
    symbol: 'TBTC',
    precision: 18,
    digits: 5,
    name: 'Threshold Bitcoin',
    icon: icons.tbtc_circle_color,
    iconCircle: icons.tbtc_circle_color,
    color: '#000000',
    background: '',
    coinbaseTicker: 'btc-usd',
    coinGeckoTicker: 'bitcoin',
    coinpaprikaTicker: 'btc-bitcoin',
    rootToken: 'BTC',
    tags: [],
  },
  {
    symbol: 'WLD',
    precision: 18,
    digits: 5,
    name: 'Worldcoin',
    icon: icons.wld_circle_color,
    iconCircle: icons.wld_circle_color,
    color: '#1e1e1c',
    background: '',
    coinGeckoTicker: 'worldcoin-wld',
    coinpaprikaTicker: 'wld-worldcoin',
    tags: [],
  },
  {
    symbol: 'YIELDETH',
    precision: 18,
    digits: 5,
    name: 'Real Yield ETH',
    icon: icons.yieldeth_circle_color,
    iconCircle: icons.yieldeth_circle_color,
    color: '#17438C',
    background: '',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'YIELDBTC',
    precision: 18,
    digits: 5,
    name: 'Real Yield BTC',
    icon: icons.yieldbtc_circle_color,
    iconCircle: icons.yieldbtc_circle_color,
    color: '#17438C',
    background: '',
    rootToken: 'BTC',
    tags: [],
  },
  {
    symbol: 'LUSD',
    precision: 18,
    digits: 5,
    name: 'Liquitity USD',
    icon: icons.lusd_circle_color,
    iconCircle: icons.lusd_circle_color,
    color: '#17438C',
    background: '',
    coinpaprikaTicker: 'lusd-liquity-usd',
    coinGeckoTicker: 'lusd',
    tags: ['stablecoin'],
  },
  {
    symbol: 'FRAX',
    precision: 18,
    digits: 5,
    name: 'Liquitity USD',
    icon: icons.frax_circle_color,
    iconCircle: icons.frax_circle_color,
    color: '#17438C',
    background: '',
    coinpaprikaTicker: 'frax-frax',
    coinGeckoTicker: 'frax',
    tags: ['stablecoin'],
  },
  {
    symbol: 'SPARK',
    precision: 18,
    digits: 5,
    name: 'Spark',
    icon: icons.spark_circle_color,
    iconCircle: icons.spark_circle_color,
    color: '#17438C',
    background: '',
    tags: ['stablecoin'],
  },
  {
    symbol: 'USDBC',
    precision: 6,
    digits: 2,
    name: 'USD Base Coin',
    icon: icons.usdc_circle_color,
    iconCircle: icons.usdc_circle_color,
    color: '#2775ca',
    background: '',
    coinbaseTicker: 'usd-base-coin',
    coinGeckoTicker: 'bridged-usd-coin-base',
    coinpaprikaTicker: 'usdbc-usd-base-coin',
    tags: ['stablecoin'],
  },
  {
    symbol: 'USDC.E',
    precision: 6,
    digits: 2,
    digitsInstant: 2,
    maxSell: '1000000000000000',
    name: 'Bridged USD Coin',
    icon: icons.usdc,
    iconCircle: icons.usdc_circle_color,
    coinpaprikaTicker: 'usdc-usd-coin',
    coinGeckoTicker: 'usd-coin',
    color: '#2775ca',
    background: 'linear-gradient(152.45deg, #0666CE 8.53%, #61A9F8 91.7%)',
    tags: ['stablecoin'],
  },
  {
    symbol: 'RPL',
    precision: 18,
    digits: 5,
    name: 'Rocket Pool',
    icon: icons.rpl,
    iconCircle: icons.rpl_circle,
    coinGeckoTicker: 'rocket-pool',
    tags: [],
  },
  {
    symbol: 'CRV',
    precision: 18,
    digits: 5,
    name: 'Curve',
    icon: icons.crv,
    iconCircle: icons.crv_circle,
    coinGeckoTicker: 'curve-dao-token',
    tags: [],
  },
  {
    symbol: 'BAL',
    precision: 18,
    digits: 5,
    name: 'Balancer',
    icon: icons.bal,
    iconCircle: icons.bal_circle,
    coinGeckoTicker: 'balancer',
    tags: [],
  },
  {
    symbol: 'LDO',
    precision: 18,
    digits: 5,
    name: 'Lido DAO',
    icon: icons.ldo,
    iconCircle: icons.ldo_circle,
    coinGeckoTicker: 'lido-dao',
    tags: [],
  },
  {
    symbol: 'SUSD',
    precision: 18,
    digits: 5,
    name: 'Synth sUSD',
    icon: icons.susd,
    iconCircle: icons.susd_circle,
    coinGeckoTicker: 'nusd',
    tags: [],
  },
  {
    symbol: 'OP',
    precision: 18,
    digits: 5,
    name: 'Optimism',
    icon: icons.op,
    iconCircle: icons.op_circle,
    coinGeckoTicker: 'optimism',
    tags: [],
  },
  {
    symbol: 'ARB',
    precision: 18,
    digits: 5,
    name: 'Arbitrum',
    icon: icons.arb,
    iconCircle: icons.arb_circle,
    coinGeckoTicker: 'arbitrum',
    tags: [],
  },
  {
    symbol: 'STYETH',
    precision: 18,
    digits: 5,
    name: 'Staked Yearn Ether',
    icon: icons.styeth_circle_color,
    iconCircle: icons.styeth_circle_color,
    coinGeckoTicker: 'staked-yearn-ether',
    coinbaseTicker: '',
    color: '#b49bff',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'AJNA',
    precision: 18,
    digits: 5,
    name: 'AjnaToken',
    icon: icons.ajna_circle_color,
    iconCircle: icons.ajna_circle_color,
    coinGeckoTicker: 'ajna-protocol',
    coinbaseTicker: '',
    rootToken: 'AJNA',
    tags: [],
  },
  {
    symbol: 'MORPHO',
    precision: 18,
    digits: 5,
    name: 'Morpho Blue',
    icon: icons.morpho_circle_color,
    iconCircle: icons.morpho_circle_color,
    tags: [],
  },
  {
    symbol: 'RBN',
    precision: 18,
    digits: 5,
    name: 'Ribbon',
    icon: icons.rbn_circle_color,
    iconCircle: icons.rbn_circle_color,
    coinGeckoTicker: 'ribbon-finance',
    coinbaseTicker: '',
    rootToken: 'RBN',
    tags: [],
  },
  {
    symbol: 'OSETH',
    precision: 18,
    digits: 5,
    name: 'Staked ETH',
    icon: icons.oseth_circle_color,
    iconCircle: icons.oseth_circle_color,
    coinGeckoTicker: 'stakewise-v3-oseth',
    coinbaseTicker: '',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'WEETH',
    precision: 18,
    digits: 5,
    name: 'Wrapped eETH',
    icon: icons.weeth_circle_color,
    iconCircle: icons.weeth_circle_color,
    coinGeckoTicker: 'wrapped-eeth',
    coinbaseTicker: '',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'APXETH',
    precision: 18,
    digits: 5,
    name: 'Autocompounding Pirex Ether',
    icon: icons.apxeth_circle_color,
    iconCircle: icons.apxeth_circle_color,
    coinGeckoTicker: 'dinero-apxeth',
    coinbaseTicker: '',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'SUSDE',
    precision: 18,
    digits: 5,
    name: 'Ethena Staked USDe',
    icon: icons.susde,
    iconCircle: icons.susde,
    coinGeckoTicker: 'susde',
    tags: ['stablecoin'],
  },
  {
    symbol: 'CSETH',
    precision: 18,
    digits: 5,
    name: 'ClayStack Staked ETH',
    icon: icons.cseth,
    iconCircle: icons.cseth,
    coinGeckoTicker: 'claystack-staked-eth',
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'DETH',
    precision: 18,
    digits: 5,
    name: 'Stakehouse dETH',
    icon: icons.deth,
    iconCircle: icons.deth,
    coinGeckoTicker: 'stakehouse-deth',
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'EZETH',
    precision: 18,
    digits: 5,
    name: 'Renzo Restaked ETH',
    icon: icons.ezeth,
    iconCircle: icons.ezeth,
    coinGeckoTicker: 'renzo-restaked-eth',
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'MPETH',
    precision: 18,
    digits: 5,
    name: 'MetaPoolETH',
    icon: icons.mpeth,
    iconCircle: icons.mpeth,
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'UNIETH',
    precision: 18,
    digits: 5,
    name: 'Universal ETH',
    icon: icons.unieth,
    iconCircle: icons.unieth,
    coinGeckoTicker: 'universal-eth',
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'MEVETH',
    precision: 18,
    digits: 5,
    name: 'Mev Liquid Staking',
    icon: icons.meveth,
    iconCircle: icons.meveth,
    coinGeckoTicker: 'meveth',
    rootToken: 'ETH',
    tags: [],
  },
  {
    symbol: 'XETH',
    precision: 18,
    digits: 5,
    name: 'f(x) Protocol Leveraged ETH',
    icon: icons.xeth,
    iconCircle: icons.xeth,
    coinGeckoTicker: 'f-x-protocol-leveraged-eth',
    tags: [],
    rootToken: 'ETH',
  },
  {
    symbol: 'USDE',
    precision: 18,
    digits: 5,
    name: 'USDe',
    icon: icons.usde,
    iconCircle: icons.usde,
    coinGeckoTicker: 'usde',
    tags: [],
    rootToken: 'USD',
  },
  {
    symbol: 'PTWEETH',
    precision: 18,
    digits: 5,
    name: 'Pendle PT-weETH',
    icon: icons.question,
    iconCircle: icons.question,
    iconUnavailable: true,
    tags: [],
  },
  {
    symbol: 'PYUSD',
    precision: 6,
    digits: 5,
    name: 'PayPal USD',
    icon: icons.pyusd,
    iconCircle: icons.pyusd,
    coinGeckoTicker: 'paypal-usd',
    tags: ['stablecoin'],
  },
  {
    symbol: 'CRVUSD',
    precision: 18,
    digits: 5,
    name: 'Curve.Fi USD Stablecoin',
    icon: icons.crv,
    iconCircle: icons.crv_circle,
    coinGeckoTicker: 'crvusd',
    tags: [],
  },
  {
    symbol: 'AETHSDAI',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum sDAI',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-sdai',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHUSDC',
    precision: 6,
    digits: 5,
    name: 'Aave Ethereum USDC',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-usdc',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHUSDT',
    precision: 6,
    digits: 5,
    name: 'Aave Ethereum USDT',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-usdt',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHDAI',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum DAI',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-dai',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHPYUSD',
    precision: 6,
    digits: 5,
    name: 'Aave Ethereum PYUSD',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'paypal-usd', // there is no ticker for Aave PYUSD
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHLUSD',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum LUSD',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'liquity-usd', // there is no ticker for Aave LUSD
    background: '',
    tags: [],
  },
  {
    symbol: 'AUSDC',
    precision: 6,
    digits: 5,
    name: 'Aave interest bearing USDC',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-usdc',
    background: '',
    tags: [],
  },
  {
    symbol: 'ADAI',
    precision: 18,
    digits: 5,
    name: 'Aave interest bearing DAI',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-dai',
    background: '',
    tags: [],
  },
  {
    symbol: 'AUSDT',
    precision: 6,
    digits: 5,
    name: 'Aave interest bearing USDT',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-usdt',
    background: '',
    tags: [],
  },
  {
    symbol: 'CUSDCV3',
    precision: 6,
    digits: 5,
    name: 'Compound v3 USDC',
    icon: icons.compound,
    iconCircle: icons.compound,
    coinGeckoTicker: 'usd-coin', // there is no ticker for Compound v3 USDC
    background: '',
    tags: [],
  },
  {
    symbol: 'CDAI',
    precision: 18,
    digits: 5,
    name: 'Compound Dai',
    icon: icons.compound,
    iconCircle: icons.compound,
    background: '',
    coinGeckoTicker: 'cdai',
    tags: [],
  },
  {
    symbol: 'CUSDC',
    precision: 6,
    digits: 5,
    name: 'Compound USDC',
    icon: icons.compound,
    iconCircle: icons.compound,
    coinGeckoTicker: 'compound-usd-coin',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHWSTETH',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum Wrapped Staked Ether',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-wsteth',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHWETH',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum Wrapped Ether',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    background: '',
    coinGeckoTicker: 'aave-v3-weth',
    tags: [],
  },
  {
    symbol: 'AETHRETH',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum Rocket Pool Ether',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-reth',
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHCBETH',
    precision: 18,
    digits: 5,
    name: 'Aave Ethereum Coinbase Wrapped Staked Ether',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-cbeth',
    background: '',
    tags: [],
  },
  {
    symbol: 'AWETH',
    precision: 18,
    digits: 5,
    name: 'Aave interest bearing Wrapped Ether',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-weth',
    background: '',
    tags: [],
  },
  {
    symbol: 'CETH',
    precision: 18,
    digits: 5,
    name: 'Compound Ether',
    icon: icons.compound,
    iconCircle: icons.compound,
    coinGeckoTicker: 'compound-ether',
    background: '',
    tags: [],
  },
  {
    symbol: 'CWETHV3',
    precision: 18,
    digits: 5,
    name: 'Compound v3 Wrapped Ether',
    icon: icons.compound,
    iconCircle: icons.compound,
    coinGeckoTicker: 'weth', // there is no ticker for Compound v3 Wrapped Ether
    background: '',
    tags: [],
  },
  {
    symbol: 'AETHWBTC',
    precision: 8,
    digits: 5,
    name: 'Aave Ethereum Wrapped Bitcoin',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-v3-wbtc',
    background: '',
    tags: [],
  },
  {
    symbol: 'AWBTC',
    precision: 18,
    digits: 5,
    name: 'Aave interest bearing Wrapped Bitcoin',
    icon: icons.aave_circle_color,
    iconCircle: icons.aave_circle_color,
    coinGeckoTicker: 'aave-wbtc',
    background: '',
    tags: [],
  },
  {
    symbol: 'DEGEN',
    precision: 18,
    digits: 5,
    name: 'Degen',
    coinGeckoTicker: 'degen-base',
    icon: icons.degen,
    iconCircle: icons.degen,
    background: '',
    tags: [],
  },
  {
    symbol: 'ENA',
    precision: 18,
    digits: 5,
    name: 'Ethena',
    icon: icons.ena,
    iconCircle: icons.ena,
    coinGeckoTicker: 'ethena',
    tags: [],
  },
  {
    symbol: 'SNX',
    precision: 18,
    digits: 5,
    name: 'Synthetix Network',
    coinGeckoTicker: 'havven',
    icon: icons.snx,
    iconCircle: icons.snx,
    tags: [],
  },
  {
    symbol: 'AERO',
    precision: 18,
    digits: 5,
    name: 'Aerodrome',
    coinGeckoTicker: 'aerodrome-finance',
    icon: icons.aero,
    iconCircle: icons.aero,
    background: '',
    tags: [],
  },
  {
    symbol: 'PRIME',
    precision: 18,
    digits: 5,
    name: 'Prime',
    coinGeckoTicker: 'echelon-prime',
    icon: icons.prime,
    iconCircle: icons.prime,
    background: '',
    tags: [],
  },
  {
    symbol: 'UNIV2',
    precision: 18,
    digits: 5,
    name: 'Uniswap V2',
    icon: icons.uni_circle_color,
    iconCircle: icons.uni_circle_color,
    background: '',
    tags: [],
  },
  ...deprecatedTokens.map((deprecatedToken) => ({
    symbol: deprecatedToken,
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: deprecatedToken,
    icon: icons.deprecated_icon,
    iconCircle: icons.deprecated_icon,
    color: '#ff077d',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
    tags: [],
  })),
]