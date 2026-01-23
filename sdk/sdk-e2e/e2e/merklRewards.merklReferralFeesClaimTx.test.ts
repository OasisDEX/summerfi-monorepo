import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig } from './utils/testConfig'
import { createSendTransactionTool, type SendTransactionTool } from '@summerfi/testing-utils'

const signerPrivateKey = SharedConfig.userPrivateKey

const scenarios: { userAddress: AddressValue }[] = [
  { userAddress: '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d' },
]

describe('Merkl Rewards - getReferralFeesMerklClaimTx', () => {
  const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
  if (!rpcUrl) {
    throw new Error('E2E_SDK_FORK_URL_BASE environment variable not set')
  }

  const sdk = createTestSDK()

  let sendTxTool: SendTransactionTool

  describe.each(scenarios)('user address $userAddress', (scenario) => {
    const { userAddress } = scenario

    it('should generate referral claim transaction with specific token addresses', async () => {
      const usdcToken = await sdk.tokens.getTokenBySymbol({
        symbol: 'USDC',
        chainId: ChainIds.Base,
      })
      const usdcTokenAddress = usdcToken.address.value

      // First get rewards to find chains with rewards and get token addresses
      const rewards = await sdk.armada.users.getUserMerklRewards({
        address: userAddress,
        chainIds: [ChainIds.Base],
        rewardsTokensAddresses: [usdcTokenAddress],
      })

      const chainsWithRewards = Object.entries(rewards.perChain)
        .filter(([_, chainRewards]) => chainRewards && chainRewards.length > 0)
        .map(([chainId]) => parseInt(chainId) as ChainId)

      if (chainsWithRewards.length === 0) {
        console.log('No chains with rewards found, skipping token-specific test')
        return
      }

      const testChainId = chainsWithRewards[0]
      const chainRewards = rewards.perChain[testChainId]
      if (!chainRewards || chainRewards.length === 0) {
        console.log('No rewards found on test chain, skipping token-specific test')
        return
      }

      console.log(
        `Testing referral claim transaction for chain ${testChainId} and token ${chainRewards[0].token.address} with ${chainRewards[0].amount} ${chainRewards[0].token.symbol}`,
      )

      const claimTransactions = await sdk.armada.users.getReferralFeesMerklClaimTx({
        address: userAddress,
        chainId: testChainId,
        rewardsTokensAddresses: [chainRewards[0].token.address as AddressValue],
      })

      if (!claimTransactions) {
        console.log(`No referral claim transactions generated with specific tokens`)
        return
      }

      expect(claimTransactions).toBeDefined()
      expect(Array.isArray(claimTransactions)).toBe(true)
      expect(claimTransactions.length).toBe(1)

      const claimTx = claimTransactions[0]
      expect(claimTx.type).toBe('MerklClaim')
      expect(claimTx.description).toContain('Claiming Merkl rewards')
      expect(claimTx.transaction).toBeDefined()
      expect(claimTx.transaction.target).toBeDefined()
      expect(claimTx.transaction.calldata).toBeDefined()
      expect(claimTx.transaction.value).toBe('0')

      console.log(
        `✅ Generated referral claim transaction with specific tokens for chain ${testChainId}`,
      )

      // try to send tx
      sendTxTool = createSendTransactionTool({
        chainId: testChainId,
        rpcUrl,
        signerPrivateKey,
      })

      const status = await sendTxTool(claimTx)
      console.log(`✅ Sent referral claim transaction for chain ${testChainId}: ${status}`)
    })

    it('should throw error for unsupported chain', async () => {
      const unsupportedChainId = 999999 as ChainId

      await expect(
        sdk.armada.users.getReferralFeesMerklClaimTx({
          address: userAddress,
          chainId: unsupportedChainId,
        }),
      ).rejects.toThrow()
    })
  })
})
