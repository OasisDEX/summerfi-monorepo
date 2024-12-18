import { useEffect, useState } from 'react'
import { ten } from '@summerfi/app-utils'
import { type Address, type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { erc20Abi } from 'viem'

import { useUserWallet } from '@/hooks/use-user-wallet'

import { useAppSDK } from './use-app-sdk'
import type { useClient } from './use-client'

export const useTokenBalance = ({
  publicClient,
  vaultTokenSymbol,
  tokenSymbol,
  chainId,
  skip, // to be used when we there are multiple calls of this hook within single component
}: {
  publicClient: ReturnType<typeof useClient>['publicClient']
  vaultTokenSymbol: string
  tokenSymbol: string
  chainId?: number
  skip?: boolean
}) => {
  const [vaultToken, setVaultToken] = useState<IToken>()
  const [token, setToken] = useState<IToken>()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(true)
  const { userWalletAddress } = useUserWallet()

  const sdk = useAppSDK()

  const walletAddress = userWalletAddress
  const chainInfo = sdk.getChainInfo()

  useEffect(() => {
    const fetchTokenBalance = async (address: Address) => {
      setTokenBalanceLoading(true)
      const [fetchedToken, fetchedVaultToken] = await Promise.all([
        sdk.getTokenBySymbol({
          chainId: chainId ?? chainInfo.chainId,
          symbol: tokenSymbol,
        }),
        sdk.getTokenBySymbol({
          chainId: chainId ?? chainInfo.chainId,
          symbol: vaultTokenSymbol,
        }),
      ])

      setToken(fetchedToken)
      setVaultToken(fetchedVaultToken)

      publicClient
        .readContract({
          abi: erc20Abi,
          address: fetchedToken.address.value,
          functionName: 'balanceOf',
          args: [address.value],
        })
        .then((val) => {
          setTokenBalanceLoading(false)
          setTokenBalance(
            new BigNumber(val.toString()).div(new BigNumber(ten).pow(fetchedToken.decimals)),
          )
        })
        .catch((err) => {
          setTokenBalanceLoading(false)
          // eslint-disable-next-line no-console
          console.error('Error reading token balance', err)
        })
    }

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
    walletAddress?.toString(),
    chainInfo.chainId,
    tokenSymbol,
    vaultTokenSymbol,
    publicClient,
    skip,
    chainId,
  ])

  return {
    vaultToken,
    token,
    tokenBalance,
    tokenBalanceLoading,
  }
}
