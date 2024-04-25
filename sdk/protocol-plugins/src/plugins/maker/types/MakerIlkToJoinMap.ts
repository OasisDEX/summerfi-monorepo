import { ILKType } from '../enums/ILKType'

export const MakerIlkToJoinMap: Record<ILKType, string> = {
  [ILKType.ETH_A]: 'MCD_JOIN_ETH_A',
  [ILKType.ETH_B]: 'MCD_JOIN_ETH_B',
  [ILKType.ETH_C]: 'MCD_JOIN_ETH_C',
  [ILKType.WBTC_A]: 'MCD_JOIN_WBTC_A',
  [ILKType.WBTC_B]: 'MCD_JOIN_WBTC_B',
  [ILKType.WBTC_C]: 'MCD_JOIN_WBTC_C',
  [ILKType.WSTETH_A]: 'MCD_JOIN_WSTETH_A',
  [ILKType.WSTETH_B]: 'MCD_JOIN_WSTETH_B',
  [ILKType.RETH_A]: 'MCD_JOIN_RETH_A',
}
