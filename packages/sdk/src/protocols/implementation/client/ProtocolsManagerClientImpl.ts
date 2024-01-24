import { ProtocolsManager } from '~sdk/protocols'
import { Protocol, ProtocolName, ProtocolsRegistry } from '~sdk/protocols'

export class ProtocolsManagerClientImpl implements ProtocolsManager {
  public getSupportedProtocols(): ProtocolName[] {
    return ProtocolsRegistry.getSupportedProtocols()
  }

  public getProtocolByName<ProtocolType extends Protocol>(name: ProtocolName): ProtocolType {
    return ProtocolsRegistry.getProtocol<ProtocolType>(name)
  }
}
