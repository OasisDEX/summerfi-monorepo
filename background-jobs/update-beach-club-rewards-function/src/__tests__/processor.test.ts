import { Network } from '../types'
import { ReferralClient } from '../client'
import { DatabaseService } from '../db'
import { ReferralProcessor } from '../processor'
import { Logger } from '@aws-lambda-powertools/logger'

// Mock dependencies
jest.mock('../db')
jest.mock('../client')

describe('ReferralProcessor', () => {
  let processor: ReferralProcessor
  let mockLogger: Logger
  let mockClient: jest.Mocked<ReferralClient>

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Create mock logger
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any

    // Mock ReferralClient
    mockClient = {
      getValidReferredAccounts: jest.fn(),
      getAllPositionsWithHourlySnapshots: jest.fn(),
      validateAccounts: jest.fn(),
    } as any

    // Mock the ReferralClient constructor
    ;(ReferralClient as jest.MockedClass<typeof ReferralClient>).mockImplementation(
      () => mockClient,
    )

    // Mock transaction execution
    const mockExecuteInTransaction = jest.fn().mockImplementation((callback) => {
      return callback({
        insertInto: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([
          { id: 'user1', referralType: 'user' },
          { id: 'user2', referralType: 'user' },
        ]),
        selectFrom: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue({ count: '2' }),
        onConflict: jest.fn().mockReturnThis(),
        doNothing: jest.fn().mockReturnThis(),
      })
    })

    // Mock rawDb with Kysely-like interface
    const mockRawDb = {
      selectFrom: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue([]),
      executeTakeFirst: jest.fn().mockResolvedValue(null),
      executeQuery: jest.fn().mockResolvedValue({ rows: [] }),
    }

    const mockConfig = {
      getConfig: jest.fn().mockResolvedValue({
        activeUserThresholdUsd: 100,
        pointsFormulaBase: 0.00005,
        pointsFormulaLogMultiplier: 0.0005,
        isUpdating: false,
      }),
      getIsUpdating: jest.fn().mockResolvedValue(false),
      setIsUpdating: jest.fn().mockResolvedValue(undefined),
    }

    const mockRawPool = {
      connect: jest.fn().mockResolvedValue({
        query: jest.fn(),
        release: jest.fn(),
      }),
    }

    // Mock the DatabaseService implementation
    ;(DatabaseService as jest.MockedClass<typeof DatabaseService>).mockImplementation(
      () =>
        ({
          rawDb: mockRawDb,
          rawPool: mockRawPool,
          config: mockConfig,
          executeInTransaction: mockExecuteInTransaction,
          getLastProcessedTimestampInTransaction: jest.fn(),
          updateProcessingCheckpoint: jest.fn(),
          upsertUser: jest.fn(),
          updatePositionsInTransaction: jest.fn(),
          updateUsersIsActiveFlag: jest.fn(),
          recalculateReferralStatsInTransaction: jest.fn(),
          updateDailyRatesAndPointsInTransaction: jest.fn(),
          updateDailyStatsInTransaction: jest.fn(),
          validateReferralCodeInTransaction: jest.fn().mockResolvedValue('referrer1'),
          getReferralCode: jest.fn(),
          close: jest.fn(),
          migrate: jest.fn(),
          ensureReferralCode: jest.fn(),
        }) as any,
    )

    // Create processor with mock logger
    processor = new ReferralProcessor({ logger: mockLogger })
  })

  describe('processLatest', () => {
    it('should process successfully when there is new data', async () => {
      const mockDb = (processor as any).db
      const now = new Date()
      now.setMinutes(0, 0, 0)
      const periodStart = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago

      // Mock last processed timestamp
      mockDb.getLastProcessedTimestampInTransaction.mockResolvedValue(periodStart)

      // Mock client methods
      mockClient.getValidReferredAccounts.mockResolvedValue({
        validAccounts: [
          {
            id: 'user1',
            referralData: { id: 'referrer1' },
            referralChain: Network.BASE,
            referralTimestamp: '1704067200',
          },
          {
            id: 'user2',
            referralData: { id: 'referrer1' },
            referralChain: Network.BASE,
            referralTimestamp: '1704067200',
          },
        ],
      })

      // Mock positions data - ensure snapshot is within the processing period
      const snapshotTime = Math.floor((periodStart.getTime() + now.getTime()) / 2000) // midpoint between periodStart and now
      mockClient.getAllPositionsWithHourlySnapshots.mockResolvedValue({
        base: [
          {
            id: 'user1',
            positions: [
              {
                id: 'pos1',
                createdTimestamp: '1704067200',
                inputTokenBalanceNormalized: '1000',
                inputTokenBalanceNormalizedInUSD: '1000',
                vault: {
                  id: 'vault1',
                  inputToken: {
                    symbol: 'USDC',
                  },
                },
                hourlySnapshots: [
                  {
                    id: 'snapshot1',
                    timestamp: snapshotTime.toString(),
                    inputTokenBalanceNormalized: '1000',
                    inputTokenBalanceNormalizedInUSD: '1000',
                  },
                ],
              },
            ],
          },
          {
            id: 'user2',
            positions: [
              {
                id: 'pos2',
                createdTimestamp: '1704067200',
                inputTokenBalanceNormalized: '500',
                inputTokenBalanceNormalizedInUSD: '500',
                vault: {
                  id: 'vault2',
                  inputToken: {
                    symbol: 'USDC',
                  },
                },
                hourlySnapshots: [
                  {
                    id: 'snapshot2',
                    timestamp: snapshotTime.toString(),
                    inputTokenBalanceNormalized: '500',
                    inputTokenBalanceNormalizedInUSD: '500',
                  },
                ],
              },
            ],
          },
        ],
      })

      const result = await processor.processLatest()

      if (!result.success) {
        console.error('Test failed with error:', result.error)
      }

      expect(result.success).toBe(true)
      expect(mockDb.updatePositionsInTransaction).toHaveBeenCalled()
      expect(mockDb.recalculateReferralStatsInTransaction).toHaveBeenCalled()
      expect(mockDb.updateDailyRatesAndPointsInTransaction).toHaveBeenCalled()
    })

    it('should handle first run (no previous timestamp)', async () => {
      const mockDb = (processor as any).db

      // Mock no previous timestamp (first run)
      mockDb.getLastProcessedTimestampInTransaction.mockResolvedValue(null)

      // Mock empty data
      mockClient.getValidReferredAccounts.mockResolvedValue({ validAccounts: [] })
      mockClient.getAllPositionsWithHourlySnapshots.mockResolvedValue({})

      const result = await processor.processLatest()

      expect(result.success).toBe(true)
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('First run'))
    })

    it('should handle no new data gracefully', async () => {
      const mockDb = (processor as any).db
      const now = new Date()
      now.setMinutes(0, 0, 0)

      // Mock timestamps showing no new data
      mockDb.getLastProcessedTimestampInTransaction.mockResolvedValue(now)

      const result = await processor.processLatest()

      expect(result.success).toBe(true)
      expect(result.usersProcessed).toBe(0)
      expect(result.activeUsers).toBe(0)
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('No new data to process'),
      )
    })

    it('should handle processing errors', async () => {
      const mockDb = (processor as any).db
      mockDb.executeInTransaction.mockRejectedValue(new Error('Database error'))

      const result = await processor.processLatest()

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Processing failed'),
        expect.objectContaining({ error: expect.any(Error) }),
      )
    })

    it('should handle concurrent processing by checking is_updating flag', async () => {
      const mockDb = (processor as any).db

      // Mock is_updating flag as true
      mockDb.config.getIsUpdating.mockResolvedValue(true)

      const result = await processor.processLatest()

      expect(result.success).toBe(true)
      expect(result.usersProcessed).toBe(0)
      expect(result.activeUsers).toBe(0)
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Processing already in progress'),
      )
    })
  })

  describe('processPeriod', () => {
    it('should process a specific period successfully', async () => {
      const mockDb = (processor as any).db
      const periodStart = new Date('2024-01-01T00:00:00Z')
      const periodEnd = new Date('2024-01-01T01:00:00Z')

      // Mock client methods
      mockClient.getAllPositionsWithHourlySnapshots.mockResolvedValue({
        base: [
          {
            id: 'user1',
            positions: [
              {
                id: 'pos1',
                createdTimestamp: '1704067200',
                inputTokenBalanceNormalized: '1000',
                inputTokenBalanceNormalizedInUSD: '1000',
                vault: {
                  id: 'vault1',
                  inputToken: { symbol: 'USDC' },
                },
                hourlySnapshots: [
                  {
                    id: 'snapshot1',
                    timestamp: '1704070800',
                    inputTokenBalanceNormalized: '1000',
                    inputTokenBalanceNormalizedInUSD: '1000',
                  },
                ],
              },
            ],
          },
        ],
      })

      const result = await processor.processPeriod(periodStart, periodEnd)

      expect(result.success).toBe(true)
      expect(result.periodStart).toEqual(periodStart)
      expect(result.periodEnd).toEqual(periodEnd)
    })
  })

  describe('close', () => {
    it('should close database connection', async () => {
      const mockDb = (processor as any).db
      await processor.close()
      expect(mockDb.close).toHaveBeenCalled()
    })
  })

  describe('getLatestSnapshot', () => {
    it('should return null for empty snapshots', () => {
      const result = (processor as any).getLatestSnapshot(
        undefined,
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      )
      expect(result).toBeNull()

      const result2 = (processor as any).getLatestSnapshot(
        [],
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      )
      expect(result2).toBeNull()
    })

    it('should return latest snapshot within period', () => {
      const periodStart = new Date('2024-01-01T00:00:00Z')
      const periodEnd = new Date('2024-01-01T06:00:00Z')

      const snapshots = [
        {
          id: 'snap1',
          timestamp: '1704070800',
          inputTokenBalanceNormalized: '100',
          inputTokenBalanceNormalizedInUSD: '100',
        }, // 01:00
        {
          id: 'snap2',
          timestamp: '1704074400',
          inputTokenBalanceNormalized: '200',
          inputTokenBalanceNormalizedInUSD: '200',
        }, // 02:00
        {
          id: 'snap3',
          timestamp: '1704078000',
          inputTokenBalanceNormalized: '300',
          inputTokenBalanceNormalizedInUSD: '300',
        }, // 03:00
      ]

      const result = (processor as any).getLatestSnapshot(snapshots, periodStart, periodEnd)

      expect(result).toEqual(snapshots[2])
    })

    it('should filter out snapshots outside period', () => {
      const periodStart = new Date('2024-01-01T02:00:00Z')
      const periodEnd = new Date('2024-01-01T04:00:00Z')

      const snapshots = [
        {
          id: 'snap1',
          timestamp: '1704070800',
          inputTokenBalanceNormalized: '100',
          inputTokenBalanceNormalizedInUSD: '100',
        }, // 01:00 - before
        {
          id: 'snap2',
          timestamp: '1704078000',
          inputTokenBalanceNormalized: '200',
          inputTokenBalanceNormalizedInUSD: '200',
        }, // 03:00 - in period
        {
          id: 'snap3',
          timestamp: '1704085200',
          inputTokenBalanceNormalized: '300',
          inputTokenBalanceNormalizedInUSD: '300',
        }, // 05:00 - after
      ]

      const result = (processor as any).getLatestSnapshot(snapshots, periodStart, periodEnd)

      expect(result).toEqual(snapshots[1])
    })
  })
})
