import { type Address, InstitutionRoles } from '@summerfi/app-types'

import { type InstitutionData } from '@/types/institution-data'

const dummyRoles: {
  [key in InstitutionRoles]: {
    address: Address
    lastUpdated: number
  }
} = {
  [InstitutionRoles.GENERAL_ADMIN]: {
    address: '0x0000000000000000000000000000000000000123',
    lastUpdated: 1725689600000,
  },
  [InstitutionRoles.RISK_MANAGER]: {
    address: '0x0000000000000000000000000000000000000456',
    lastUpdated: 1735689600000,
  },
  [InstitutionRoles.MARKET_ALLOCATOR]: {
    address: '0x0000000000000000000000000000000000000789',
    lastUpdated: 1745689600000,
  },
}

export const institutionsMockList: InstitutionData[] = [
  {
    id: 'acme-crypto-corp',
    institutionName: 'ACME Crypto Corp.',
    totalValue: 2225000000,
    numberOfVaults: 4,
    thirtyDayAvgApy: 0.078,
    allTimePerformance: 0.0112,
    vaultsData: [
      {
        name: 'USDC-1',
        asset: 'USDC',
        nav: 1.153,
        aum: 1792000000,
        fee: 0.005,
        inception: 1735689600000,
        roles: dummyRoles,
      },
      {
        name: 'USDC-2',
        asset: 'USDC',
        nav: 1.253,
        aum: 1692000000,
        fee: 0.004,
        inception: 1725689600000,
        roles: dummyRoles,
      },
    ],
  },
  {
    id: 'nova-chain-labs',
    institutionName: 'Nova Chain Labs',
    totalValue: 3100000000,
    numberOfVaults: 5,
    thirtyDayAvgApy: 0.083,
    allTimePerformance: 0.0145,
    vaultsData: [
      {
        name: 'USDT-Prime',
        asset: 'USDT',
        nav: 1.087,
        aum: 2200000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
      },
      {
        name: 'USDT-2',
        asset: 'USDT',
        nav: 1.087,
        aum: 2200000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
      },
    ],
  },
  {
    id: 'zenith-block-inc',
    institutionName: 'Zenith Block Inc.',
    totalValue: 1975000000,
    numberOfVaults: 3,
    thirtyDayAvgApy: 0.074,
    allTimePerformance: 0.0101,
    vaultsData: [
      {
        name: 'DAI-Stable',
        asset: 'DAI',
        nav: 1.021,
        aum: 1450000000,
        fee: 0.003,
        inception: 1735689600000,
        roles: dummyRoles,
      },
      {
        name: 'DAI-2',
        asset: 'DAI',
        nav: 1.021,
        aum: 1450000000,
        fee: 0.003,
        inception: 1735689600000,
        roles: dummyRoles,
      },
    ],
  },
  {
    id: 'quantum-crypto-holdings',
    institutionName: 'Quantum Crypto Holdings',
    totalValue: 4120000000,
    numberOfVaults: 6,
    thirtyDayAvgApy: 0.091,
    allTimePerformance: 0.0178,
    vaultsData: [
      {
        name: 'ETH-Growth',
        asset: 'ETH',
        nav: 2.45,
        aum: 2750000000,
        fee: 0.007,
        inception: 1735689600000,
        roles: dummyRoles,
      },
      {
        name: 'ETH-2',
        asset: 'ETH',
        nav: 2.45,
        aum: 2750000000,
        fee: 0.007,
        inception: 1735689600000,
        roles: dummyRoles,
      },
    ],
  },
  {
    id: 'orbit-ledger-group',
    institutionName: 'Orbit Ledger Group',
    totalValue: 1680000000,
    numberOfVaults: 2,
    thirtyDayAvgApy: 0.062,
    allTimePerformance: 0.0084,
    vaultsData: [
      {
        name: 'WBTC-Core',
        asset: 'WBTC',
        nav: 1.998,
        aum: 1320000000,
        fee: 0.006,
        inception: 1735689600000,
        roles: dummyRoles,
      },
      {
        name: 'FRAX-2',
        asset: 'FRAX',
        nav: 1.112,
        aum: 2020000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
      },
    ],
  },
  {
    id: 'aether-token-systems',
    institutionName: 'Aether Token Systems',
    totalValue: 2890000000,
    numberOfVaults: 4,
    thirtyDayAvgApy: 0.079,
    allTimePerformance: 0.0129,
    vaultsData: [
      {
        name: 'FRAX-Yield',
        asset: 'FRAX',
        nav: 1.112,
        aum: 2020000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
      },
      {
        name: 'FRAX-2',
        asset: 'FRAX',
        nav: 1.112,
        aum: 2020000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
      },
    ],
  },
]
