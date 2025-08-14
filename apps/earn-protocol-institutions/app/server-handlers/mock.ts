import { type Address } from '@summerfi/app-types'
import { GeneralRoles } from '@summerfi/sdk-client'

import { type InstitutionData } from '@/types/institution-data'

const dummyRoles: {
  [key in GeneralRoles]: {
    address: Address
    lastUpdated: number
  }
} = {
  [GeneralRoles.ADMIRALS_QUARTERS_ROLE]: {
    address: '0x0000000000000000000000000000000000000123',
    lastUpdated: 1725689600000,
  },
  [GeneralRoles.DECAY_CONTROLLER_ROLE]: {
    address: '0x0000000000000000000000000000000000000456',
    lastUpdated: 1735689600000,
  },
  [GeneralRoles.GOVERNOR_ROLE]: {
    address: '0x0000000000000000000000000000000000000789',
    lastUpdated: 1745689600000,
  },
  [GeneralRoles.SUPER_KEEPER_ROLE]: {
    address: '0x0000000000000000000000000000000000000789',
    lastUpdated: 1745689600000,
  },
}

const dummyThirdPartyCosts = [
  {
    type: 'Summer.fi Fee',
    fee: 0.001,
    address: '0x1234567890123456789012345678901234567890' as Address,
  },
  {
    type: '3rd Party Risk Manager',
    fee: 0.001,
    address: '0x1234567890123456789012345678901234567890' as Address,
  },
]

const dummyFeeRevenueHistory = [
  { monthYear: 'January 2025', income: 100, expense: 123, revenue: 100 },
  { monthYear: 'February 2025', income: 100, expense: 123, revenue: 100 },
  { monthYear: 'March 2025', income: 100, expense: 123, revenue: 100 },
]

const dummyFeeRevenue = [{ name: 'Vult AUM Fee', aumFee: 0.001 }]

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
        id: 'acme-usdc-vault',
        name: 'ACME USDC Prime',
        asset: 'USDC',
        nav: 1.153,
        aum: 1792000000,
        fee: 0.005,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
      {
        id: 'acme-usdc-vault-2',
        name: 'ACME USDC Secondary',
        asset: 'USDC',
        nav: 1.253,
        aum: 1692000000,
        fee: 0.004,
        inception: 1725689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
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
        id: 'nova-usdt-vault',
        name: 'Nova USDT Prime',
        asset: 'USDT',
        nav: 1.087,
        aum: 2200000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
      {
        id: 'nova-usdt-vault-2',
        name: 'Nova USDT Growth',
        asset: 'USDT',
        nav: 1.087,
        aum: 2200000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
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
        id: 'zenith-dai-stable',
        name: 'Zenith DAI Stable',
        asset: 'DAI',
        nav: 1.021,
        aum: 1450000000,
        fee: 0.003,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
      {
        id: 'zenith-dai-2',
        name: 'Zenith DAI Alpha',
        asset: 'DAI',
        nav: 1.021,
        aum: 1450000000,
        fee: 0.003,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
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
        id: 'quantum-eth-growth',
        name: 'Quantum ETH Growth',
        asset: 'ETH',
        nav: 2.45,
        aum: 2750000000,
        fee: 0.007,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
      {
        id: 'quantum-eth-2',
        name: 'Quantum ETH Yield',
        asset: 'ETH',
        nav: 2.45,
        aum: 2750000000,
        fee: 0.007,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
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
        id: 'orbit-wbtc-core',
        name: 'Orbit WBTC Core',
        asset: 'WBTC',
        nav: 1.998,
        aum: 1320000000,
        fee: 0.006,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
      {
        id: 'orbit-frax-2',
        name: 'Orbit FRAX Stable',
        asset: 'FRAX',
        nav: 1.112,
        aum: 2020000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
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
        id: 'aether-frax-yield',
        name: 'Aether FRAX Yield',
        asset: 'FRAX',
        nav: 1.112,
        aum: 2020000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
      {
        id: 'aether-frax-2',
        name: 'Aether FRAX Enhanced',
        asset: 'FRAX',
        nav: 1.112,
        aum: 2020000000,
        fee: 0.004,
        inception: 1735689600000,
        roles: dummyRoles,
        thirdPartyCosts: dummyThirdPartyCosts,
        feeRevenueHistory: dummyFeeRevenueHistory,
        feeRevenue: dummyFeeRevenue,
      },
    ],
  },
]
