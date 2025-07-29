import { useEffect, useState } from 'react'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { useAppSDK } from '@/hooks/use-app-sdk'

const getUser = (address: string) =>
  User.createFrom({
    // chainId doesn't matter here since aggregated rewards are fetched from all chains
    chainInfo: getChainInfoByChainId(SupportedNetworkIds.Base),
    wallet: Wallet.createFrom({
      address: Address.createFromEthereum({ value: address }),
    }),
  })

/**
 * Hook to fetch aggregated rewards for a given wallet address across different chains
 * @param {Object} params - Hook parameters
 * @param {string} [params.walletAddress] - Ethereum wallet address to fetch rewards for
 * @returns {Object} Returns object containing aggregated rewards and loading state
 * @returns {Object} returns.aggregatedRewards - Total rewards and per-chain breakdown
 * @returns {bigint} returns.aggregatedRewards.total - Total rewards across all chains
 * @returns {Object.<number, bigint>} returns.aggregatedRewards.perChain - Rewards broken down by chain ID
 * @returns {Object} returns.claimableAggregatedRewards - Total claimable rewards and per-chain breakdown
 * @returns {bigint} returns.claimableAggregatedRewards.total - Total claimable rewards across all chains
 * @returns {Object.<number, bigint>} returns.claimableAggregatedRewards.perChain - Claimable rewards broken down by chain ID
 * @returns {boolean} returns.isLoading - Loading state of the rewards fetch
 */
export const useUserAggregatedRewards = ({ walletAddress }: { walletAddress?: string }) => {
  const [aggregatedRewards, setAggregatedRewards] = useState<{
    total: bigint
    perChain: { [key: number]: bigint }
  }>()
  const [claimableAggregatedRewards, setClaimableAggregatedRewards] = useState<{
    total: bigint
    perChain: { [key: number]: bigint }
  }>()
  const [isLoading, setIsLoading] = useState(false)
  const sdk = useAppSDK()

  useEffect(() => {
    const fetchAggregatedRewards = async (userAddress: string) => {
      setIsLoading(true)
      const user = getUser(userAddress)

      try {
        const _aggregatedRewards = await sdk.getAggregatedRewards({
          user,
        })

        const _claimableAggregatedRewards = await sdk.getClaimableAggregatedRewards({
          user,
        })

        setAggregatedRewards(_aggregatedRewards)
        setClaimableAggregatedRewards(_claimableAggregatedRewards)

        setIsLoading(false)
      } catch (error) {
        setAggregatedRewards(undefined)
        setIsLoading(false)
        // eslint-disable-next-line no-console
        console.error('Failed to fetch aggregated rewards for given user', error)
      }
    }

    if (walletAddress) {
      fetchAggregatedRewards(walletAddress)
    }
  }, [sdk, walletAddress])

  return { aggregatedRewards, claimableAggregatedRewards, isLoading }
}
