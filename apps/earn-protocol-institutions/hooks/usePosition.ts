import { useCallback, useEffect, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type IArmadaPosition, type SupportedNetworkIds } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'

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
  getUserPosition: ReturnType<typeof useAdminAppSDK>['getUserPosition']
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
 * @returns {{ position: IArmadaPosition | undefined, isLoading: boolean }} Position data and loading state
 */
export const usePosition = ({
  vaultId,
  chainId,
  onlyActive,
  institutionName,
}: {
  vaultId: string
  chainId: SupportedNetworkIds
  onlyActive?: boolean
  institutionName: string
}) => {
  const [position, setPosition] = useState<IArmadaPosition>()
  const { getUserPosition } = useAdminAppSDK(institutionName)
  const { userWalletAddress } = useUserWallet()
  const [isLoading, setIsLoading] = useState(false)

  const reFetchPosition = useCallback(async () => {
    setIsLoading(true)
    if (!userWalletAddress) {
      return Promise.resolve(undefined)
    }

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
        setIsLoading(false)
        if (onlyActive && Number(pos.amount.amount) < 0.01) {
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
  }, [chainId, getUserPosition, onlyActive, userWalletAddress, vaultId])

  useEffect(() => {
    if (!userWalletAddress) {
      return
    }
    setPosition(undefined)
    reFetchPosition()
  }, [chainId, getUserPosition, userWalletAddress, vaultId, onlyActive, reFetchPosition])

  return { position, isLoading, reFetchPosition }
}
