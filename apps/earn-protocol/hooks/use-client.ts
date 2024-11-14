import { useEffect, useMemo, useState } from 'react'
import { useChain, useUser } from '@account-kit/react'
import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { createPublicClient, createWalletClient, custom, erc20Abi } from 'viem'

export const useClient = ({ vault }: { vault?: SDKVaultishType }) => {
  const user = useUser()
  const { chain: connectedChain } = useChain()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(true)

  const transactionClient = useMemo(() => {
    // used for the tx itself
    if (user) {
      // todo: handle other wallets, this is just working with metamask
      if (user.type === 'eoa' && window.ethereum) {
        const externalProvider = window.ethereum

        return createWalletClient({
          chain: connectedChain,
          transport: custom(externalProvider),
          account: user.address,
        })
      }
    }

    return null
  }, [user, connectedChain])

  const publicClient = useMemo(
    // used for the tx receipt
    () => {
      if (user) {
        // todo: handle other wallets, this is just working with metamask
        if (user.type === 'eoa' && window.ethereum) {
          const externalProvider = window.ethereum

          return createPublicClient({
            chain: connectedChain,
            transport: custom(externalProvider),
          })
        }
      }

      return null
    },
    [connectedChain, user],
  )

  const userChainId = transactionClient?.chain.id
  const vaultChainId = vault ? subgraphNetworkToSDKId(vault.protocol.network) : null

  const isProperChainSelected = userChainId === vaultChainId

  useEffect(() => {
    const inputTokenAddress = vault?.inputToken.id
    const inputTokenDecimals = vault?.inputToken.decimals

    if (!user && tokenBalance) {
      setTokenBalance(undefined)
    }

    if (user?.address && publicClient) {
      if (inputTokenAddress && inputTokenDecimals && !tokenBalance && isProperChainSelected) {
        setTokenBalanceLoading(true)
        publicClient
          .readContract({
            abi: erc20Abi,
            address: inputTokenAddress as `0x${string}`,
            functionName: 'balanceOf',
            args: [user.address],
          })
          .then((val) => {
            setTokenBalanceLoading(false)
            setTokenBalance(
              new BigNumber(val.toString()).div(new BigNumber(ten).pow(inputTokenDecimals)),
            )
          })
          .catch((err) => {
            setTokenBalanceLoading(false)
            // eslint-disable-next-line no-console
            console.error('Error reading token balance', err)
          })
      }
      setTokenBalanceLoading(false)
    }
  }, [
    publicClient,
    tokenBalance,
    user,
    tokenBalanceLoading,
    vault?.inputToken.id,
    vault?.inputToken.decimals,
    isProperChainSelected,
  ])

  return {
    publicClient,
    transactionClient,
    tokenBalance,
    tokenBalanceLoading,
  }
}
