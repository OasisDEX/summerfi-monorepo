import { makeSDK } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import { useMemo } from 'react'
import { getNewDepositTXHandler } from '../handlers/getNewDepositTXHandler'
import { getTokenBySymbolHandler } from '../handlers/getTokenBySymbolHandler'
import { getUserPositionsHandler } from '../handlers/getUserPositionsHandler'
import { getUserPositionHandler } from '../handlers/getUserPositionHandler'
import { getWithdrawTXHandler } from '../handlers/getWithdrawTXHandler'

import { useSDKContext } from '../components/SDKContext'
import { getUserHandler } from '../handlers/getUserHandler'
import { getChainHandler } from '../handlers/getChainHandler'

type UseSdk = {
  walletAddress?: string
  chainId?: number
}

export const useSDK = (params: UseSdk) => {
  const { apiURL } = useSDKContext()
  const sdk = useMemo(() => makeSDK({ apiURL }), [apiURL])

  const { chainId, walletAddress: walletAddressString } = params
  const walletAddress = useMemo(
    () =>
      !walletAddressString ? null : Address.createFromEthereum({ value: walletAddressString }),
    [walletAddressString],
  )
  const getWalletAddress = useMemo(
    () => () => {
      if (!walletAddress) {
        throw new Error('Wallet address is not defined')
      }
      return walletAddress
    },
    [walletAddress],
  )

  const getFleetAddress = useMemo(
    () => (fleetAddressString: string) => Address.createFromEthereum({ value: fleetAddressString }),
    [],
  )

  const getChainInfo = useMemo(
    () => () => {
      if (!chainId) {
        throw new Error('ChainId is not defined')
      }
      return getChainInfoByChainId(chainId)
    },
    [chainId],
  )

  // USER HANDLERS
  const getUser = useMemo(() => getUserHandler(sdk), [sdk])

  // CHAIN HANDLERS
  const getChain = useMemo(() => getChainHandler(sdk), [sdk, chainId])
  const getTokenBySymbol = useMemo(() => getTokenBySymbolHandler(getChain), [getChain])

  // ARMADA HANDLERS
  const getWithdrawTX = useMemo(() => getWithdrawTXHandler(sdk), [sdk])
  const getDepositTX = useMemo(() => getNewDepositTXHandler(sdk), [sdk])
  const getUserPosition = useMemo(() => getUserPositionHandler(sdk), [sdk])
  const getUserPositions = useMemo(() => getUserPositionsHandler(sdk), [sdk])

  return {
    getWalletAddress,
    getFleetAddress,
    getChainInfo,
    getChain,
    getUser,
    getTokenBySymbol,
    getDepositTX,
    getWithdrawTX,
    getUserPositions,
    getUserPosition,
  }
}
