import { ChainIds, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { createTestSDK } from './utils/sdkInstance'
import { SharedConfig } from './utils/testConfig'
import { createSendTransactionTool, type SendTransactionTool } from '@summerfi/testing-utils'
import { formatToken } from './utils/stringifiers'

const simulateOnly = true
const signerPrivateKey = SharedConfig.testUserPrivateKey

const scenarios: { userAddress: AddressValue }[] = [
  { userAddress: '0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA' },
  // { userAddress: '0x746bb7beFD31D9052BB8EbA7D5dD74C9aCf54C6d' },
  // { userAddress: '0xE9c245293DAC615c11A5bF26FCec91C3617645E4' },
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
      const rewardsData = await sdk.armada.users.getUserMerklRewards({
        address: userAddress,
        chainIds: [ChainIds.Base],
        rewardsTokensAddresses: [usdcTokenAddress],
      })

      const chainIdsWithRewards = Object.entries(rewardsData.perChain)
        .filter(([_chainId, chainRewards]) => chainRewards && chainRewards.length > 0)
        .map(([chainId]) => parseInt(chainId) as ChainId)

      if (chainIdsWithRewards.length === 0) {
        console.log('No chains with rewards found, skipping test')
        return
      } else {
        console.log(`Chains with rewards: ${chainIdsWithRewards}`)
      }

      const firstChainId = chainIdsWithRewards[0]
      const firstChainRewards = rewardsData.perChain[firstChainId]
      if (!firstChainRewards) {
        console.log('Item is undefined, skipping test')
        return
      }

      console.log(`First chain with rewards: ${JSON.stringify(firstChainRewards, null, 2)}`)

      console.log(
        `Testing referral claim transaction for chain ${firstChainId} and token ${firstChainRewards[0].token.address} with ${formatToken(BigInt(firstChainRewards[0].amount), firstChainRewards[0].token.decimals)} ${firstChainRewards[0].token.symbol}`,
      )

      const claimTransactions = await sdk.armada.users.getReferralFeesMerklClaimTx({
        address: userAddress,
        chainId: firstChainId,
        rewardsTokensAddresses: [firstChainRewards[0].token.address as AddressValue],
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
        `✅ Generated referral claim transaction with specific tokens for chain ${firstChainId}`,
      )

      // try to send tx
      sendTxTool = createSendTransactionTool({
        chainId: firstChainId,
        rpcUrl,
        signerPrivateKey,
        simulateOnly,
      })

      const status = await sendTxTool(claimTx)
      if (!simulateOnly) {
        console.log(`✅ Sent referral claim transaction for chain ${firstChainId}: ${status}`)
      }
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
