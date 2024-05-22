import { Kysely } from 'kysely'
import { Database } from '../database-types'
import { Logger } from '@summerfi/abstractions'

export interface UpdateLockServiceParams {
  db: Kysely<Database>
  logger: Logger
}

export interface UpdateLockService {
  getLock: () => Promise<{ isLocked: boolean }>
  setLock: () => Promise<void>
  unlock: () => Promise<void>
}

const UPDATE_POINTS_LOCK_ID = 'update_points_lock'

export const getUpdateLockService = ({ db }: UpdateLockServiceParams): UpdateLockService => {
  return {
    getLock: async () => {
      return await db
        .selectFrom('updatePointsLock')
        .where('id', '=', UPDATE_POINTS_LOCK_ID)
        .select('isLocked')
        .executeTakeFirstOrThrow()
    },
    setLock: async () => {
      await db
        .updateTable('updatePointsLock')
        .set('isLocked', true)
        .where('id', '=', UPDATE_POINTS_LOCK_ID)
        .executeTakeFirstOrThrow()
    },
    unlock: async () => {
      await db
        .updateTable('updatePointsLock')
        .set('isLocked', false)
        .where('id', '=', UPDATE_POINTS_LOCK_ID)
        .executeTakeFirstOrThrow()
    },
  }
}
