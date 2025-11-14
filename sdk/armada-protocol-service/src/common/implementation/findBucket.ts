import { StakingBucket } from '@summerfi/sdk-common'

/**
 * Helper function to map lockup period to staking bucket
 */
export function findBucket(lockupPeriod: bigint): StakingBucket {
  const SECONDS_PER_DAY = 86400n
  const DAYS_14 = 14n * SECONDS_PER_DAY
  const DAYS_90 = 90n * SECONDS_PER_DAY
  const DAYS_180 = 180n * SECONDS_PER_DAY
  const DAYS_365 = 365n * SECONDS_PER_DAY
  const DAYS_730 = 730n * SECONDS_PER_DAY
  const DAYS_1095 = 1095n * SECONDS_PER_DAY

  if (lockupPeriod < DAYS_14) {
    return StakingBucket.NoLockup
  } else if (lockupPeriod < DAYS_90) {
    return StakingBucket.TwoWeeksToThreeMonths
  } else if (lockupPeriod < DAYS_180) {
    return StakingBucket.ThreeToSixMonths
  } else if (lockupPeriod < DAYS_365) {
    return StakingBucket.SixToTwelveMonths
  } else if (lockupPeriod < DAYS_730) {
    return StakingBucket.OneToTwoYears
  } else if (lockupPeriod <= DAYS_1095) {
    return StakingBucket.TwoToThreeYears
  } else {
    throw new Error('Invalid lockup period')
  }
}
