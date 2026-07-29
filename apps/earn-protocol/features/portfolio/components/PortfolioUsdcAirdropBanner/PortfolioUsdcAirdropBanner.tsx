'use client'
import { type FC, useState } from 'react'
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
import { SupportedNetworkIds } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import { useQueryClient } from '@tanstack/react-query'

import { delayPerNetwork } from '@/constants/delay-per-network'
import { type UsdcAirdropClaimable } from '@/features/portfolio/types'
import { getMerkleRewardsTag } from '@/helpers/get-cache-handler-name'
import { useClaimVaultMerkleRewardsTransaction } from '@/hooks/use-claim-vault-merkle-rewards-transaction'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRevalidateTags } from '@/hooks/use-revalidate'

const airdropNetwork = chainIdToSDKNetwork(SupportedNetworkIds.Mainnet)

export const PortfolioUsdcAirdropBanner: FC<{
  usdcAirdrop: UsdcAirdropClaimable
}> = ({ usdcAirdrop }) => {
  const [isClaiming, setIsClaiming] = useState(false)
  const queryClient = useQueryClient()
  const { chain, setChain, isSettingChain } = useEarnProtocolChain()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: sdkNetworkToHumanNetwork(airdropNetwork),
  })
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { revalidateTags } = useRevalidateTags()

  const isProperChainSelected = chain.id === SupportedNetworkIds.Mainnet
  const isClaimable = usdcAirdrop.claimableNow > 0
  const displayAmount = usdcAirdrop.claimableNow + usdcAirdrop.pendingNow
  const displayUsdValue = usdcAirdrop.usdValue + usdcAirdrop.pendingUsdValue

  const { claimVaultMerkleRewardsTransaction, isLoading } = useClaimVaultMerkleRewardsTransaction({
    onSuccess: () => {
      const toastId = toast.success(
        'USDC claimed successfully, token values can take up to several minutes to update',
        {
          ...SUCCESS_TOAST_CONFIG,
          autoClose: false,
        },
      )

      setTimeout(() => {
        setIsClaiming(false)
        if (userWalletAddress) {
          revalidateTags({
            tags: [getMerkleRewardsTag(userWalletAddress)],
          })
        }
        void queryClient.invalidateQueries({ queryKey: ['portfolio-rewards-data'] })
        toast.dismiss(toastId)
      }, delayPerNetwork[SupportedNetworkIds.Mainnet])
    },
    onError: () => {
      setIsClaiming(false)
      toast.error('Failed to claim USDC', ERROR_TOAST_CONFIG)
    },
    network: airdropNetwork,
    publicClient,
    rewardTokenAddress: usdcAirdrop.tokenAddress,
  })

  const handleClaim = async () => {
    setIsClaiming(true)
    try {
      await claimVaultMerkleRewardsTransaction()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error claiming USDC airdrop merkle rewards:', err)
      setIsClaiming(false)
    }
  }

  return (
    <Card
      variant="cardSecondary"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--general-space-16)',
        marginBottom: 'var(--general-space-24)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '60%' }}>
        <Text variant="p2semi">Ethereum USDC Vaults - Claim remaining USDC</Text>
        <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
          You have USDC from the Lower Risk and/or Higher Risk USDC Vault on Ethereum to claim after
          the recent exploit. This claim is made through Merkl.xyz contracts.
        </Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-16)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
          <Text variant="p2semi">{formatCryptoBalance(displayAmount)}&nbsp;USDC</Text>
          <Text variant="p4">${displayUsdValue.toFixed(2)}</Text>
        </div>
        {isProperChainSelected || !isClaimable ? (
          <Button
            variant="primarySmall"
            disabled={!isClaimable || isLoading || isClaiming}
            onClick={handleClaim}
          >
            {isClaiming ? 'Claiming USDC...' : 'Claim USDC'}
          </Button>
        ) : (
          <Button
            variant="secondarySmall"
            disabled={isSettingChain}
            onClick={() => void setChain({ chain: SupportedNetworkIds.Mainnet })}
          >
            Switch to Ethereum
          </Button>
        )}
      </div>
    </Card>
  )
}
