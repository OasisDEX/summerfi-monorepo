import { useCallback, useEffect, useRef, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type IArmadaPosition, type SupportedNetworkIds } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Standalone function to fetch an Armada position for a given vault and user
 * @param {Object} params - Parameters
 * @param {string} params.vaultId - The fleet/vault address to query
 * @param {SupportedNetworkIds} params.chainId - Chain ID where the vault exists
 * @param {string} params.userWalletAddress - The user's wallet address
 * @param {Function} getUserPosition - The getUserPosition function from SDK
 * @returns {Promise<IArmadaPosition | undefined>} The position or undefined
 */
async function updateUserPosition({
  vaultId,
  chainId,
  userWalletAddress,
  getUserPosition,
}: {
  vaultId: string
  chainId: SupportedNetworkIds
  userWalletAddress: string
  getUserPosition: ReturnType<typeof useAppSDK>['getUserPosition']
}): Promise<IArmadaPosition | undefined> {
  const wallet = Wallet.createFrom({
    address: Address.createFromEthereum({
      value: userWalletAddress.toLowerCase(),
    }),
  })
  const chainInfo = getChainInfoByChainId(chainId)
  const sdkUser = User.createFrom({
    chainInfo,
    wallet,
  })

  return await getUserPosition({
    fleetAddress: vaultId,
    user: sdkUser,
  })
}

/**
 * Hook to fetch and manage an Armada position for a given vault
 * @param {Object} params - Hook parameters
 * @param {string} params.vaultId - The fleet/vault address to query
 * @param {SupportedNetworkIds} params.chainId - Chain ID where the vault exists
 * @param {boolean} [params.onlyActive] - When true, only returns positions with amount > 0.01
 * @param {boolean} [params.cached] - When true, uses cached data if available
 * @returns {{ position: IArmadaPosition | undefined, isLoading: boolean }} Position data and loading state
 */
export const usePosition = ({
  vaultId,
  chainId,
  onlyActive,
  cached,
}: {
  vaultId: string
  chainId: SupportedNetworkIds
  onlyActive?: boolean
  cached?: boolean
}) => {
  const [position, setPosition] = useState<IArmadaPosition>()
  const { getUserPosition } = useAppSDK()
  const { userWalletAddress } = useUserWallet()
  const [isLoading, setIsLoading] = useState(false)
  const cacheRef = useRef<Map<string, IArmadaPosition>>(new Map())

  const reFetchPosition = useCallback(async () => {
    if (!userWalletAddress) {
      return Promise.resolve(undefined)
    }

    // Check cache if enabled
    const cacheKey = `${vaultId}-${chainId}-${userWalletAddress}`

    if (cached && cacheRef.current.has(cacheKey)) {
      const cachedPos = cacheRef.current.get(cacheKey)

      if (onlyActive && cachedPos && Number(cachedPos.assetsUSD.amount) < 0.01) {
        setPosition(undefined)
      } else {
        setPosition(cachedPos)
      }

      return cachedPos
    }

    setIsLoading(true)

    return await updateUserPosition({
      vaultId,
      chainId,
      userWalletAddress,
      getUserPosition,
    })
      .then((pos: IArmadaPosition | undefined) => {
        if (!pos) {
          setIsLoading(false)

          return
        }

        // Cache the result
        cacheRef.current.set(cacheKey, pos)
        setIsLoading(false)
        if (onlyActive && Number(pos.assetsUSD.amount) < 0.01) {
          setPosition(undefined)

          return
        }

        setPosition(pos)
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.info('The user does not have a position for this vault', vaultId)
        setIsLoading(false)
      })
  }, [chainId, getUserPosition, onlyActive, userWalletAddress, vaultId, cached])

  useEffect(() => {
    if (!userWalletAddress) {
      return
    }
    setPosition(undefined)
    reFetchPosition()
  }, [chainId, getUserPosition, userWalletAddress, vaultId, onlyActive, reFetchPosition])

  return { position, isLoading, reFetchPosition }
}
