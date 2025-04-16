import { useCallback, useEffect, useState } from 'react'
import { ten } from '@summerfi/app-utils'
import { getChainInfoByChainId, type HexData, type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { erc20Abi, type PublicClient } from 'viem'

import { useUserWallet } from '@/hooks/use-user-wallet'

import { useAppSDK } from './use-app-sdk'

interface TokenBalanceData {
  vaultToken: IToken | undefined
  token: IToken | undefined
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
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
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(true)
  const { userWalletAddress } = useUserWallet()

  const walletAddress = overwriteWalletAddress ?? userWalletAddress

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
  const fetchTokenBalance = useCallback(
    async (address: string) => {
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
            address: address as HexData,
          })
          .then((val) => {
            if (skip) {
              return
            }
            setTokenBalanceLoading(false)
            setTokenBalance(new BigNumber(val.toString()).div(new BigNumber(ten).pow(18)))
          })
          .catch((err) => {
            setTokenBalanceLoading(false)
            // eslint-disable-next-line no-console
            console.error('Error reading ETH balance', err)
          })
      } else {
        const fetchedOrVaultToken = fetchedToken ?? fetchedVaultToken

        setToken(fetchedOrVaultToken)

        publicClient
          .readContract({
            abi: erc20Abi,
            address: fetchedOrVaultToken.address.value,
            functionName: 'balanceOf',
            args: [address as HexData],
          })
          .then((val) => {
            if (skip) {
              return
            }
            setTokenBalance(
              new BigNumber(val.toString()).div(
                new BigNumber(ten).pow(fetchedOrVaultToken.decimals),
              ),
            )
            setTokenBalanceLoading(false)
          })
          .catch((err) => {
            setTokenBalanceLoading(false)
            // eslint-disable-next-line no-console
            console.error('Error reading token balance', err)
          })
      }
    },
    [skip, getTokenRequest, vaultTokenSymbol, tokenSymbol, publicClient],
  )

  useEffect(() => {
    if (!skip && walletAddress) {
      fetchTokenBalance(walletAddress).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching token balance', err)
        setTokenBalance(undefined)
        setTokenBalanceLoading(false)
      })
    } else {
      setTokenBalanceLoading(false)
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

  return {
    vaultToken,
    token,
    tokenBalance,
    tokenBalanceLoading,
  }
}
