/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { ConfigurationProvider, IConfigurationProvider } from '@summerfi/configuration-provider'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { SwapManagerFactory } from '@summerfi/swap-service'
import { ITokensManager } from '@summerfi/tokens-common'
import { TokensManagerFactory } from '@summerfi/tokens-service'
import { IOracleManager } from '@summerfi/oracle-common'
import { OracleManagerFactory } from '@summerfi/oracle-service'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { AddressBookManagerFactory } from '@summerfi/address-book-service'
import { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { EarnProtocolManagerFactory } from '@summerfi/earn-protocol-service'

export type EarnProtocolContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type EarnProtocolAppContext = {
  configProvider: IConfigurationProvider
  addressBookManager: IAddressBookManager
  tokensManager: ITokensManager
  swapManager: ISwapManager
  oracleManager: IOracleManager
  earnProtocolManager: IEarnProtocolManager
}

// context for each request
export const createEarnProtocolContext = (
  opts: EarnProtocolContextOptions,
): EarnProtocolAppContext => {
  const configProvider = new ConfigurationProvider()
  const addressBookManager = AddressBookManagerFactory.newAddressBookManager({ configProvider })
  const tokensManager = TokensManagerFactory.newTokensManager({ configProvider })
  const swapManager = SwapManagerFactory.newSwapManager({ configProvider })
  const oracleManager = OracleManagerFactory.newOracleManager({ configProvider })
  const earnProtocolManager = EarnProtocolManagerFactory.newEarnProtocolManager({ configProvider })

  return {
    configProvider,
    addressBookManager,
    tokensManager,
    swapManager,
    oracleManager,
    earnProtocolManager,
  }
}
