import { type SDKManager } from '@summerfi/sdk-client'
import { ChainIds, getChainInfoByChainId, TokenAmount, type ChainId } from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, e2eWalletAddress, testWalletAddress, RpcUrls } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'

jest.setTimeout(300000)
const simulateOnly = true

describe('Armada Protocol - ERC20 Token Transfer', () => {
  const sdk: SDKManager = createTestSDK()

  const testConfigs = [
    {
      chainId: ChainIds.Base,
      rpcUrl: RpcUrls.Base,
      tokenSymbol: 'USDC',
      transferAmount: '1', // 1 USDC
      description: 'Base - USDC transfer',
    },
    {
      chainId: ChainIds.ArbitrumOne,
      rpcUrl: RpcUrls.ArbitrumOne,
      tokenSymbol: 'USD₮0',
      transferAmount: '0.5', // 0.5 USDT
      description: 'Arbitrum - USDT transfer',
    },
  ]

  for (const config of testConfigs) {
    describe(config.description, () => {
      const { chainId, rpcUrl, tokenSymbol, transferAmount } = config

      const chainInfo = getChainInfoByChainId(chainId)

      it('should generate ERC20 transfer transaction', async () => {
        // Arrange: Get token information
        const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol: tokenSymbol })

        // Arrange: Define recipient (using test wallet for e2e)
        const recipient = e2eWalletAddress

        // Arrange: Create transfer amount
        const amount = TokenAmount.createFrom({
          amount: transferAmount,
          token,
        })

        console.log(`\nTransfer Details:`)
        console.log(`  Chain: ${chainInfo.name}`)
        console.log(`  Token: ${token.symbol}`)
        console.log(`  Amount: ${amount.toString()}`)
        console.log(`  To: ${recipient.value}`)

        // Act: Generate transfer transaction
        const transactions = await sdk.armada.users.getErc20TokenTransferTx({
          chainId,
          tokenAddress: token.address,
          recipientAddress: recipient,
          amount,
        })

        // Assert: Validate transaction structure
        expect(transactions).toBeDefined()
        expect(Array.isArray(transactions)).toBe(true)
        expect(transactions.length).toBeGreaterThan(0)

        const tx = transactions[0]
        expect(tx).toBeDefined()
        expect(tx.type).toBe('Erc20Transfer')
        expect(tx.description).toContain('Transfer')
        expect(tx.description).toContain(token.symbol)
        expect(tx.description).toContain(recipient.value)
        expect(tx.transaction).toBeDefined()
        expect(tx.transaction.target).toBeDefined()
        expect(tx.transaction.calldata).toBeDefined()
        expect(tx.transaction.value).toBe('0')

        // Assert: Validate metadata
        expect(tx.metadata).toBeDefined()
        expect(tx.metadata.token.toSolidityValue()).toStrictEqual(token.address.toSolidityValue())
        expect(tx.metadata.recipient.toSolidityValue()).toStrictEqual(recipient.toSolidityValue())
        expect(tx.metadata.amount.toSolidityValue()).toStrictEqual(amount.toSolidityValue())

        console.log(`\nTransaction Generated:`)
        console.log(`  Type: ${tx.type}`)
        console.log(`  Description: ${tx.description}`)
        console.log(`  Target: ${tx.transaction.target.value}`)
        console.log(`  Calldata length: ${tx.transaction.calldata.length}`)
      })

      it('should execute ERC20 transfer transaction (simulate only)', async () => {
        // Arrange: Get token and create transfer amount
        const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol: tokenSymbol })
        const recipient = e2eWalletAddress
        const amount = TokenAmount.createFrom({
          amount: transferAmount,
          token,
        })

        // Act: Generate and simulate transaction
        const transactions = await sdk.armada.users.getErc20TokenTransferTx({
          chainId,
          tokenAddress: token.address,
          recipientAddress: recipient,
          amount,
        })

        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl: rpcUrl,
          privateKey: signerPrivateKey,
          simulateOnly,
        })

        // Assert: Validate simulation results
        expect(statuses.length).toBe(transactions.length)
        statuses.forEach((status, index) => {
          console.log(`  Transaction ${index + 1} status: ${status}`)
          expect(status).toBe('success')
        })
      })

      it('should handle small transfer amounts', async () => {
        // Arrange: Use minimal transfer amount (0.01 tokens)
        const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol: tokenSymbol })
        const recipient = testWalletAddress
        const smallAmount = TokenAmount.createFrom({
          amount: '0.01',
          token,
        })

        // Act: Generate transfer transaction
        const transactions = await sdk.armada.users.getErc20TokenTransferTx({
          chainId,
          tokenAddress: token.address,
          recipientAddress: recipient,
          amount: smallAmount,
        })

        // Assert: Should successfully generate transaction for small amounts
        expect(transactions).toBeDefined()
        expect(transactions.length).toBeGreaterThan(0)
        expect(transactions[0].type).toBe('Erc20Transfer')
        expect(transactions[0].metadata.amount.toSolidityValue()).toStrictEqual(
          smallAmount.toSolidityValue(),
        )
      })

      it('should handle large transfer amounts', async () => {
        // Arrange: Use larger transfer amount (1000 tokens)
        const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol: tokenSymbol })
        const recipient = testWalletAddress
        const largeAmount = TokenAmount.createFrom({
          amount: '1000',
          token,
        })

        // Act: Generate transfer transaction
        const transactions = await sdk.armada.users.getErc20TokenTransferTx({
          chainId,
          tokenAddress: token.address,
          recipientAddress: recipient,
          amount: largeAmount,
        })

        // Assert: Should successfully generate transaction for large amounts
        expect(transactions).toBeDefined()
        expect(transactions.length).toBeGreaterThan(0)
        expect(transactions[0].type).toBe('Erc20Transfer')
        expect(transactions[0].metadata.amount.toSolidityValue()).toEqual(
          largeAmount.toSolidityValue(),
        )
      })
    })
  }

  describe('Error Handling', () => {
    it('should handle invalid chain ID', async () => {
      const token = await sdk.tokens.getTokenBySymbol({
        chainId: ChainIds.Base,
        symbol: 'USDC',
      })
      const recipient = e2eWalletAddress
      const amount = TokenAmount.createFrom({
        amount: '1',
        token,
      })

      // Act & Assert: Should throw error for invalid chain ID
      await expect(
        sdk.armada.users.getErc20TokenTransferTx({
          chainId: 999999 as ChainId, // Invalid chain ID
          tokenAddress: token.address,
          recipientAddress: recipient,
          amount,
        }),
      ).rejects.toThrow()
    })
  })

  describe('Real User Flow Simulation', () => {
    it('should simulate complete user transfer flow', async () => {
      const chainId = ChainIds.Base
      const rpcUrl = RpcUrls.Base

      if (!rpcUrl) {
        console.warn('Skipping real user flow test - missing RPC URL')
        return
      }

      const chainInfo = getChainInfoByChainId(chainId)

      // Step 1: User checks their token balance (simulated)
      console.log('\n=== Step 1: User checks available tokens ===')
      const token = await sdk.tokens.getTokenBySymbol({
        chainId,
        symbol: 'USDC',
      })
      console.log(`  Found token: ${token.symbol} at ${token.address.value}`)

      // Step 2: User specifies transfer details
      console.log('\n=== Step 2: User specifies transfer details ===')
      const recipient = testWalletAddress
      const amount = TokenAmount.createFrom({
        amount: '5',
        token,
      })
      console.log(`  Transfer ${amount.toString()} to ${recipient.value}`)

      // Step 3: Generate transfer transaction
      console.log('\n=== Step 3: Generate transfer transaction ===')
      const transactions = await sdk.armada.users.getErc20TokenTransferTx({
        chainId,
        tokenAddress: token.address,
        recipientAddress: recipient,
        amount,
      })
      console.log(`  Generated ${transactions.length} transaction(s)`)
      console.log(`  Description: ${transactions[0].description}`)

      // Step 4: User reviews and confirms transaction (simulated)
      console.log('\n=== Step 4: User reviews transaction ===')
      console.log(`  Type: ${transactions[0].type}`)
      console.log(`  Target contract: ${transactions[0].transaction.target.value}`)
      console.log(`  Gas value: ${transactions[0].transaction.value}`)

      // Step 5: Execute transaction (simulate only)
      console.log('\n=== Step 5: Execute transaction (simulated) ===')
      const { statuses } = await sendAndLogTransactions({
        chainInfo,
        transactions,
        rpcUrl: rpcUrl,
        privateKey: signerPrivateKey,
        simulateOnly,
      })

      // Step 6: Verify success
      console.log('\n=== Step 6: Verify transaction success ===')
      expect(statuses[0]).toBe('success')
      console.log(`  ✅ Transfer simulation successful!`)
      console.log(`  Recipient would receive ${amount.toString()}`)
    })
  })
})
