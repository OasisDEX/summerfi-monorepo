import { type FC, useCallback, useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  Card,
  ERROR_TOAST_CONFIG,
  Expander,
  Icon,
  SDKChainIdToAAChainMap,
  SUCCESS_TOAST_CONFIG,
  Text,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type TokenSymbolsList } from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import clsx from 'clsx'

import { UnstakeVaultTokenForm } from '@/features/unstake-vault-token/components/UnstakeVaultTokenForm/UnstakeVaultTokenForm'
import { useUnstakeVaultTokens } from '@/features/unstake-vault-token/hooks/use-unstake-vault-tokens'
import {
  unstakeVaultTokenReducer,
  unstakeVaultTokenState,
} from '@/features/unstake-vault-token/state'
import { UnstakeVaultTokenStep } from '@/features/unstake-vault-token/types'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'

import { unstakeTokenIconMap, unstakeTokenTitleMap } from './consts'

import classNames from './UnstakeVaultToken.module.css'

interface UnstakeVaultTokenProps {
  vault: SDKVaultishType
  walletAddress: string
}

export const UnstakeVaultToken: FC<UnstakeVaultTokenProps> = ({ vault, walletAddress }) => {
  const [state, dispatch] = useReducer(unstakeVaultTokenReducer, {
    ...unstakeVaultTokenState,
    vaultToken: vault.inputToken.symbol as TokenSymbolsList,
    vaultTokenPrice: vault.inputTokenPriceUSD ? parseFloat(vault.inputTokenPriceUSD) : undefined,
    walletAddress,
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const { userWalletAddress } = useUserWallet()
  const { publicClient } = useNetworkAlignedClient()
  const { chain, setChain } = useChain()

  const { unstakeVaultTokensTransaction, balance } = useUnstakeVaultTokens({
    onSuccess: () => {
      dispatch({ type: 'update-step', payload: UnstakeVaultTokenStep.COMPLETED })
      toast.success('Withdrawal successful', SUCCESS_TOAST_CONFIG)
    },
    onError: () => {
      dispatch({ type: 'update-step', payload: UnstakeVaultTokenStep.ERROR })
      toast.error('Withdrawal failed', ERROR_TOAST_CONFIG)
    },
    network: supportedSDKNetwork(vault.protocol.network),
    publicClient,
    fleetAddress: vault.id,
    walletAddress,
  })

  const isOwner = walletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))

  const handleUnstakeVaultTokens = useCallback(async () => {
    if (chain.id !== vaultChainId) {
      setChain({
        chain: SDKChainIdToAAChainMap[vaultChainId],
      })
    }

    dispatch({ type: 'update-step', payload: UnstakeVaultTokenStep.PENDING })
    await unstakeVaultTokensTransaction()
  }, [dispatch, unstakeVaultTokensTransaction, chain, setChain, vaultChainId])

  const handleExpand = useCallback((flag: boolean) => {
    setIsExpanded(flag)
  }, [])

  if (balance.amount === '0' || balance.amount === undefined) {
    return null
  }

  return (
    <Card variant="cardSecondaryColorfulBorder" className={classNames.unstakeVaultTokenWrapper}>
      <Expander
        title={
          <div className={classNames.expanderTitleWrapper}>
            <div className={classNames.expanderTitleWrapperLeft}>
              <div
                className={clsx(classNames.iconWrapper, {
                  [classNames.iconWrapperError]: state.step === UnstakeVaultTokenStep.ERROR,
                })}
              >
                <Icon iconName={unstakeTokenIconMap[state.step]} size={16} />
              </div>
              <Text as="p" variant="p2semi">
                {unstakeTokenTitleMap[state.step]}
              </Text>
            </div>
            <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              {isExpanded ? '' : 'Withdraw'}
            </Text>
          </div>
        }
        onExpand={handleExpand}
      >
        <UnstakeVaultTokenForm
          state={state}
          handleTx={handleUnstakeVaultTokens}
          balance={balance}
          isOwner={isOwner}
        />
      </Expander>
    </Card>
  )
}
