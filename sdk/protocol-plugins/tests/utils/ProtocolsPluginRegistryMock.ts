import {
  IContractProvider,
  IPriceService,
  IProtocolPlugin,
  IProtocolPluginContext,
  IProtocolPluginsRegistry,
  ITokenService,
} from '@summerfi/protocol-plugins-common'
import { PublicClient } from 'viem'
import {
  EmptyProtocolPluginMock,
  NoCheckpointProtocolPluginMock,
  ProtocolPluginMock,
} from './ProtocolPluginMock'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ProtocolPluginsRegistry } from '../../src/implementation/ProtocolPluginsRegistry'
import { MakerProtocolPlugin } from '../../src/plugins/maker/implementation/MakerProtocolPlugin'
import { SparkProtocolPlugin } from '../../src/plugins/spark/implementation/SparkProtocolPlugin'

export function createProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    provider: undefined as unknown as PublicClient,
    tokenService: undefined as unknown as ITokenService,
    priceService: undefined as unknown as IPriceService,
    contractProvider: undefined as unknown as IContractProvider,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {
      [ProtocolName.Maker]: ProtocolPluginMock,
      [ProtocolName.Spark]: ProtocolPluginMock,
    },
    context: protocolPluginContext,
  })
}

export function createEmptyProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    provider: undefined as unknown as PublicClient,
    tokenService: undefined as unknown as ITokenService,
    priceService: undefined as unknown as IPriceService,
    contractProvider: undefined as unknown as IContractProvider,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {},
    context: protocolPluginContext,
  })
}

export function createEmptyBuildersProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    provider: undefined as unknown as PublicClient,
    tokenService: undefined as unknown as ITokenService,
    priceService: undefined as unknown as IPriceService,
    contractProvider: undefined as unknown as IContractProvider,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {
      [ProtocolName.Maker]: EmptyProtocolPluginMock,
      [ProtocolName.Spark]: EmptyProtocolPluginMock,
    },
    context: protocolPluginContext,
  })
}

export function createNoCheckpointProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    provider: undefined as unknown as PublicClient,
    tokenService: undefined as unknown as ITokenService,
    priceService: undefined as unknown as IPriceService,
    contractProvider: undefined as unknown as IContractProvider,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {
      [ProtocolName.Maker]: NoCheckpointProtocolPluginMock,
      [ProtocolName.Spark]: NoCheckpointProtocolPluginMock,
    },
    context: protocolPluginContext,
  })
}

export function createRealProtocolsPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    provider: undefined as unknown as PublicClient,
    tokenService: undefined as unknown as ITokenService,
    priceService: undefined as unknown as IPriceService,
    contractProvider: undefined as unknown as IContractProvider,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {
      [ProtocolName.Maker]: MakerProtocolPlugin,
      [ProtocolName.Spark]: SparkProtocolPlugin,
    },
    context: protocolPluginContext,
  })
}
