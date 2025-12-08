import { useCallback, useEffect, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { ten } from '@summerfi/app-utils'
import { getChainInfoByChainId, type HexData, type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { erc20Abi, type PublicClient } from 'viem'

import { useAppSDK } from './use-app-sdk'

export interface TokenBalanceData {
  vaultToken: IToken | undefined
  token: IToken | undefined
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  handleSetTokenBalanceLoading: (loading: boolean) => void
  refetch: () => Promise<void>
}

/**
 * Hook to fetch token balances for vault tokens and their underlying assets
 * @param publicClient - Viem public client for blockchain interactions
 * @param vaultTokenSymbol - Symbol of the vault token (e.g., "STETH")
 * @param tokenSymbol - Symbol of the underlying token (e.g., "USDC")
 * @param chainId - Network chain ID
 * @param skip - Optional flag to skip balance fetching
 * @param overwriteWalletAddress - Optional address to override the connected wallet
 * @returns TokenBalanceData containing vault token, underlying token, balance, and loading state
 */
export const useTokenBalance = ({
  publicClient,
  vaultTokenSymbol,
  tokenSymbol,
  chainId,
  skip, // to be used when we there are multiple calls of this hook within single component
  overwriteWalletAddress,
}: {
  publicClient: PublicClient
  vaultTokenSymbol: string
  tokenSymbol: string
  chainId: number
  skip?: boolean
  overwriteWalletAddress?: string
}): TokenBalanceData => {
  const [vaultToken, setVaultToken] = useState<IToken>()
  const [token, setToken] = useState<IToken>()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()
  const { userWalletAddress } = useUserWallet()
  const walletAddress = overwriteWalletAddress ?? userWalletAddress
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(!!walletAddress)

  const sdk = useAppSDK()
  const getTokenRequest = useCallback(
    (symbol: string) =>
      symbol === 'SUMMER'
        ? sdk.getSummerToken({
            chainInfo: getChainInfoByChainId(chainId),
          })
        : sdk.getTokenBySymbol({
            chainId,
            symbol,
          }),
    [sdk, chainId],
  )
  const fetchTokenBalance = useCallback(async () => {
    setTokenBalance(undefined)
    setTokenBalanceLoading(true)

    const tokenRequests: Promise<IToken | undefined>[] = [getTokenRequest(vaultTokenSymbol)]

    if (tokenSymbol !== vaultTokenSymbol) {
      tokenRequests.push(getTokenRequest(tokenSymbol))
    }

    const [fetchedVaultToken, fetchedToken] = (await Promise.all(tokenRequests)) as [
      IToken,
      IToken | undefined,
    ]

    setVaultToken(fetchedVaultToken)

    if (tokenSymbol === 'ETH') {
      const fetchedOrVaultToken = fetchedToken ?? fetchedVaultToken

      setToken(fetchedOrVaultToken)

      publicClient
        .getBalance({
          address: walletAddress as HexData,
        })
        .then((val) => {
          if (skip) {
            return
          }
          setTokenBalance(new BigNumber(val.toString()).div(new BigNumber(ten).pow(18)))
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error reading ETH balance', err)
        })
        .finally(() => {
          setTokenBalanceLoading(false)
        })
    } else {
      const fetchedOrVaultToken = fetchedToken ?? fetchedVaultToken

      setToken(fetchedOrVaultToken)

      publicClient
        .readContract({
          abi: erc20Abi,
          address: fetchedOrVaultToken.address.value,
          functionName: 'balanceOf',
          args: [walletAddress as HexData],
        })
        .then((val) => {
          if (skip) {
            return
          }
          setTokenBalance(
            new BigNumber(val.toString()).div(new BigNumber(ten).pow(fetchedOrVaultToken.decimals)),
          )
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error reading token balance', err)
        })
        .finally(() => {
          setTokenBalanceLoading(false)
        })
    }
  }, [skip, getTokenRequest, vaultTokenSymbol, tokenSymbol, publicClient, walletAddress])

  useEffect(() => {
    if (!skip && walletAddress) {
      fetchTokenBalance().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching token balance', err)
        setTokenBalance(undefined)
        setTokenBalanceLoading(false)
      })
    }
  }, [
    sdk,
    walletAddress,
    tokenSymbol,
    vaultTokenSymbol,
    publicClient,
    skip,
    chainId,
    fetchTokenBalance,
  ])

  const handleSetTokenBalanceLoading = useCallback(
    (loading: boolean) => {
      if (walletAddress) {
        setTokenBalanceLoading(loading)
      }
    },
    [walletAddress],
  )

  return {
    vaultToken,
    token,
    tokenBalance,
    tokenBalanceLoading,
    handleSetTokenBalanceLoading,
    refetch: fetchTokenBalance,
  }
}
