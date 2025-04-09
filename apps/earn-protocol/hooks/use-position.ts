import { useEffect, useState } from 'react'
import { type IArmadaPosition, type SDKSupportedChain } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { useAppSDK } from '@/hooks/use-app-sdk'
import { useUserWallet } from '@/hooks/use-user-wallet'

/**
 * Hook to fetch and manage an Armada position for a given vault
 * @param {Object} params - Hook parameters
 * @param {string} params.vaultId - The fleet/vault address to query
 * @param {SDKSupportedChain} params.chainId - Chain ID where the vault exists
 * @param {boolean} [params.onlyActive] - When true, only returns positions with amount > 0.01
 * @returns {{ position: IArmadaPosition | undefined, isLoading: boolean }} Position data and loading state
 */
export const usePosition = ({
  vaultId,
  chainId,
  onlyActive,
}: {
  vaultId: string
  chainId: SDKSupportedChain
  onlyActive?: boolean
}) => {
  const [position, setPosition] = useState<IArmadaPosition>()
  const { getUserPosition } = useAppSDK()
  const { userWalletAddress } = useUserWallet()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userWalletAddress) {
      return
    }
    setPosition(undefined)

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

    setIsLoading(true)

    getUserPosition({
      fleetAddress: vaultId,
      user: sdkUser,
    })
      .then((pos: IArmadaPosition | undefined) => {
        setIsLoading(false)
        if (onlyActive && Number(pos?.amount.amount) < 0.01) {
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
  }, [chainId, getUserPosition, userWalletAddress, vaultId, onlyActive])

  return { position, isLoading }
}
