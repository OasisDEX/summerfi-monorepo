import { ChainIds } from '@summerfi/sdk-common'
import type { ArmadaMigrationConfig } from './types'
// c tokens taken from: https://docs.compound.finance/#networks
export const compoundConfigsByChainId: Record<number, Record<string, ArmadaMigrationConfig>> = {
  [ChainIds.Base]: {
    usdc: {
      positionAddress: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: '0c8567f8-ba5b-41ad-80de-00a71895eb19',
    },
    usdbc: {
      positionAddress: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
      underlyingToken: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
      pool: 'df65c4f4-e33a-481c-bac8-0c2252867c93',
    },
    weth: {
      positionAddress: '0x46e6b214b524310239732D51387075E0e70970bf',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: '7993b97d-12c3-4a36-b6b6-5b37bac4f8ae',
    },
    aero: {
      positionAddress: '0x784efeB622244d2348d4F2522f8860B96fbEcE89',
      underlyingToken: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
      pool: null,
    },
  },
  [ChainIds.Mainnet]: {
    usdc: {
      positionAddress: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
      underlyingToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      pool: '7da72d09-56ca-4ec5-a45f-59114353e487',
    },
    weth: {
      positionAddress: '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
      underlyingToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      pool: '85c57261-b75b-4447-a115-d79b1a7de8ed',
    },
    usdt: {
      positionAddress: '0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840',
      underlyingToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      pool: 'f4d5b566-e815-4ca2-bb07-7bcd8bc797f1',
    },
    wsteth: {
      positionAddress: '0x3D0bb1ccaB520A66e607822fC55BC921738fAFE3',
      underlyingToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      pool: null,
    },
    usds: {
      positionAddress: '0x5D409e56D886231aDAf00c8775665AD0f9897b56',
      underlyingToken: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
      pool: null,
    },
  },
  [ChainIds.ArbitrumOne]: {
    usdce: {
      positionAddress: '0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA',
      underlyingToken: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      pool: '643e883f-6922-4c89-82c3-bf3ac260fe1f',
    },
    usdc: {
      positionAddress: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
      underlyingToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      pool: 'd9c395b9-00d0-4426-a6b3-572a6dd68e54',
    },
    weth: {
      positionAddress: '0x6f7D514bbD4aFf3BcD1140B7344b32f063dEe486',
      underlyingToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      pool: 'be3d7cb9-f008-4050-8802-13ea505bcbdf',
    },
    usdt: {
      positionAddress: '0xd98Be00b5D27fc98112BdE293e487f8D4cA57d07',
      underlyingToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      pool: '85247b13-8180-44e7-b38c-4d324cc68a92',
    },
  },
}
