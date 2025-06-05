import { sql } from 'kysely'
import { Pool } from 'pg'
import { ConfigService } from '../config'
import { DatabaseService } from '../db'

// Mock dependencies
jest.mock('pg')
jest.mock('../config')
jest.mock('../migrations/kysely-migrator')

// Mock kysely sql template literals
const mockCompiledQuery = {
  sql: 'mock sql',
  parameters: [],
}

jest.mock('kysely', () => ({
  ...jest.requireActual('kysely'),
  sql: Object.assign(
    jest.fn(() => ({
      compile: jest.fn(() => mockCompiledQuery),
    })),
    {
      raw: jest.fn((str) => str),
    },
  ),
}))

describe('DatabaseService', () => {
  let db: DatabaseService
  let mockPool: jest.Mocked<Pool>
  let mockKysely: any
  let mockConfig: jest.Mocked<ConfigService>

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Mock Pool
    mockPool = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    } as any

    // Mock ConfigService
    mockConfig = {
      getConfig: jest.fn().mockResolvedValue({
        activeUserThresholdUsd: '100',
        pointsFormulaBase: 0.00005,
        pointsFormulaLogMultiplier: 0.0005,
      }),
    } as any

    // Mock Kysely methods with chaining
    mockKysely = {
      insertInto: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflict: jest.fn().mockReturnThis(),
      doNothing: jest.fn().mockReturnThis(),
      doUpdateSet: jest.fn().mockReturnThis(),
      column: jest.fn().mockReturnThis(),
      columns: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ rows: [] }),
      updateTable: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      selectFrom: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      executeTakeFirst: jest.fn().mockResolvedValue(null),
      executeQuery: jest.fn().mockResolvedValue({ rows: [] }),
      destroy: jest.fn(),
      fn: {
        count: jest.fn().mockReturnValue({ as: jest.fn().mockReturnValue('mock_count') }),
        sum: jest.fn().mockReturnValue({ as: jest.fn().mockReturnValue('mock_sum') }),
      },
    }

    // Mock Pool constructor
    ;(Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool)

    // Mock ConfigService constructor
    ;(ConfigService as jest.MockedClass<typeof ConfigService>).mockImplementation(() => mockConfig)

    // Create service instance
    db = new DatabaseService()

    // Replace the Kysely instance with our mock
    ;(db as any).db = mockKysely
  })

  describe('constructor', () => {
    it.skip('should initialize with default database config', () => {
      expect(Pool).toHaveBeenCalledWith({
        host: '127.0.0.1',
        port: 5439,
        database: 'beach_club_points',
        user: 'postgres',
        password: 'postgres',
      })
    })
  })

  describe('hasAnyData', () => {
    it('should return true when data exists', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue({ count: '5' })

      const result = await db.hasAnyData()

      expect(result).toBe(true)
      expect(mockKysely.selectFrom).toHaveBeenCalledWith('users')
      expect(mockKysely.executeTakeFirst).toHaveBeenCalled()
    })

    it('should return false when no data exists', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue({ count: '0' })

      const result = await db.hasAnyData()

      expect(result).toBe(false)
    })

    it('should return false when result is null', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue(null)

      const result = await db.hasAnyData()

      expect(result).toBe(false)
    })
  })

  describe('updatePosition', () => {
    it('should update position successfully', async () => {
      const mockTrx = mockKysely
      await db.updatePositionsInTransaction(mockTrx, [
        {
          id: 'pos123',
          chain: 'Base',
          user_id: 'user123',
          current_deposit_usd: '1000.5',
          current_deposit_asset: '1000.5',
          currency_symbol: 'USDC',
          fees_per_day_referrer: '0.1',
          fees_per_day_owner: '0.05',
          fees_per_day_referrer_usd: '0.1',
          fees_per_day_owner_usd: '0.05',
          is_volatile: false,
          last_synced_at: new Date(),
        },
      ])

      expect(mockKysely.insertInto).toHaveBeenCalledWith('positions')
      expect(mockKysely.execute).toHaveBeenCalled()
    })

    it('should handle conflicts with doUpdateSet', async () => {
      const mockTrx = mockKysely
      await db.updatePositionsInTransaction(mockTrx, [
        {
          id: 'pos123',
          chain: 'Base',
          user_id: 'user123',
          current_deposit_usd: '1000.5',
          current_deposit_asset: '1000.5',
          currency_symbol: 'USDC',
          fees_per_day_referrer: '0.1',
          fees_per_day_owner: '0.05',
          fees_per_day_referrer_usd: '0.1',
          fees_per_day_owner_usd: '0.05',
          is_volatile: false,
          last_synced_at: new Date(),
        },
      ])

      expect(mockKysely.onConflict).toHaveBeenCalled()
    })
  })

  describe('updateUserTotals', () => {
    const mockConfig = {
      activeUserThresholdUsd: 100,
      pointsFormulaBase: 0.00005,
      pointsFormulaLogMultiplier: 0.0005,
      isUpdating: false,
    }

    it('should update user totals successfully', async () => {
      const mockTrx = mockKysely
      await db.updateUsersIsActiveFlag(mockTrx, ['user123'], mockConfig)

      expect(mockKysely.executeQuery).toHaveBeenCalled()
    })

    it('should handle multiple users', async () => {
      const mockTrx = mockKysely
      await db.updateUsersIsActiveFlag(mockTrx, ['user123', 'user456'], mockConfig)

      expect(mockKysely.executeQuery).toHaveBeenCalled()
    })

    it('should handle empty user list', async () => {
      const mockTrx = mockKysely
      await db.updateUsersIsActiveFlag(mockTrx, [], mockConfig)

      // With empty array, no queries should be executed
      expect(mockKysely.executeQuery).not.toHaveBeenCalled()
    })
  })

  describe('recalculateReferralStats', () => {
    it('should recalculate referral stats successfully', async () => {
      const mockTrx = mockKysely
      await db.recalculateReferralStatsInTransaction(mockTrx)

      expect(mockKysely.executeQuery).toHaveBeenCalled()
    })
  })

  describe('updateDailyRatesAndPoints', () => {
    it('should update daily rates and points successfully', async () => {
      const mockTrx = mockKysely
      await db.updateDailyRatesAndPointsInTransaction(mockTrx)

      expect(mockKysely.executeQuery).toHaveBeenCalled()
    })

    it('should handle rewards distributions', async () => {
      const mockTrx = mockKysely
      await db.updateDailyRatesAndPointsInTransaction(mockTrx)

      expect(mockKysely.executeQuery).toHaveBeenCalled()
    })
  })

  describe('updateDailyStats', () => {
    it('should update daily stats successfully', async () => {
      const mockTrx = mockKysely
      await db.updateDailyStatsInTransaction(mockTrx)
      // todo: add tests for updateDailyStatsInTransaction
    })
  })

  describe('getLastProcessedTimestamp', () => {
    it('should return last processed timestamp', async () => {
      const mockDate = new Date('2024-01-01')
      mockKysely.executeTakeFirst.mockResolvedValue({ last_processed_timestamp: mockDate })

      const mockTrx = mockKysely
      const result = await db.getLastProcessedTimestampInTransaction(mockTrx)

      expect(result).toEqual(mockDate)
      expect(mockKysely.selectFrom).toHaveBeenCalledWith('processing_checkpoint')
    })

    it('should return null when no timestamp found', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue(null)

      const mockTrx = mockKysely
      const result = await db.getLastProcessedTimestampInTransaction(mockTrx)

      expect(result).toBeNull()
    })
  })

  describe('updateProcessingCheckpoint', () => {
    it('should insert new checkpoint', async () => {
      const timestamp = new Date('2024-01-01T12:00:00Z')

      await db.updateProcessingCheckpoint(timestamp)

      expect(mockKysely.insertInto).toHaveBeenCalledWith('processing_checkpoint')
      expect(mockKysely.values).toHaveBeenCalledWith({
        last_processed_timestamp: timestamp,
      })
    })
  })

  describe('getReferralCode', () => {
    it('should return referral code with converted numbers', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue({
        id: 'ref123',
        custom_code: 'CUSTOM',
        total_deposits_referred_usd: '5000',
        active_users_count: 10,
        last_calculated_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })

      const result = await db.getReferralCode('ref123')

      expect(result).toEqual({
        id: 'ref123',
        custom_code: 'CUSTOM',
        total_deposits_referred_usd: 5000,
        active_users_count: 10,
        last_calculated_at: expect.any(Date),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    })

    it('should return null when referral code not found', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue(null)

      const result = await db.getReferralCode('nonexistent')

      expect(result).toBeNull()
    })

    it('should handle missing dates with defaults', async () => {
      mockKysely.executeTakeFirst.mockResolvedValue({
        id: 'ref123',
        custom_code: null,
        total_deposits_referred_usd: '0',
        active_users_count: 0,
        last_calculated_at: null,
        created_at: null,
        updated_at: null,
      })

      const result = await db.getReferralCode('ref123')

      expect(result!.created_at).toBeInstanceOf(Date)
      expect(result!.updated_at).toBeInstanceOf(Date)
    })
  })

  describe('close', () => {
    it('should destroy database connection', async () => {
      await db.close()

      expect(mockKysely.destroy).toHaveBeenCalled()
    })
  })

  describe('getters', () => {
    it('should return raw database instance', () => {
      expect(db.rawDb).toBe(mockKysely)
    })
  })
})
