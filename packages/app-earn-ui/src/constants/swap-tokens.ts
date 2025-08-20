import { SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'

// For swap testing purposes only adding testToken to dropdown
const swapTokens: { [key: number]: TokenSymbolsList[] | undefined } = {
  // base
  // ETH WETH DAI cbETH tBTC COMP USDC rETH WstETH UNI sUSDe cbBTC MORPHO USDS sUSDS
  [SupportedNetworkIds.Base]: [
    'ETH',
    'WETH',
    'DAI',
    'CBETH',
    'TBTC',
    'COMP',
    'USDC',
    'RETH',
    'WSTETH',
    'UNI',
    'CBBTC',
    'MORPHO',
    'USDS',
  ],
  // arbitrum
  // AAVE rETH USDC WstETH USDs UNI USDT USDC.e WBTC WETH DAI LDO LINK MKR ETH COMP ARB weETH USDe cbBTC
  [SupportedNetworkIds.ArbitrumOne]: [
    'AAVE',
    'RETH',
    'USDC',
    'WSTETH',
    'USDS',
    'UNI',
    'USDT',
    'USDC.E',
    'WBTC',
    'WETH',
    'DAI',
    'LDO',
    'LINK',
    'MKR',
    'ETH',
    'COMP',
    'ARB',
    'WEETH',
    'USDE',
    'CBBTC',
  ],
  // mainnet
  // PYUSD LDO WBTC LINK MKR USDC COMP WETH USDT ETH DAI UNI AAVE WstETH rETH cbETH tBTC ARB sDAI weETH USDe sUSDe RSETH rswETH ENA USD0 USD0++ cbBTC SKY USDS sUSDS MORPHO
  [SupportedNetworkIds.Mainnet]: [
    'PYUSD',
    'LDO',
    'WBTC',
    'LINK',
    'USDC',
    'COMP',
    'WETH',
    'USDT',
    'ETH',
    'DAI',
    'UNI',
    'AAVE',
    'WSTETH',
    'RETH',
    'CBETH',
    'TBTC',
    'ARB',
    'SDAI',
    'WEETH',
    'USDE',
    'SUSDE',
    'RSETH',
    'RSWETH',
    'ENA',
    'USD0',
    'USD0++',
    'CBBTC',
    'SKY',
    'USDS',
    'SUSDS',
    'MORPHO',
  ],
}

export const getSwapTokens = (chainId: number): TokenSymbolsList[] => {
  return swapTokens[chainId] ?? []
}
