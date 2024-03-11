import {ProtocolName} from "~sdk-common/protocols";

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 */
export interface IPoolId {
  protocol: ProtocolName
}

// export type IPoolId = string & { __poolId: never }
