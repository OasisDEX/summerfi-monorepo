import { ILKType } from '../enums/ILKType'

export const MakerIlkToJoinMap: Record<ILKType, string> = {
  [ILKType.ETH_A]: 'MCD_JOIN_ETH_A',
  [ILKType.ETH_B]: 'MCD_JOIN_ETH_B',
  [ILKType.ETH_C]: 'MCD_JOIN_ETH_C',
  [ILKType.BAT_A]: 'MCD_JOIN_BAT_A',
  [ILKType.USDC_A]: 'MCD_JOIN_USDC_A',
  [ILKType.USDC_B]: 'MCD_JOIN_USDC_B',
  [ILKType.WBTC_A]: 'MCD_JOIN_WBTC_A',
  [ILKType.WBTC_B]: 'MCD_JOIN_WBTC_B',
  [ILKType.TUSD_A]: 'MCD_JOIN_TUSD_A',
  [ILKType.KNC_A]: 'MCD_JOIN_KNC_A',
  [ILKType.ZRX_A]: 'MCD_JOIN_ZRX_A',
  [ILKType.MANA_A]: 'MCD_JOIN_MANA_A',
  [ILKType.COMP_A]: 'MCD_JOIN_COMP_A',
  [ILKType.LRC_A]: 'MCD_JOIN_LRC_A',
  [ILKType.LINK_A]: 'MCD_JOIN_LINK_A',
}
