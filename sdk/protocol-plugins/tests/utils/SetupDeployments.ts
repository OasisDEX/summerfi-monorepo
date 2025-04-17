import { IChainInfo } from '@summerfi/sdk-common'
import { AddressBookManagerMock } from '@summerfi/testing-utils'

export function SetupDeployments(
  chainInfo: IChainInfo,
  addressBookManager: AddressBookManagerMock,
) {
  addressBookManager.setAddressByName({
    chainInfo,
    name: 'Swap',
    address: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'OperationExecutor',
    address: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'MCD_JOIN_DAI',
    address: '0x9759A6Ac90977b93B58547b4A71c78317f391A28',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'MCD_JOIN_ETH_A',
    address: '0x2F0b23f53734252Bda2277357e97e1517d6B042A',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'MorphoBlue',
    address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'Dog',
    address: '0x135954d155898D42C90D2a57824C690e0c7BEf1B',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'Vat',
    address: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'Spot',
    address: '0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'McdJug',
    address: '0x19c0976f590D67707E62397C87829d896Dc0f1F1',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'IlkRegistry',
    address: '0x5a464C28D19848f44199D003BeF5ecc87d090F87',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'Oracle',
    address: '0x54586bE62E3c3580375aE3723C145253060Ca0C2',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'PoolDataProvider',
    address: '0x41393e5e337606dc3821075Af65AeE84D7688CBD',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'SparkLendingPool',
    address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'SparkOracle',
    address: '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9',
  })

  addressBookManager.setAddressByName({
    chainInfo,
    name: 'SparkDataProvider',
    address: '0xFc21d6d146E6086B8359705C8b28512a983db0cb',
  })
}
