import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'

export type LockBucketAvailabilityMap = {
  0: number
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
}

export const mapLockBucketToAvailability = (
  lockBucketAvailabilityMap: LockBucketAvailabilityMap | null,
  days: number,
) => {
  if (!lockBucketAvailabilityMap) {
    return 0
  }

  if (days === 0) {
    return lockBucketAvailabilityMap[0]
  }
  if (days < 14) {
    return lockBucketAvailabilityMap[1]
  }
  if (days < 90) {
    return lockBucketAvailabilityMap[2]
  }
  if (days < 180) {
    return lockBucketAvailabilityMap[3]
  }
  if (days < 365) {
    return lockBucketAvailabilityMap[4]
  }
  if (days < 730) {
    return lockBucketAvailabilityMap[5]
  }

  return lockBucketAvailabilityMap[6]
}

export const mapLockBucketToRange = (days: number) => {
  if (days === 0) {
    return 'No lockup'
  }
  if (days < 14) {
    return 'Up to 14 days'
  }
  if (days < 90) {
    return '14 days - 3m'
  }
  if (days < 180) {
    return '3m - 6m'
  }
  if (days < 365) {
    return '6m - 1y'
  }
  if (days < 730) {
    return '1y - 2y'
  }

  return '2y - 3y'
}

export const mapLockBucketToBucketIndex = (days: number) => {
  if (days === 0) {
    return -1
  }
  if (days < 14) {
    return -1
  }
  if (days < 90) {
    return 0
  }
  if (days < 180) {
    return 1
  }
  if (days < 365) {
    return 2
  }
  if (days < 730) {
    return 3
  }

  return 4
}

export const availabilityColorMap: { [key in 'low' | 'medium' | 'high']: string } = {
  low: 'var(--color-text-critical)',
  medium: 'var(--color-background-warning-bold)',
  high: 'var(--earn-protocol-success-100)',
}

export const mapBucketsInfoToAvailabilityMap = (
  bucketsInfo: { bucket: number; cap: bigint; totalStaked: bigint }[],
): LockBucketAvailabilityMap => {
  // Map bucket indexes to lockBucketAvailabilityMap keys
  const bucketIndexToMapKey: {
    [key: number]: keyof LockBucketAvailabilityMap
  } = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  }

  const availabilityMap: LockBucketAvailabilityMap = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  }

  // Populate the map with bucket caps
  bucketsInfo.forEach((bucketInfo: { bucket: number; cap: bigint; totalStaked: bigint }) => {
    const bucketIndex = bucketInfo.bucket
    const mapKey = bucketIndexToMapKey[bucketIndex]

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (mapKey !== undefined) {
      // Convert BigInt cap to number (assuming it's in token units)
      availabilityMap[mapKey] = new BigNumber(bucketInfo.cap.toString())
        .minus(bucketInfo.totalStaked.toString())
        .shiftedBy(-SUMR_DECIMALS)
        .toNumber()
    }
  })

  return availabilityMap
}
