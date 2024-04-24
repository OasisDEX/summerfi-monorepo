/**
 * Generic position ID interface, to be specialized by each protocol
 */
export interface IPositionId {
  /* Unique identifier for the position inside the Summer.fi system */
  readonly id: string
}

export function isPositionId(maybePositionId: unknown): maybePositionId is IPositionId {
  return typeof maybePositionId === 'object' && maybePositionId !== null && 'id' in maybePositionId
}
