/* eslint-disable no-magic-numbers */

import { NetworkNames } from '@summerfi/serverless-shared'

import { GenericTokenIcon } from '@/components/atoms/GenericTokenIcon/GenericTokenIcon'
import { Icon } from '@/components/atoms/Icon/Icon'
import { getToken, getTokenDisplayName, getTokenGuarded, tokensBySymbol } from '@/tokens/helpers'
import { TokenSymbolsList } from '@/tokens/types'

import classNames from '@/components/molecules/TokensGroup/TokensGroup.module.scss'

interface TokensGroupProps {
  forceSize?: number
  network?: NetworkNames
  tokens: TokenSymbolsList[]
}

const defaultSingleSize = 44
const defaultMultipleSize = 30
const networkSizeScaleFactor = 0.1

export function TokensGroup({ forceSize, network, tokens }: TokensGroupProps) {
  const networkSize = forceSize ?? (tokens.length > 1 ? defaultSingleSize : defaultMultipleSize)

  return (
    <div className={classNames.tokensGroupWrapper}>
      <ul
        className={classNames.tokensGroupList}
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
              className={classNames.tokensGroupListItem}
              style={{
                zIndex: tokens.length - i,
              }}
            >
              {Object.keys(tokensBySymbol).includes(resolvedToken) &&
              !getTokenGuarded(resolvedToken)?.iconUnavailable ? (
                <Icon
                  variant={tokens.length ? 'l' : 'xxxl'}
                  key={resolvedTokenData.name}
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
