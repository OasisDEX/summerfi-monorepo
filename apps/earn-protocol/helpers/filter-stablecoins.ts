export const filterStablecoins = (potentialStablecoin: string) => {
  const stablecoins = [
    'USDC',
    'USDC.e',
    'USDT',
    'DAI',
    'EURC',
    'BUSD',
    'TUSD',
    'PAX',
    'GUSD',
    'HUSD',
    'sUSD',
    'MIM',
    'LUSD',
    'usd₮0',
    'sEUR',
  ].map((stablecoin) => stablecoin.toLowerCase())

  return stablecoins.includes(potentialStablecoin.toLowerCase())
}
