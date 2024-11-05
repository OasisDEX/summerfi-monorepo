import { useEffect, useMemo, useState } from 'react'
import { useChain, useUser } from '@account-kit/react'
import { ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { createPublicClient, createWalletClient, custom, erc20Abi } from 'viem'

export const useClient = (params?: { tokenAddress: `0x${string}`; tokenDecimals: number }) => {
  const user = useUser()
  const { chain: connectedChain } = useChain()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()

  console.log('tokenBalance', tokenBalance)

  const transactionClient = useMemo(() => {
    // used for the tx itself
    if (user) {
      // todo: handle other wallets, this is just working with metamask
      if (user.type === 'eoa') {
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
        if (user.type === 'eoa') {
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

  useEffect(() => {
    if (params && publicClient && user) {
      console.log('Calling: balanceOf', params.tokenAddress, user.address)
      publicClient
        .readContract({
          abi: erc20Abi,
          address: params.tokenAddress,
          functionName: 'balanceOf',
          args: [user.address],
        })
        .then((val) => {
          setTokenBalance(
            new BigNumber(val.toString()).div(new BigNumber(ten).pow(params.tokenDecimals)),
          )
        })
    }
  }, [publicClient, params, user])

  return {
    publicClient,
    transactionClient,
    tokenBalance,
  }
}
