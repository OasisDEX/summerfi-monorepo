import { makeSDK } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import { useMemo } from 'react'
import { getNewDepositTXHandler } from '../handlers/getNewDepositTXHandler'
import { getTokenBySymbolHandler } from '../handlers/getTokenBySymbolHandler'
import { getUserPositionsHandler } from '../handlers/getUserBalanceHandler'
import { getWithdrawTXHandler } from '../handlers/getWithdrawTXHandler'

import { useSDKContext } from '../components/SDKContext'
import { getUserHandler } from '../handlers/getUserHandler'
import { getChainHandler } from '../handlers/getChainHandler'

type UseSdk = {
  walletAddress: string
  chainId: number
}

export const useSDK = (params: UseSdk) => {
  const { apiURL } = useSDKContext()
  const sdk = useMemo(() => makeSDK({ apiURL }), [apiURL])

  const { chainId } = params
  const chainInfo = useMemo(() => getChainInfoByChainId(chainId), [chainId])

  const walletAddress = useMemo(
    () => Address.createFromEthereum({ value: params.walletAddress }),
    [params.walletAddress],
  )

  // USER HANDLERS
  const getUser = useMemo(() => getUserHandler(sdk), [sdk, chainInfo, walletAddress])

  // CHAIN HANDLERS
  const getChain = useMemo(() => getChainHandler(sdk), [sdk, chainId])
  const getTokenBySymbol = useMemo(() => getTokenBySymbolHandler(getChain), [getChain])

  // ARMADA HANDLERS
  const getWithdrawTX = useMemo(() => getWithdrawTXHandler(sdk, chainInfo), [sdk, chainInfo])
  const getDepositTX = useMemo(() => getNewDepositTXHandler(sdk, chainInfo), [sdk, chainInfo])
  const getUserPositions = useMemo(() => getUserPositionsHandler(sdk), [sdk])

  return {
    getChain,
    getUser,
    getTokenBySymbol,
    getDepositTX,
    getWithdrawTX,
    getUserPositions,
  }
}
