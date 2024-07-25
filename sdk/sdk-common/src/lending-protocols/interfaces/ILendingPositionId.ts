import { z } from 'zod'
import { IPositionId } from '../../common/interfaces/IPositionId'
import { PositionType } from '../../common/types/PositionType'

/**
 * @name ILendingPositionId
 * @description Represents a position ID for a lending position
 */
export interface ILendingPositionId extends IPositionId {
  /** Position Id type is lending */
  type: PositionType.Lending
}

/**
 * @description Zod schema for ILendingPositionId
 */
export const LendingPositionIdDataSchema = z.object({
  type: z.literal(PositionType.Lending),
  id: z.string(),
})

/**
 * Type for the data part of the ILendingPositionId interface
 */
export type ILendingPositionIdData = Readonly<z.infer<typeof LendingPositionIdDataSchema>>

/**
 * @description Type guard for ILendingPositionId
 * @param maybeLendingPositionId Object to be checked
 * @returns true if the object is an ILendingPositionId
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPool
 */
export function isLendingPositionId(
  maybeLendingPositionId: unknown,
): maybeLendingPositionId is ILendingPositionId {
  return LendingPositionIdDataSchema.safeParse(maybeLendingPositionId).success
}
