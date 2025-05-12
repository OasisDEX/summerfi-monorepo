import { type TokenSymbolsList } from '@summerfi/app-types'
import { type NetworkNames } from '@summerfi/serverless-shared'

import { GenericTokenIcon } from '@/components/atoms/GenericTokenIcon/GenericTokenIcon'
import { Icon } from '@/components/atoms/Icon/Icon'
import { getToken, getTokenDisplayName, getTokenGuarded, tokensBySymbol } from '@/tokens/helpers'

import tokensGroupStyles from '@/components/molecules/TokensGroup/TokensGroup.module.css'

interface TokensGroupProps {
  forceSize?: number
  network?: NetworkNames
  tokens: TokenSymbolsList[]
}

const defaultSingleSize = 44
const defaultMultipleSize = 30
const networkSizeScaleFactor = 0.1

export function TokensGroup({ forceSize, network, tokens }: TokensGroupProps): React.ReactNode {
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

          return (
            <li
              key={i}
              className={tokensGroupStyles.tokensGroupListItem}
              style={{
                zIndex: tokens.length - i,
              }}
            >
              {Object.keys(tokensBySymbol).includes(resolvedToken) &&
              !getTokenGuarded(resolvedToken)?.iconUnavailable ? (
                <Icon
                  key={`${resolvedTokenData.name}-${i}`}
                  variant={tokens.length ? 'l' : 'xxxl'}
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
