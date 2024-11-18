import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import { type SDKChainId, type SDKVaultishType } from '@summerfi/app-types'
import { ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { createPublicClient, erc20Abi, http } from 'viem'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { useUpdateAANetwork } from '@/hooks/use-update-aa-network'

export const useClient = ({ vault }: { vault?: SDKVaultishType }) => {
  const user = useUser()
  const [tokenBalance, setTokenBalance] = useState<BigNumber>()
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(true)

  const { appChain } = useUpdateAANetwork()

  // Client for read-only data fetching using our rpcGateway
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: appChain,
      transport: http(
        SDKChainIdToRpcGatewayMap[appChain.id as SDKChainId.ARBITRUM | SDKChainId.BASE],
      ),
    })
  }, [appChain])

  useEffect(() => {
    const inputTokenAddress = vault?.inputToken.id
    const inputTokenDecimals = vault?.inputToken.decimals

    if (!user && tokenBalance) {
      setTokenBalance(undefined)
    }

    if (user?.address) {
      if (inputTokenAddress && inputTokenDecimals && !tokenBalance) {
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
      } else {
        setTokenBalanceLoading(false)
      }
    }
  }, [publicClient, tokenBalance, user, vault?.inputToken.id, vault?.inputToken.decimals])

  return {
    publicClient,
    tokenBalance,
    tokenBalanceLoading,
  }
}
