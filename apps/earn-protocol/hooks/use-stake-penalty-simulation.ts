import BigNumber from 'bignumber.js'

// Constants from the contract
const MIN_PENALTY_PERCENTAGE = BigInt('20000000000000000') // 0.02e18 (2%)
const MAX_PENALTY_PERCENTAGE = BigInt('200000000000000000') // 0.2e18 (20%)
const FIXED_PENALTY_PERIOD = BigInt(110 * 24 * 60 * 60) // 110 days in seconds
const MAX_LOCKUP_PERIOD = BigInt(3 * 365 * 24 * 60 * 60) // 3 years in seconds
const WAD = BigInt('1000000000000000000') // 1e18

export const useStakePenaltySimulation = ({
  timeRemainingInSeconds,
}: {
  timeRemainingInSeconds: number
}) => {
  // Get current timestamp using local time
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))
  const lockupEndTime = currentTimestamp + BigInt(timeRemainingInSeconds)

  if (currentTimestamp >= lockupEndTime) {
    return 0
  }

  if (timeRemainingInSeconds < FIXED_PENALTY_PERIOD) {
    // MIN_PENALTY_PERCENTAGE is 0.02e18 (2%)
    return new BigNumber(MIN_PENALTY_PERCENTAGE).dividedBy(WAD).multipliedBy(100).toNumber()
  }
  // Linear ramp to MAX_PENALTY_PERCENTAGE at MAX_LOCKUP_PERIOD
  const penaltyBigInt = new BigNumber(timeRemainingInSeconds)
    .multipliedBy(MAX_PENALTY_PERCENTAGE)
    .dividedBy(MAX_LOCKUP_PERIOD)

  return penaltyBigInt.dividedBy(WAD).multipliedBy(100).toNumber()
}
