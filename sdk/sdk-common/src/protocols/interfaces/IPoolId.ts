import { IProtocol } from "../../protocols/interfaces/IProtocol";

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 */
export interface IPoolId {
  protocol: IProtocol
}

