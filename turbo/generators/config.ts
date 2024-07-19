import type { PlopTypes } from '@turbo/gen'
import { setupProtocolPluginGenerator } from './protocol-plugins'
import { setupSDKServiceGenerator } from './sdk-service'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  setupProtocolPluginGenerator(plop)
  setupSDKServiceGenerator(plop)
}
