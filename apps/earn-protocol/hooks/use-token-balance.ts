import { useEffect, useState } from 'react'
import { ten } from '@summerfi/app-utils'
import type { IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { erc20Abi } from 'viem'

import { useAppSDK } from './use-app-sdk'
import type { useClient } from './use-client'

export const useTokenBalance = ({
  publicClient,
  tokenSymbol,
}: {
  publicClient: ReturnType<typeof useClient>['publicClient']
  tokenSymbol: string
}) => {
  const [token, setToken] = useState<IToken>()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(true)

  const sdk = useAppSDK()

  useEffect(() => {
    const fetchTokenBalance = async () => {
      const walletAddress = sdk.getWalletAddress()
      const chainInfo = sdk.getChainInfo()

      setTokenBalanceLoading(true)

      const fetchedToken = await sdk.getTokenBySymbol({
        chainId: chainInfo.chainId,
        symbol: tokenSymbol,
      })

      setToken(fetchedToken)

      publicClient
        .readContract({
          abi: erc20Abi,
          address: fetchedToken.address.value,
          functionName: 'balanceOf',
          args: [walletAddress.value],
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

    fetchTokenBalance().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error fetching token balance', err)
      setTokenBalance(undefined)
      setTokenBalanceLoading(false)
    })
  }, [tokenSymbol, publicClient])

  return {
    token,
    tokenBalance,
    tokenBalanceLoading,
  }
}
