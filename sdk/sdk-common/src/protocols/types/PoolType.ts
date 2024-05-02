/**
 * @enum PoolType
 * @description Indicates the type of pool (supply or lending)
 */

export enum PoolType {
  Supply = 'Supply',
  Lending = 'Lending',
}

export function isPoolType(maybePoolType: unknown): maybePoolType is PoolType {
  return (
    typeof maybePoolType === 'string' && Object.values(PoolType).includes(maybePoolType as PoolType)
  )
}
