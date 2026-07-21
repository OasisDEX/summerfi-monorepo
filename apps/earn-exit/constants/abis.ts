import { parseAbi } from 'viem'

export const harborCommandAbi = parseAbi([
  'function getActiveFleetCommanders() view returns (address[])',
])

// The FleetCommander is itself the ERC20/ERC4626 share token.
export const fleetCommanderAbi = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function asset() view returns (address)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)',
  'function paused() view returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function config() view returns (address bufferArk, uint256 minimumBufferBalance, uint256 depositCap, uint256 maxRebalanceOperations, address stakingRewardsManager)',
])

export const stakingRewardsManagerAbi = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function earned(address account, address rewardToken) view returns (uint256)',
  'function rewardTokensLength() view returns (uint256)',
  'function rewardTokens(uint256 index) view returns (address)',
  'function getReward()',
])

export const admiralsQuartersAbi = parseAbi([
  // assets = 0 ⇒ exit ALL of the caller's (approved) fleet shares
  'function exitFleet(address fleetCommander, uint256 assets) payable returns (uint256 shares)',
  // amount = 0 ⇒ send AdmiralsQuarters' entire balance of `asset` to the caller
  'function withdrawTokens(address asset, uint256 amount) payable',
  // shares = 0 ⇒ unstake+withdraw ALL staked shares; role-gated, needs no ERC20 approval
  'function unstakeAndWithdrawAssets(address fleetCommander, uint256 shares, bool claimRewards)',
  'function multicall(bytes[] data) payable returns (bytes[] results)',
])

// SUMR governance-token staking (V2 SummerStaking). Base only. Only the methods the exit app
// reads/writes are declared. `exit()` / `unstake(uint256)` exist on-chain but are `pure` revert
// stubs — the real unstake entry point is `unstakeLockup(stakeIndex, amount)`.
export const summerStakingAbi = parseAbi([
  'function getUserStakesCount(address user) view returns (uint256)',
  'function getUserStake(address user, uint256 index) view returns (uint256 amount, uint256 weightedAmount, uint256 lockupEndTime, uint256 lockupPeriod)',
  'function STAKED_SUMMER_TOKEN() view returns (address)',
  'function SUMMER_TOKEN() view returns (address)',
  'function penaltyEnabled() view returns (bool)',
  // WAD-scaled fraction (1e18 = 100%); 2% floor near expiry, 20% max. 0 once lockup expires.
  'function calculatePenaltyPercentage(address user, uint256 stakeIndex) view returns (uint256)',
  // Absolute penalty in SUMR base units (18 decimals) for unstaking `amount` from `stakeIndex`.
  'function calculatePenalty(address user, uint256 amount, uint256 stakeIndex) view returns (uint256)',
  'function rewardTokensLength() view returns (uint256)',
  'function rewardTokens(uint256 index) view returns (address)',
  'function earned(address account, address rewardToken) view returns (uint256)',
  // shares of the specific stake are pulled as the staked-receipt token (stSUMR) — needs approval.
  'function unstakeLockup(uint256 stakeIndex, uint256 amount)',
  // Self-claim: the caller claims their OWN rewards. (getRewardFor(account,...) is the on-behalf
  // path and reverts for a direct user with a caller-not-authorized error.)
  'function getReward(address rewardToken)',
])

export const chainlinkAggregatorAbi = parseAbi([
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)',
])
