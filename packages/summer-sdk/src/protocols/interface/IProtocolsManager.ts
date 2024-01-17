import { IProtocol } from "./IProtocol";
import { ProtocolsNames } from "@sdk/protocols";

/**
 * @interface IProtocolsManager
 * @description Represents a protocols manager. Allows to retrieve a protocol by name
 */
export interface IProtocolsManager {
    getProtocol<ProtocolType extends IProtocol>(params: { name: ProtocolsNames }): ProtocolType;
}
