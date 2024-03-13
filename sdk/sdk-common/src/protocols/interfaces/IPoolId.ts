import {IProtocol} from "~sdk-common/protocols";

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 */
export interface IPoolId {
  protocol: IProtocol
}

