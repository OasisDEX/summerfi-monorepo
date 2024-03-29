import { ChainInfo } from '../../common/implementation/ChainInfo'
import { ProtocolName } from '../enums/ProtocolName'
import { IPoolId, isPoolId } from './IPoolId'

// TODO: this will probably need to be moved to the protocol plugins package
export enum ILKType {
  ETH_A = 'ETH-A',
  BAT_A = 'BAT-A',
  USDC_A = 'USDC-A',
  WBTC_A = 'WBTC-A',
  USDC_B = 'USDC-B',
  WBTC_B = 'WBTC-B',
  TUSD_A = 'TUSD-A',
  KNC_A = 'KNC-A',
  ZRX_A = 'ZRX-A',
  MANA_A = 'MANA-A',
  COMP_A = 'COMP-A',
  LRC_A = 'LRC-A',
  LINK_A = 'LINK-A',
}

// TODO: temporary interface so FE can create this data types without talking to a service
export interface MakerPoolId extends IPoolId {
  protocol: {
    name: ProtocolName.Maker
    chainInfo: ChainInfo
  }
  ilkType: ILKType
  // TODO: vaultId does not belong in the poolId
  vaultId: string
}

export function isMakerPoolId(maybePoolId: unknown): maybePoolId is MakerPoolId {
  return (
    isPoolId(maybePoolId) &&
    'ilkType' in maybePoolId &&
    'vaultId' in maybePoolId &&
    maybePoolId.protocol.name === ProtocolName.Maker
  )
}
