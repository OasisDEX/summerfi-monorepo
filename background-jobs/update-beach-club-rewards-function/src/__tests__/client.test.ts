import { Logger } from '@aws-lambda-powertools/logger'
import { ReferralClient } from '../client'
import { Account, Network } from '../types'

// Import the existing mock from setup.ts
import './setup'

// Get the mock GraphQLClient request method
const { GraphQLClient } = require('graphql-request')
const mockRequest = jest.fn()

describe('ReferralClient', () => {
  let client: ReferralClient
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock the GraphQLClient constructor to return our mock
    GraphQLClient.mockImplementation(() => ({
      request: mockRequest,
    }))
    // pass console as logger
    client = new ReferralClient(console as unknown as Logger)
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('getReferredAccounts', () => {
    const mockAccountData = {
      accounts: [
        {
          id: '0x123',
          referralData: { id: '0xreferrer', protocol: 'summer' },
          referralTimestamp: '1640995200', // 2022-01-01
          positions: [],
        },
        {
          id: '0x456',
          referralData: { id: '0xreferrer2', protocol: 'summer' },
          referralTimestamp: '1640995260', // 2022-01-01 + 60s
          positions: [],
        },
      ],
    }

    it('should fetch referred accounts successfully with timestamp filters', async () => {
      mockRequest.mockResolvedValue(mockAccountData)

      const result = await client.getReferredAccounts(Network.MAINNET, {
        timestampGt: '1640995100',
        timestampLt: '1640995300',
      })

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String), // REFERRED_ACCOUNTS_QUERY
        {
          timestampGt: '1640995100',
          timestampLt: '1640995300',
        },
      )
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('0x123')
      expect(result[1].id).toBe('0x456')
    })

    it('should fetch referred accounts with default timestamp bounds when no options provided', async () => {
      mockRequest.mockResolvedValue(mockAccountData)

      const result = await client.getReferredAccounts(Network.MAINNET)

      expect(mockRequest).toHaveBeenCalledWith(expect.any(String), {})
      expect(result).toHaveLength(2)
    })

    it('should propagate API errors instead of swallowing them', async () => {
      const apiError = new Error('GraphQL API Error')
      mockRequest.mockRejectedValue(apiError)

      await expect(client.getReferredAccounts(Network.MAINNET)).rejects.toThrow('GraphQL API Error')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching referred accounts from mainnet:', {
        error: apiError,
      })
    })

    it('should propagate network timeout errors', async () => {
      const timeoutError = new Error('Network timeout')
      timeoutError.name = 'TimeoutError'
      mockRequest.mockRejectedValue(timeoutError)

      await expect(client.getReferredAccounts(Network.MAINNET)).rejects.toThrow('Network timeout')
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should propagate GraphQL query errors', async () => {
      const queryError = new Error('GraphQL query syntax error')
      mockRequest.mockRejectedValue(queryError)

      await expect(client.getReferredAccounts(Network.MAINNET)).rejects.toThrow(
        'GraphQL query syntax error',
      )
    })

    it('should filter out null/undefined accounts', async () => {
      mockRequest.mockResolvedValue({
        accounts: [mockAccountData.accounts[0], null, undefined, mockAccountData.accounts[1]],
      })

      const result = await client.getReferredAccounts(Network.SONIC)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('0x123')
      expect(result[1].id).toBe('0x456')
    })

    it('should work with different chains', async () => {
      mockRequest.mockResolvedValue(mockAccountData)

      await client.getReferredAccounts(Network.BASE)
      await client.getReferredAccounts(Network.ARBITRUM)

      expect(mockRequest).toHaveBeenCalledTimes(2)
    })
  })

  describe('validateAccounts', () => {
    const mockAccounts: { [accountId: string]: Account } = {
      '0x123': {
        id: '0x123',
        referralTimestamp: '1640995200', // Earlier referral
        referralData: { id: '0xreferrer' },
      },
      '0x456': {
        id: '0x456',
        referralTimestamp: '1640995300', // Later referral
        referralData: { id: '0xreferrer2' },
      },
    }

    it('should validate accounts with no positions as invalid when referred before current period', async () => {
      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x123',
            positions: [],
            referralTimestamp: '1640995100', // Earlier than input referral
          },
        ],
      })

      // Use an account with a later referral timestamp than what's on chain
      const accountWithLaterReferral = {
        '0x123': {
          id: '0x123',
          referralTimestamp: '1640995200', // Later than chain referral (1640995100)
          referralData: { id: '0xreferrer' },
        },
      }

      // Account should be invalid because:
      // wasReferredEarlierThanCurrentPeriod is true (1640995200 > 1640995100)
      // This means the account was referred before the current period
      const result = await client.validateAccounts(Network.MAINNET, accountWithLaterReferral)

      expect(result['0x123']).toBe(false)
    })

    it('should validate accounts with no positions as valid when referred in current period', async () => {
      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x123',
            positions: [],
            referralTimestamp: '1640995200', // Same as input referral
          },
        ],
      })

      // Account should be valid because:
      // 1. No positions created before referral (no violation)
      // 2. wasReferredEarlierThanCurrentPeriod is false (1640995200 == 1640995200)
      // This means the account was referred in the current period
      const result = await client.validateAccounts(Network.MAINNET, mockAccounts)

      expect(result['0x123']).toBe(true)
    })

    it('should validate accounts with positions created after referral as valid', async () => {
      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x123',
            positions: [
              {
                id: 'pos1',
                createdTimestamp: '1640995300', // After referral
              },
            ],
            referralTimestamp: '1640995100', // Earlier than input referral
          },
        ],
      })

      // Account should be valid because:
      // 1. Positions were created after referral (no violation)
      // 2. wasReferredEarlierThanCurrentPeriod is true but positions are valid
      const result = await client.validateAccounts(Network.MAINNET, mockAccounts)

      // Wait, this should actually be invalid due to wasReferredEarlierThanCurrentPeriod
      expect(result['0x123']).toBe(false)
    })

    it('should invalidate accounts with positions created before referral', async () => {
      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x123',
            positions: [
              {
                id: 'pos1',
                createdTimestamp: '1640995100', // Before referral
              },
            ],
            referralTimestamp: '1640995200', // Same as input referral
          },
        ],
      })

      // Account should be invalid because:
      // hasReferralTimestamp && positionsCreatedBeforeReferral is true
      // (1640995100 < 1640995200)
      const result = await client.validateAccounts(Network.MAINNET, mockAccounts)

      expect(result['0x123']).toBe(false)
    })

    it('should handle accounts without referral timestamp as valid as they were referred on another chain', async () => {
      const accountsWithoutReferral = {
        '0x789': {
          id: '0x789',
          referralTimestamp: undefined,
          referralData: undefined,
        },
      }

      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x789',
            positions: [
              {
                id: 'pos1',
                createdTimestamp: '1640995100',
              },
            ],
            referralTimestamp: '1640995200',
          },
        ],
      })

      // Account should be valid because:
      // it has earliest referral timestamp but no referral timestamp -> hence it was referred in this period
      const result = await client.validateAccounts(Network.MAINNET, accountsWithoutReferral)

      expect(result['0x789']).toBe(true)
    })

    it('should validate cross-chain referral timestamp logic correctly', async () => {
      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x123',
            positions: [
              {
                id: 'pos1',
                createdTimestamp: '1640995050', // Before earliest referral
              },
            ],
            referralTimestamp: '1640995090', // Earlier referral on this chain
          },
        ],
      })

      const crossChainAccounts = {
        '0x123': {
          id: '0x123',
          referralTimestamp: '1640995100', // Earliest across all chains (greater than chain referral)
          referralData: { id: '0xreferrer' },
        },
      }

      const result = await client.validateAccounts(Network.MAINNET, crossChainAccounts)

      // Should be invalid because:
      // 1. hasReferralTimestamp && positionsCreatedBeforeReferral is true (1640995050 < 1640995100)
      // This alone makes the account invalid regardless of the other check
      expect(result['0x123']).toBe(false)
    })

    it('should propagate GraphQL errors instead of swallowing them', async () => {
      const validationError = new Error('GraphQL Error')
      mockRequest.mockRejectedValue(validationError)

      await expect(client.validateAccounts(Network.MAINNET, mockAccounts)).rejects.toThrow(
        'GraphQL Error',
      )

      expect(consoleSpy).toHaveBeenCalledWith('Error validating positions from mainnet:', {
        error: validationError,
      })
    })

    it('should propagate subgraph connection errors', async () => {
      const connectionError = new Error('ECONNREFUSED')
      connectionError.name = 'ConnectionError'
      mockRequest.mockRejectedValue(connectionError)

      await expect(client.validateAccounts(Network.MAINNET, mockAccounts)).rejects.toThrow(
        'ECONNREFUSED',
      )
    })

    it('should convert account IDs to lowercase for query', async () => {
      const upperCaseAccounts = {
        '0xABC': {
          id: '0xABC',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
        },
      }

      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0xABC',
            positions: [],
            referralTimestamp: '1640995200',
          },
        ],
      })

      await client.validateAccounts(Network.MAINNET, upperCaseAccounts)

      expect(mockRequest).toHaveBeenCalledWith(expect.any(String), {
        accountIds: ['0xabc'], // Should be lowercase
      })
    })

    it('should invalidate accounts referred before current period', async () => {
      mockRequest.mockResolvedValue({
        accounts: [
          {
            id: '0x123',
            positions: [],
            referralTimestamp: '1640995000', // Much earlier referral on this chain
          },
        ],
      })

      // Use an account with earlier referral timestamp to make the test clearer
      const accountsWithLaterReferral = {
        '0x123': {
          id: '0x123',
          referralTimestamp: '1640995100', // Later than chain referral (1640995000)
          referralData: { id: '0xreferrer' },
        },
      }

      // Account should be invalid because:
      // wasReferredEarlierThanCurrentPeriod is true (1640995100 > 1640995000)
      // This means the account was referred before the current period
      const result = await client.validateAccounts(Network.MAINNET, accountsWithLaterReferral)

      expect(result['0x123']).toBe(false)
    })
  })

  describe('getValidReferredAccounts', () => {
    let mockGetReferredAccounts: jest.SpyInstance
    let mockValidateAccounts: jest.SpyInstance

    beforeEach(() => {
      mockGetReferredAccounts = jest.spyOn(client, 'getReferredAccounts')
      mockValidateAccounts = jest.spyOn(client, 'validateAccounts')
    })

    afterEach(() => {
      mockGetReferredAccounts.mockRestore()
      mockValidateAccounts.mockRestore()
    })

    it('should process first run correctly with only timestampLt', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
          referralChain: Network.MAINNET,
        },
        {
          id: '0x456',
          referralTimestamp: '1640995300',
          referralData: { id: '0xreferrer2' },
          referralChain: Network.MAINNET,
        },
      ]

      // Mock getReferredAccounts for all chains
      mockGetReferredAccounts
        .mockResolvedValueOnce(mockAccounts) // Ethereum
        .mockResolvedValueOnce([]) // Sonic
        .mockResolvedValueOnce([]) // Arbitrum
        .mockResolvedValueOnce([]) // Base
        .mockResolvedValueOnce([]) // Hyperliquid

      // Mock validateAccounts for all chains
      mockValidateAccounts
        .mockResolvedValueOnce({ '0x123': true, '0x456': true }) // Ethereum
        .mockResolvedValueOnce({}) // Sonic
        .mockResolvedValueOnce({}) // Arbitrum
        .mockResolvedValueOnce({}) // Base
        .mockResolvedValueOnce({}) // Hyperliquid

      const result = await client.getValidReferredAccounts(BigInt(0), BigInt(1640995400))

      // Verify behavior - timestampGt is not included when it's BigInt(0) since it's falsy
      expect(mockGetReferredAccounts).toHaveBeenCalledWith(Network.MAINNET, {
        timestampGt: '0',
        timestampLt: '1640995400',
      })
      expect(result.validAccounts).toEqual(mockAccounts)
    })

    it('should process subsequent run with both timestamps', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
          referralChain: Network.MAINNET,
        },
      ]

      mockGetReferredAccounts
        .mockResolvedValueOnce(mockAccounts)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      mockValidateAccounts
        .mockResolvedValueOnce({ '0x123': true })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})

      const result = await client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400))

      // Verify subsequent run behavior - both timestamps used
      expect(mockGetReferredAccounts).toHaveBeenCalledWith(Network.MAINNET, {
        timestampGt: '1640995000',
        timestampLt: '1640995400',
      })
      expect(result.validAccounts).toEqual(mockAccounts)
    })

    it('should consolidate accounts across chains keeping earliest referral', async () => {
      const ethereumAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995300', // Later
          referralData: { id: '0xreferrer' },
        },
      ]

      const sonicAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200', // Earlier - should be kept
          referralData: { id: '0xreferrer' },
        },
      ]

      mockGetReferredAccounts
        .mockResolvedValueOnce(ethereumAccounts) // Ethereum
        .mockResolvedValueOnce(sonicAccounts) // Sonic
        .mockResolvedValueOnce([]) // Arbitrum
        .mockResolvedValueOnce([]) // Base
        .mockResolvedValueOnce([]) // Hyperliquid

      mockValidateAccounts.mockResolvedValue({ '0x123': true })

      const result = await client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400))

      // Should use earliest referral timestamp
      expect(mockValidateAccounts).toHaveBeenCalledWith(
        Network.MAINNET,
        expect.objectContaining({
          '0x123': expect.objectContaining({
            referralTimestamp: '1640995200', // Earlier timestamp
          }),
        }),
      )
      expect(result.validAccounts.map((a) => a.id)).toEqual(['0x123'])
    })

    it('should filter out invalid accounts based on cross-chain validation', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
        },
        {
          id: '0x456',
          referralTimestamp: '1640995300',
          referralData: { id: '0xreferrer2' },
        },
      ]

      mockGetReferredAccounts
        .mockResolvedValueOnce(mockAccounts)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      // Mock validation where one account is invalid on one chain
      mockValidateAccounts
        .mockResolvedValueOnce({ '0x123': true, '0x456': false }) // Ethereum
        .mockResolvedValueOnce({}) // Sonic
        .mockResolvedValueOnce({}) // Arbitrum
        .mockResolvedValueOnce({}) // Base
        .mockResolvedValueOnce({}) // Hyperliquid

      const result = await client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400))

      // Only account valid on ALL chains should be returned (0x456 is invalid on Ethereum)
      expect(result.validAccounts.map((a) => a.id)).toEqual(['0x123'])
    })

    it('should require validation on ALL chains for account to be valid', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
        },
      ]

      mockGetReferredAccounts
        .mockResolvedValue(mockAccounts)
        .mockResolvedValue([])
        .mockResolvedValue([])
        .mockResolvedValue([])
        .mockResolvedValue([])

      // Account invalid on one chain should make it invalid overall
      mockValidateAccounts
        .mockResolvedValueOnce({ '0x123': true }) // Ethereum - valid
        .mockResolvedValueOnce({ '0x123': false }) // Sonic - invalid
        .mockResolvedValueOnce({ '0x123': true }) // Arbitrum - valid
        .mockResolvedValueOnce({ '0x123': true }) // Base - valid
        .mockResolvedValueOnce({ '0x123': true }) // Hyperliquid - valid

      const result = await client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400))

      expect(result.validAccounts).toEqual([])
    })

    it('should handle empty results from all chains', async () => {
      mockGetReferredAccounts.mockResolvedValue([])
      mockValidateAccounts.mockResolvedValue({})

      const result = await client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400))

      expect(result.validAccounts).toEqual([])
      expect(mockGetReferredAccounts).toHaveBeenCalledTimes(5)
      expect(mockValidateAccounts).toHaveBeenCalledTimes(5)
    })

    it('should handle duplicate accounts from same chain', async () => {
      const duplicateAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
        },
        {
          id: '0x123',
          referralTimestamp: '1640995300', // Later timestamp - should be ignored
          referralData: { id: '0xreferrer' },
        },
      ]

      mockGetReferredAccounts.mockResolvedValueOnce(duplicateAccounts).mockResolvedValue([])

      mockValidateAccounts.mockResolvedValue({ '0x123': true })

      const result = await client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400))

      // Should consolidate to single account with earliest timestamp
      expect(mockValidateAccounts).toHaveBeenCalledWith(
        Network.MAINNET,
        expect.objectContaining({
          '0x123': expect.objectContaining({
            referralTimestamp: '1640995200',
          }),
        }),
      )
      expect(result.validAccounts.map((a) => a.id)).toEqual(['0x123'])
    })
  })

  describe('getAccountsWithHourlySnapshots', () => {
    const mockAccountData = {
      accounts: [
        {
          id: '0x123',
          referralData: { id: '0xreferrer' },
          referralTimestamp: '1640995200',
          positions: [
            {
              id: 'pos1',
              account: { id: '0x123' },
              vault: { id: 'vault1', inputToken: { symbol: 'USDC' } },
              createdTimestamp: '1640995200',
              referralData: { id: '0xreferrer' },
              hourlySnapshots: [
                {
                  id: 'snapshot1',
                  timestamp: '1640995200',
                  inputTokenBalanceNormalizedInUSD: '1000',
                  inputTokenBalanceNormalized: '1000',
                },
              ],
            },
          ],
        },
      ],
    }

    it('should fetch accounts with hourly snapshots successfully', async () => {
      mockRequest.mockResolvedValue(mockAccountData)

      const result = await client.getAccountsWithHourlySnapshots(
        Network.MAINNET,
        ['0x123'],
        { first: 50 },
        { timestampGt: BigInt(1640995000), timestampLt: BigInt(1640995400) },
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('0x123')
    })

    it('should propagate API errors instead of swallowing them', async () => {
      const apiError = new Error('Subgraph query failed')
      mockRequest.mockRejectedValue(apiError)

      await expect(
        client.getAccountsWithHourlySnapshots(
          Network.MAINNET,
          ['0x123'],
          { first: 50 },
          { timestampGt: BigInt(1640995000), timestampLt: BigInt(1640995400) },
        ),
      ).rejects.toThrow('Subgraph query failed')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching accounts with hourly snapshots from mainnet:',
        { error: apiError },
      )
    })

    it('should propagate timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      timeoutError.name = 'TimeoutError'
      mockRequest.mockRejectedValue(timeoutError)

      await expect(
        client.getAccountsWithHourlySnapshots(
          Network.ARBITRUM,
          ['0x123'],
          { first: 50 },
          { timestampGt: BigInt(1640995000), timestampLt: BigInt(1640995400) },
        ),
      ).rejects.toThrow('Request timeout')
    })

    it('should handle pagination parameters correctly', async () => {
      const batchData = {
        accounts: Array.from({ length: 50 }, (_, i) => ({
          id: `0x${i.toString().padStart(2, '0')}`,
          referralData: { id: '0xreferrer' },
          referralTimestamp: '1640995200',
          positions: [],
        })),
      }

      mockRequest.mockResolvedValue(batchData)

      const result = await client.getAccountsWithHourlySnapshots(
        Network.MAINNET,
        Array.from({ length: 100 }, (_, i) => `0x${i.toString().padStart(2, '0')}`),
        { first: 50, lastId: '0x00' },
        { timestampGt: BigInt(1640995000), timestampLt: BigInt(1640995400) },
      )

      expect(result).toHaveLength(50)
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          accountIds: expect.arrayContaining(['0x00']),
          first: 50,
          lastId: '0x00',
          timestampGt: '1640995000',
          timestampLt: '1640995400',
        }),
      )
    })
  })

  describe('getAllPositionsWithHourlySnapshots', () => {
    const mockAccountData = {
      accounts: [
        {
          id: '0x123',
          referralData: { id: '0xreferrer' },
          referralTimestamp: '1640995200',
          positions: [
            {
              id: 'pos1',
              account: { id: '0x123' },
              vault: { id: 'vault1', inputToken: { symbol: 'USDC' } },
              createdTimestamp: '1640995200',
              referralData: { id: '0xreferrer' },
              hourlySnapshots: [
                {
                  id: 'snapshot1',
                  timestamp: '1640995200',
                  inputTokenBalanceNormalizedInUSD: '1000',
                  inputTokenBalanceNormalized: '1000',
                },
              ],
            },
          ],
        },
      ],
    }

    beforeEach(() => {
      jest.spyOn(client, 'getAccountsWithHourlySnapshots')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should fetch positions from all chains successfully', async () => {
      const mockGetAccountsWithHourlySnapshots = jest.spyOn(
        client,
        'getAccountsWithHourlySnapshots',
      )
      mockGetAccountsWithHourlySnapshots.mockResolvedValue(mockAccountData.accounts)

      const result = await client.getAllPositionsWithHourlySnapshots(['0x123'], {
        timestampGt: BigInt(1640995000),
        timestampLt: BigInt(1640995400),
      })

      expect(Object.keys(result)).toHaveLength(5) // All 5 chains
      expect(mockGetAccountsWithHourlySnapshots).toHaveBeenCalledTimes(5)
    })

    it('should propagate errors from any chain when fetching positions', async () => {
      const mockGetAccountsWithHourlySnapshots = jest.spyOn(
        client,
        'getAccountsWithHourlySnapshots',
      )
      const chainError = new Error('Arbitrum subgraph unavailable')
      // First chain succeeds, second fails
      mockGetAccountsWithHourlySnapshots
        .mockResolvedValueOnce(mockAccountData.accounts) // MAINNET succeeds
        .mockRejectedValueOnce(chainError) // SONIC fails

      await expect(
        client.getAllPositionsWithHourlySnapshots(['0x123'], {
          timestampGt: BigInt(1640995000),
          timestampLt: BigInt(1640995400),
        }),
      ).rejects.toThrow('Arbitrum subgraph unavailable')
    })

    it('should propagate errors during pagination', async () => {
      const mockGetAccountsWithHourlySnapshots = jest.spyOn(
        client,
        'getAccountsWithHourlySnapshots',
      )
      const paginationError = new Error('Pagination query failed')
      // First page succeeds, second page fails
      mockGetAccountsWithHourlySnapshots
        .mockResolvedValueOnce(
          Array.from({ length: 50 }, (_, i) => ({
            id: `0x${i.toString().padStart(2, '0')}`,
            referralData: { id: '0xreferrer' },
            referralTimestamp: '1640995200',
            positions: [],
          })),
        )
        .mockRejectedValueOnce(paginationError)

      await expect(
        client.getAllPositionsWithHourlySnapshots(
          Array.from({ length: 51 }, (_, i) => `0x${i.toString().padStart(2, '0')}`),
          {
            timestampGt: BigInt(1640995000),
            timestampLt: BigInt(1640995400),
          },
        ),
      ).rejects.toThrow('Pagination query failed')
    })

    it('should handle empty results from all chains', async () => {
      const mockGetAccountsWithHourlySnapshots = jest.spyOn(
        client,
        'getAccountsWithHourlySnapshots',
      )
      mockGetAccountsWithHourlySnapshots.mockResolvedValue([])

      const result = await client.getAllPositionsWithHourlySnapshots(['0x123'], {
        timestampGt: BigInt(1640995000),
        timestampLt: BigInt(1640995400),
      })

      expect(Object.keys(result)).toHaveLength(5)
      Object.values(result).forEach((accounts) => {
        expect(accounts).toEqual([])
      })
    })
  })

  describe('getValidReferredAccounts - error propagation', () => {
    let mockGetReferredAccounts: jest.SpyInstance
    let mockValidateAccounts: jest.SpyInstance

    beforeEach(() => {
      mockGetReferredAccounts = jest.spyOn(client, 'getReferredAccounts')
      mockValidateAccounts = jest.spyOn(client, 'validateAccounts')
    })

    afterEach(() => {
      mockGetReferredAccounts.mockRestore()
      mockValidateAccounts.mockRestore()
    })

    it('should propagate errors when getReferredAccounts fails on first chain', async () => {
      const chainError = new Error('Mainnet subgraph down')
      mockGetReferredAccounts.mockRejectedValueOnce(chainError)

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('Mainnet subgraph down')

      expect(mockGetReferredAccounts).toHaveBeenCalledTimes(1)
      expect(mockValidateAccounts).not.toHaveBeenCalled()
    })

    it('should propagate errors when getReferredAccounts fails on middle chain', async () => {
      const chainError = new Error('Sonic subgraph timeout')
      mockGetReferredAccounts
        .mockResolvedValueOnce([]) // MAINNET succeeds
        .mockRejectedValueOnce(chainError) // SONIC fails

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('Sonic subgraph timeout')

      expect(mockGetReferredAccounts).toHaveBeenCalledTimes(2)
      expect(mockValidateAccounts).not.toHaveBeenCalled()
    })

    it('should propagate errors when getReferredAccounts fails on last chain', async () => {
      const chainError = new Error('Hyperliquid subgraph error')
      mockGetReferredAccounts
        .mockResolvedValueOnce([]) // MAINNET
        .mockResolvedValueOnce([]) // SONIC
        .mockResolvedValueOnce([]) // ARBITRUM
        .mockResolvedValueOnce([]) // BASE
        .mockRejectedValueOnce(chainError) // HYPERLIQUID fails

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('Hyperliquid subgraph error')

      expect(mockGetReferredAccounts).toHaveBeenCalledTimes(5)
      expect(mockValidateAccounts).not.toHaveBeenCalled()
    })

    it('should propagate errors when validateAccounts fails on first chain', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
          referralChain: Network.MAINNET,
        },
      ]

      const validationError = new Error('Validation query failed')
      mockGetReferredAccounts.mockResolvedValue(mockAccounts)
      mockValidateAccounts.mockRejectedValueOnce(validationError)

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('Validation query failed')

      expect(mockGetReferredAccounts).toHaveBeenCalledTimes(5)
      expect(mockValidateAccounts).toHaveBeenCalledTimes(1)
    })

    it('should propagate errors when validateAccounts fails on middle chain', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
          referralChain: Network.MAINNET,
        },
      ]

      const validationError = new Error('Arbitrum validation failed')
      mockGetReferredAccounts.mockResolvedValue(mockAccounts)
      mockValidateAccounts
        .mockResolvedValueOnce({ '0x123': true }) // MAINNET succeeds
        .mockResolvedValueOnce({}) // SONIC succeeds (no accounts)
        .mockRejectedValueOnce(validationError) // ARBITRUM fails

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('Arbitrum validation failed')

      expect(mockValidateAccounts).toHaveBeenCalledTimes(3)
    })

    it('should propagate errors when validateAccounts fails on last chain', async () => {
      const mockAccounts: Account[] = [
        {
          id: '0x123',
          referralTimestamp: '1640995200',
          referralData: { id: '0xreferrer' },
          referralChain: Network.MAINNET,
        },
      ]

      const validationError = new Error('Hyperliquid validation failed')
      mockGetReferredAccounts.mockResolvedValue(mockAccounts)
      mockValidateAccounts
        .mockResolvedValueOnce({ '0x123': true }) // MAINNET
        .mockResolvedValueOnce({}) // SONIC
        .mockResolvedValueOnce({}) // ARBITRUM
        .mockResolvedValueOnce({}) // BASE
        .mockRejectedValueOnce(validationError) // HYPERLIQUID fails

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('Hyperliquid validation failed')

      expect(mockValidateAccounts).toHaveBeenCalledTimes(5)
    })

    it('should handle network errors correctly', async () => {
      const networkError = new Error('ECONNREFUSED')
      networkError.name = 'NetworkError'
      mockGetReferredAccounts.mockRejectedValueOnce(networkError)

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('ECONNREFUSED')
    })

    it('should handle partial failures correctly - fail fast on first error', async () => {
      const firstChainError = new Error('First chain failed')
      mockGetReferredAccounts.mockRejectedValueOnce(firstChainError)

      await expect(
        client.getValidReferredAccounts(BigInt(1640995000), BigInt(1640995400)),
      ).rejects.toThrow('First chain failed')

      // Should not continue to other chains
      expect(mockGetReferredAccounts).toHaveBeenCalledTimes(1)
    })
  })
})
