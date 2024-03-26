import { BigNumber } from 'bignumber.js'
import { PRECISION } from '../../common/constants/AaveV3LikeConstants'

export function amountFromWei(amount: bigint): BigNumber {
  return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRECISION.WAD))
}

export function amountFromRay(amount: bigint): BigNumber {
  return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRECISION.RAY))
}

export function amountFromRad(amount: bigint): BigNumber {
  return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRECISION.RAD))
}
