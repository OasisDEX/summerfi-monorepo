import {
  IContractProvider,
  IProtocolPluginContext,
  IProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins-common'
import { PublicClient } from 'viem'
import {
  EmptyProtocolPluginMock,
  NoCheckpointProtocolPluginMock,
  ProtocolPluginMock,
} from './ProtocolPluginMock'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'
import { ProtocolPluginsRegistry } from '../../src/implementation/ProtocolPluginsRegistry'
import { MakerProtocolPlugin } from '../../src/plugins/maker/implementation/MakerProtocolPlugin'
import { SparkProtocolPlugin } from '../../src/plugins/spark/implementation/SparkProtocolPlugin'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IAddressBookManager } from '@summerfi/address-book-common'

export function createProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    addressBookManager: undefined as unknown as IAddressBookManager,
    provider: undefined as unknown as PublicClient,
    tokensManager: undefined as unknown as ITokensManager,
    oracleManager: undefined as unknown as IOracleManager,
    swapManager: undefined as unknown as ISwapManager,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {
      [ProtocolName.Maker]: ProtocolPluginMock,
      [ProtocolName.AAVEv3]: ProtocolPluginMock,
      [ProtocolName.Spark]: ProtocolPluginMock,
      [ProtocolName.Morpho]: ProtocolPluginMock,
    },
    context: protocolPluginContext,
  })
}

export function createEmptyProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    addressBookManager: undefined as unknown as IAddressBookManager,
    provider: undefined as unknown as PublicClient,
    tokensManager: undefined as unknown as ITokensManager,
    oracleManager: undefined as unknown as IOracleManager,
    swapManager: undefined as unknown as ISwapManager,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {},
    context: protocolPluginContext,
  })
}

export function createEmptyBuildersProtocolPluginsRegistry(): IProtocolPluginsRegistry {
  const protocolPluginContext: IProtocolPluginContext = {
    addressBookManager: undefined as unknown as IAddressBookManager,
    provider: undefined as unknown as PublicClient,
    tokensManager: undefined as unknown as ITokensManager,
    oracleManager: undefined as unknown as IOracleManager,
    swapManager: undefined as unknown as ISwapManager,
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
    addressBookManager: undefined as unknown as IAddressBookManager,
    provider: undefined as unknown as PublicClient,
    tokensManager: undefined as unknown as ITokensManager,
    oracleManager: undefined as unknown as IOracleManager,
    swapManager: undefined as unknown as ISwapManager,
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
    addressBookManager: undefined as unknown as IAddressBookManager,
    provider: undefined as unknown as PublicClient,
    tokensManager: undefined as unknown as ITokensManager,
    oracleManager: undefined as unknown as IOracleManager,
    swapManager: undefined as unknown as ISwapManager,
  } as IProtocolPluginContext

  return new ProtocolPluginsRegistry({
    plugins: {
      [ProtocolName.Maker]: MakerProtocolPlugin,
      [ProtocolName.Spark]: SparkProtocolPlugin,
    },
    context: protocolPluginContext,
  })
}
