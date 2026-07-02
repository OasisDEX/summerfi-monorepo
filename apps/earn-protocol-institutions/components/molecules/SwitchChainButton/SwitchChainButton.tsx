'use client'

import { type CSSProperties, type FC, useCallback } from 'react'
import {
  Button,
  getEarnProtocolChainById,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { sdkChainIdToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

interface SwitchChainButtonProps {
  /** The chain the panel's actions execute on (the vault's network). */
  requiredChainId: SupportedNetworkIds
  /** Optional override for the explanatory copy shown above the button. */
  message?: string
  style?: CSSProperties
}

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  width: '100%',
  padding: '10px 16px',
  borderRadius: '8px',
  // 10% transparent white banner so it reads as a pinned header strip on the card.
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}

/**
 * One-click prompt to switch the connected wallet to `requiredChainId`. Admin panels disable their
 * controls until the wallet is on the vault's chain (`isProperChain`); previously the only switch
 * affordance lived in the TransactionQueue and appeared only once a transaction was already queued —
 * a chicken-and-egg that left a wrong-chain wallet stuck with disabled buttons and no remedy (role
 * grants, risk-param edits, etc. silently un-clickable). Renders nothing when no wallet is connected
 * or the wallet is already on the right chain.
 */
export const SwitchChainButton: FC<SwitchChainButtonProps> = ({
  requiredChainId,
  message,
  style,
}) => {
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { chain, isSettingChain, setChain } = useEarnProtocolChain()

  const onSwitch = useCallback(() => {
    setChain({ chain: getEarnProtocolChainById(requiredChainId) })
  }, [setChain, requiredChainId])

  // Nothing to do without a wallet, or when already on the right chain (and not mid-switch).
  if (!userWalletAddress || (chain.id === requiredChainId && !isSettingChain)) {
    return null
  }

  const networkName = capitalize(
    sdkChainIdToHumanNetwork(requiredChainId) || `chain ID ${requiredChainId}`,
  )

  return (
    <div style={{ ...wrapperStyle, ...style }}>
      <Text as="p" variant="p4" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
        {message ??
          `Your wallet is connected to a different network. Switch to ${networkName} to manage this vault.`}
      </Text>
      <div style={{ flexShrink: 0 }}>
        <Button variant="primarySmall" onClick={onSwitch} disabled={isSettingChain}>
          {isSettingChain ? 'Switching…' : `Switch to ${networkName}`}
        </Button>
      </div>
    </div>
  )
}
