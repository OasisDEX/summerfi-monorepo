import {ChainInfo} from "~sdk-common/common";
import { ProtocolName } from '../enums/ProtocolName'
import { IPoolId } from './IPoolId'

// TODO: this will probably need to be moved to the protocol plugins package
export enum EmodeType {
  None = 'None',
  Stablecoins = 'Stablecoins',
  ETHCorrelated = 'ETHCorrelated',
}

// TODO: temporary interface so FE can create this data types without talking to a service
export interface SparkPoolId extends IPoolId {
  protocol: {
    name: ProtocolName.Spark,
    chainInfo: ChainInfo
  }
  emodeType: EmodeType
}

export function isSparkPoolId(poolId: IPoolId): poolId is SparkPoolId {
  return poolId.protocol.name === ProtocolName.Spark
}
