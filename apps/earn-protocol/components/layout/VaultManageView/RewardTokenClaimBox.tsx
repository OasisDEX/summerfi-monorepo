import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  SUCCESS_TOAST_CONFIG,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type RewardTokenPrices, type SupportedNetworkIds } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'

import { delayPerNetwork } from '@/constants/delay-per-network'
import { getMerkleRewardsTag } from '@/helpers/get-cache-handler-name'
import { useClaimVaultMerkleRewardsTransaction } from '@/hooks/use-claim-vault-merkle-rewards-transaction'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRevalidateTags } from '@/hooks/use-revalidate'

const RewardTokenClaimButton = ({
  vaultChainId,
  rewardTokenAddress,
  rewardToken,
  viewWalletAddress,
}: {
  vaultChainId: number
  rewardTokenAddress: string
  rewardToken: string
  viewWalletAddress: string
}) => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { chain } = useEarnProtocolChain()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: sdkNetworkToHumanNetwork(chainIdToSDKNetwork(chain.id)),
  })
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { revalidateTags } = useRevalidateTags()

  const isProperChainSelected = chain.id === vaultChainId
  const isOwner = userWalletAddress?.toLowerCase() === viewWalletAddress.toLowerCase()

  const { claimVaultMerkleRewardsTransaction, error, isLoading } =
    useClaimVaultMerkleRewardsTransaction({
      onSuccess: () => {
        const toastId = toast.success(
          'Rewards claimed successfully, token values can take up to several minutes to update',
          {
            ...SUCCESS_TOAST_CONFIG,
            autoClose: false,
          },
        )

        setTimeout(
          () => {
            setIsClaiming(false)
            if (userWalletAddress) {
              revalidateTags({
                tags: [getMerkleRewardsTag(userWalletAddress)],
              })
            }
            toast.dismiss(toastId)
          },
          delayPerNetwork[chain.id as SupportedNetworkIds],
        )
      },
      onError: () => {
        setIsClaiming(false)
        toast.error('Failed to claim rewards', ERROR_TOAST_CONFIG)
      },
      network: chainIdToSDKNetwork(chain.id),
      publicClient,
      rewardTokenAddress,
    })

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error claiming vault merkle rewards:', error)
    }
  }, [error])

  const handleClaimRewards = async () => {
    setIsClaiming(true)
    try {
      await claimVaultMerkleRewardsTransaction()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error in claimVaultMerkleRewardsTransaction:', err)
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Button
      variant="primarySmall"
      disabled={!isProperChainSelected || isLoading || !isOwner || isClaiming}
      onClick={handleClaimRewards}
    >
      {isClaiming ? `Claiming ${rewardToken}...` : `Claim ${rewardToken}`}
    </Button>
  )
}

export const RewardTokenClaimBox = ({
  vaultChainId,
  rewardTokensClaimableNow,
  rewardTokenPrices,
  viewWalletAddress,
}: {
  vaultChainId: number
  rewardTokensClaimableNow: {
    [tokenSymbol: string]: {
      amount: number
      tokenAddress: string
    }
  }
  viewWalletAddress: string
  rewardTokenPrices: RewardTokenPrices
}) => {
  const hasRewardTokensClaimableNow = Object.keys(rewardTokensClaimableNow).length > 0

  if (!hasRewardTokensClaimableNow) {
    return null
  }

  return (
    <>
      {Object.keys(rewardTokensClaimableNow).map((rewardToken) => {
        const rewardAmount = rewardTokensClaimableNow[rewardToken].amount

        if (rewardAmount <= 0) {
          return null
        }
        const rewardTokenAddress = rewardTokensClaimableNow[rewardToken].tokenAddress
        const rewardAmountUSD = rewardTokenPrices[rewardToken] * rewardAmount

        return (
          <Card
            variant="cardSecondary"
            key={`claimable-reward-${rewardToken}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              variant="p2semi"
              style={{
                marginBottom: '8px',
              }}
            >
              {rewardToken} Rewards
            </Text>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <Text variant="p3semi">
                  {formatCryptoBalance(rewardAmount)}&nbsp;{rewardToken}
                </Text>
                <Text variant="p4">${rewardAmountUSD.toFixed(2)}</Text>
              </div>
              <RewardTokenClaimButton
                rewardToken={rewardToken}
                vaultChainId={vaultChainId}
                rewardTokenAddress={rewardTokenAddress}
                viewWalletAddress={viewWalletAddress}
              />
            </div>
          </Card>
        )
      })}
    </>
  )
}
