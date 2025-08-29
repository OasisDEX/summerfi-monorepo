import { tokenConfigs } from '@summerfi/app-token-config'
import { type TokenConfig } from '@summerfi/app-types'
import keyBy from 'lodash-es/keyBy'

export const tokens: TokenConfig[] = [...tokenConfigs]
export const tokensBySymbol: { [key: string]: TokenConfig } = keyBy(tokens, 'symbol')

export const getTokenDisplayName = (token: string): string => {
  if (token.toLowerCase() === '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2') {
    return 'MKR'
  }

  return (token === 'WETH' ? 'ETH' : token.toUpperCase()).replace(/-/giu, '')
}

export function getToken(tokenSymbol: string): TokenConfig {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!tokensBySymbol[tokenSymbol.toLocaleUpperCase()]) {
    throw new Error(`No meta information for token: ${tokenSymbol}`)
  }

  return tokensBySymbol[tokenSymbol]
}

export const getTokenGuarded = (tokenSymbol: string): ReturnType<typeof getToken> | undefined => {
  return Object.keys(tokensBySymbol).includes(tokenSymbol) ? getToken(tokenSymbol) : undefined
}
