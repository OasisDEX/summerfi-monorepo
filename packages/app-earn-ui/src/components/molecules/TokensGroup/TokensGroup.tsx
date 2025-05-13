import { type NetworkNames, type TokenSymbolsList } from '@summerfi/app-types'

import { GenericTokenIcon } from '@/components/atoms/GenericTokenIcon/GenericTokenIcon'
import { Icon, type IconPropsBase } from '@/components/atoms/Icon/Icon'
import { getToken, getTokenDisplayName, getTokenGuarded, tokensBySymbol } from '@/tokens/helpers'

import tokensGroupStyles from '@/components/molecules/TokensGroup/TokensGroup.module.css'

interface TokensGroupProps {
  forceSize?: number
  network?: NetworkNames
  tokens: TokenSymbolsList[]
  variant?: IconPropsBase['variant']
}

const defaultSingleSize = 44
const defaultMultipleSize = 30
const networkSizeScaleFactor = 0.1

const tokenMarginRight = {
  l: '-14px',
  xl: '-16px',
  xxl: '-18px',
  xxxl: '-20px',
  s: '-10px',
  xs: '-8px',
  xxs: '-6px',
  m: '-12px',
}

export function TokensGroup({
  forceSize,
  network,
  tokens,
  variant,
}: TokensGroupProps): React.ReactNode {
  const networkSize = forceSize ?? (tokens.length > 1 ? defaultSingleSize : defaultMultipleSize)

  return (
    <div className={tokensGroupStyles.tokensGroupWrapper}>
      <ul
        className={tokensGroupStyles.tokensGroupList}
        style={{
          ...(network && {
            paddingRight: `${networkSize * networkSizeScaleFactor}px`,
          }),
        }}
      >
        {tokens.map((token, i) => {
          const resolvedToken = getTokenDisplayName(token)
          const resolvedTokenData = getToken(resolvedToken)
          const isLastItem = tokens.length - 1 === i

          return (
            <li
              key={i}
              className={tokensGroupStyles.tokensGroupListItem}
              style={{
                zIndex: tokens.length - i,
                marginRight: isLastItem ? 0 : variant ? tokenMarginRight[variant] : '-16px',
              }}
            >
              {Object.keys(tokensBySymbol).includes(resolvedToken) &&
              !getTokenGuarded(resolvedToken)?.iconUnavailable ? (
                <Icon
                  key={`${resolvedTokenData.name}-${i}`}
                  variant={variant ?? (tokens.length ? 'l' : 'xxxl')}
                  iconName={resolvedTokenData.iconName}
                />
              ) : (
                <GenericTokenIcon
                  key={resolvedToken}
                  variant={tokens.length ? 'smallIcon' : 'largeIcon'}
                  symbol={resolvedToken}
                />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
