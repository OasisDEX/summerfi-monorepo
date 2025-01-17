import { useEffect, useState } from 'react'
import { ten } from '@summerfi/app-utils'
import { type HexData, type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { erc20Abi } from 'viem'

import { useUserWallet } from '@/hooks/use-user-wallet'

import { useAppSDK } from './use-app-sdk'
import type { useNetworkAlignedClient } from './use-network-aligned-client'

export interface TokenBalanceData {
  vaultToken: IToken | undefined
  token: IToken | undefined
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
}

export const useTokenBalance = ({
  publicClient,
  vaultTokenSymbol,
  tokenSymbol,
  chainId,
  skip, // to be used when we there are multiple calls of this hook within single component
}: {
  publicClient: ReturnType<typeof useNetworkAlignedClient>['publicClient']
  vaultTokenSymbol: string
  tokenSymbol: string
  chainId: number
  skip?: boolean
}): TokenBalanceData => {
  const [vaultToken, setVaultToken] = useState<IToken>()
  const [token, setToken] = useState<IToken>()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(true)
  const { userWalletAddress } = useUserWallet()

  const sdk = useAppSDK()

  useEffect(() => {
    const fetchTokenBalance = async (address: string) => {
      setTokenBalanceLoading(true)
      const tokenRequests: Promise<IToken | undefined>[] = [
        sdk.getTokenBySymbol({
          chainId,
          symbol: vaultTokenSymbol,
        }),
      ]

      if (tokenSymbol !== vaultTokenSymbol) {
        tokenRequests.push(
          sdk.getTokenBySymbol({
            chainId,
            symbol: tokenSymbol,
          }),
        )
      }

      const [fetchedVaultToken, fetchedToken] = (await Promise.all(tokenRequests)) as [
        IToken,
        IToken | undefined,
      ]

      setVaultToken(fetchedVaultToken)

      if (tokenSymbol === 'ETH') {
        setToken(fetchedToken)

        publicClient
          .getBalance({
            address: address as HexData,
          })
          .then((val) => {
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
            setTokenBalanceLoading(false)
            setTokenBalance(
              new BigNumber(val.toString()).div(
                new BigNumber(ten).pow(fetchedOrVaultToken.decimals),
              ),
            )
          })
          .catch((err) => {
            setTokenBalanceLoading(false)
            // eslint-disable-next-line no-console
            console.error('Error reading token balance', err)
          })
      }
    }

    if (!skip && userWalletAddress) {
      fetchTokenBalance(userWalletAddress).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching token balance', err)
        setTokenBalance(undefined)
        setTokenBalanceLoading(false)
      })
    } else {
      setTokenBalanceLoading(false)
    }
  }, [sdk, userWalletAddress, tokenSymbol, vaultTokenSymbol, publicClient, skip, chainId])

  return {
    vaultToken,
    token,
    tokenBalance,
    tokenBalanceLoading,
  }
}
