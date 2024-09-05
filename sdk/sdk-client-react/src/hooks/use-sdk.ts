import { makeSDK } from '@summerfi/sdk-client'
import { useMemo } from 'react'
import { getTokenBySymbolHandler } from '../handlers/getTokenBySymbolHandler'
import { getUserClientHandler } from '../handlers/getUserClientHandler'
import { getWithdrawTXHandler } from '../handlers/getWithdrawTXHandler'
import { getNewDepositTXHandler } from '../handlers/getNewDepositTXHandler'
import { getUserPositionsHandler } from '../handlers/getUserBalanceHandler'

type UseSdk = {
  apiURL: string
  walletAddress: string
  chainId: number
}

export const useSDK = ({ apiURL, chainId, walletAddress }: UseSdk) => {
  const sdk = useMemo(() => makeSDK({ apiURL }), [apiURL])

  const getUserClient = useMemo(() => getUserClientHandler(sdk), [sdk])
  const getTokenBySymbol = useMemo(() => getTokenBySymbolHandler(sdk), [sdk])
  const getWithdrawTX = useMemo(() => getWithdrawTXHandler(sdk), [sdk])
  const getDepositTX = useMemo(() => getNewDepositTXHandler(sdk), [sdk])
  const getUserPositions = useMemo(() => getUserPositionsHandler(sdk), [sdk])

  return {
    getTokenBySymbol,
    getUserClient,
    getWithdrawTX,
    getDepositTX,
    getUserPositions,
  }
}
