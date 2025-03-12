import { ChainFamilyMap } from '@summerfi/sdk-common'
import type { ArmadaMigrationConfig } from './types'

// a tokens taken from: https://aave.com/docs/resources/addresses
export const aaveV3ConfigsByChainId: Record<number, Record<string, ArmadaMigrationConfig>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    weth: {
      positionAddress: '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7',
      underlyingToken: '0x4200000000000000000000000000000000000006',
      pool: '23405eee-97e7-4b8e-8625-19c3a36047e8',
    },
    cbeth: {
      positionAddress: '0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad',
      underlyingToken: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
      pool: '54470a44-22f4-4508-bbbb-2d8e2770ab77',
    },
    usdbc: {
      positionAddress: '0x0a1d576f3eFeF75b330424287a95A366e8281D54',
      underlyingToken: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
      pool: '833ec61b-f9e6-46ac-9eff-2785808b2389',
    },
    wstETH: {
      positionAddress: '0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D',
      underlyingToken: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
      pool: '361f0a3c-6adb-4b1c-bf35-f9cd79f2341c',
    },
    usdc: {
      positionAddress: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB',
      underlyingToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      pool: '7e0661bf-8cf3-45e6-9424-31916d4c7b84',
    },
    weETH: {
      positionAddress: '0x7C307e128efA31F540F2E2d976C995E0B65F51F6',
      underlyingToken: '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A',
      pool: 'f0131970-afac-4835-b22c-520f192e01d5',
    },
    cbBTC: {
      positionAddress: '0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6',
      underlyingToken: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
      pool: '89bc7c4c-d71c-435c-ab28-56c803d51320',
    },
    ezETH: {
      positionAddress: '0xDD5745756C2de109183c6B5bB886F9207bEF114D',
      underlyingToken: '0x2416092f143378750bb29b79eD961ab195CcEea5',
      pool: '409b75a5-62ec-4067-a32a-e372b2917fac',
    },
  },
  [ChainFamilyMap.Ethereum.Mainnet.chainId]: {
    // WETH https://etherscan.io/address/0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    weth: {
      positionAddress: '0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8',
      underlyingToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      pool: 'e880e828-ca59-4ec6-8d4f-27182a4dc23d',
    },
    // wstETH https://etherscan.io/address/0x0B925eD163218f6662a35e0f0371Ac234f9E9371 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0
    wsteth: {
      positionAddress: '0x0B925eD163218f6662a35e0f0371Ac234f9E9371',
      underlyingToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      pool: 'd541708e-1283-4feb-bc7a-457fc5f8db2c',
    },
    // WBTC https://etherscan.io/address/0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599
    wbtc: {
      positionAddress: '0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8',
      underlyingToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      pool: '7e382157-b1bc-406d-b17b-facba43b716e',
    },
    // USDC https://etherscan.io/address/0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
    usdc: {
      positionAddress: '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c',
      underlyingToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      pool: 'aa70268e-4b52-42bf-a116-608b370f9501',
    },
    // DAI https://etherscan.io/address/0x018008bfb33d285247A21d44E50697654f754e63 0x6B175474E89094C44Da98b954EedeAC495271d0F
    dai: {
      positionAddress: '0x018008bfb33d285247A21d44E50697654f754e63',
      underlyingToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      pool: '3665ee7e-6c5d-49d9-abb7-c47ab5d9d4ac',
    },
    // cbETH https://etherscan.io/address/0x977b6fc5dE62598B08C85AC8Cf2b745874E8b78c 0xBe9895146f7AF43049ca1c1AE358B0541Ea49704
    cbeth: {
      positionAddress: '0x977b6fc5dE62598B08C85AC8Cf2b745874E8b78c',
      underlyingToken: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
      pool: 'fdf02dc0-c38d-4850-8d61-74668d281325',
    },
    // USDT https://etherscan.io/address/0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a 0xdAC17F958D2ee523a2206206994597C13D831ec7
    usdt: {
      positionAddress: '0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a',
      underlyingToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      pool: 'f981a304-bb6c-45b8-b0c5-fd2f515ad23a',
    },
    // rETH https://etherscan.io/address/0xCc9EE9483f662091a1de4795249E24aC0aC2630f 0xae78736Cd615f374D3085123A210448E74Fc6393
    reth: {
      positionAddress: '0xCc9EE9483f662091a1de4795249E24aC0aC2630f',
      underlyingToken: '0xae78736Cd615f374D3085123A210448E74Fc6393',
      pool: 'f1a22245-a1f1-4389-8ff2-dde4914b272d',
    },
    // MKR https://etherscan.io/address/0x8A458A9dc9048e005d22849F470891b840296619
    mkr: {
      positionAddress: '0x8A458A9dc9048e005d22849F470891b840296619',
      underlyingToken: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      pool: 'c5af4fbd-932d-40c5-8ee4-6b45ee691b76',
    },
    // GHO https://etherscan.io/address/0x00907f9921424583e7ffBfEdf84F92B7B2Be4977 0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f
    gho: {
      positionAddress: '0x00907f9921424583e7ffBfEdf84F92B7B2Be4977',
      underlyingToken: '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f',
      pool: '1e00ac2b-0c3c-4b1f-95be-9378f98d2b40',
    },
    // sDAI https://etherscan.io/address/0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c 0x83F20F44975D03b1b09e64809B757c47f942BEeA
    sdai: {
      positionAddress: '0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c',
      underlyingToken: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
      pool: 'a214e900-2bcd-431f-9744-632fa5436fee',
    },
    // weETH https://etherscan.io/address/0xBdfa7b7893081B35Fb54027489e2Bc7A38275129 0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee
    weeth: {
      positionAddress: '0xBdfa7b7893081B35Fb54027489e2Bc7A38275129',
      underlyingToken: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
      pool: '1a1780eb-febf-4083-8788-b9aca19da68e',
    },
    // USDe https://etherscan.io/address/0x4F5923Fc5FD4a93352581b38B7cD26943012DECF 0x4c9EDD5852cd905f086C759E8383e09bff1E68B3
    usde: {
      positionAddress: '0x4F5923Fc5FD4a93352581b38B7cD26943012DECF',
      underlyingToken: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
      pool: '21e1ac8a-b3aa-4576-9506-0b40137721a0',
    },
    // USDS https://etherscan.io/address/0x32a6268f9Ba3642Dda7892aDd74f1D34469A4259 0xdC035D45d973E3EC169d2276DDab16f1e407384F
    usds: {
      positionAddress: '0x32a6268f9Ba3642Dda7892aDd74f1D34469A4259',
      underlyingToken: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
      pool: 'e65588a1-27ad-4e20-9232-68a6cfaccf63',
    },
    // rsETH https://etherscan.io/address/0x2D62109243b87C4bA3EE7bA1D91B0dD0A074d7b1 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7
    rseth: {
      positionAddress: '0x2D62109243b87C4bA3EE7bA1D91B0dD0A074d7b1',
      underlyingToken: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
      pool: '45d6af39-ed10-4002-8b4b-e5da908bdb75',
    },
  },
  [ChainFamilyMap.Arbitrum.ArbitrumOne.chainId]: {
    // DAI https://arbiscan.io/address/0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1
    dai: {
      positionAddress: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
      underlyingToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      pool: 'a8e3d841-2788-4647-ad54-5a36fac451b1',
    },
    // USDCe https://arbiscan.io/address/0x625E7708f30cA75bfd92586e17077590C60eb4cD 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8
    usdce: {
      positionAddress: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
      underlyingToken: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      pool: '7aab7b0f-01c1-4467-bc0d-77826d870f19',
    },
    // WBTC https://arbiscan.io/address/0x078f358208685046a11C85e8ad32895DED33A249 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f
    wbtc: {
      positionAddress: '0x078f358208685046a11C85e8ad32895DED33A249',
      underlyingToken: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      pool: '7c5e69a4-2430-4fa2-b7cb-857f79d7d1bf',
    },
    // WETH https://arbiscan.io/address/0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
    weth: {
      positionAddress: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
      underlyingToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      pool: 'e302de4d-952e-4e18-9749-0a9dc86e98bc',
    },
    // USDT https://arbiscan.io/address/0x6ab707Aca953eDAeFBc4fD23bA73294241490620 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9
    usdt: {
      positionAddress: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
      underlyingToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      pool: '3a6cc030-738d-4e19-8a40-e63e9c4d5a6f',
    },
    // wstETH https://arbiscan.io/address/0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf 0x5979D7b546E38E414F7E9822514be443A4800529
    wsteth: {
      positionAddress: '0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf',
      underlyingToken: '0x5979D7b546E38E414F7E9822514be443A4800529',
      pool: 'e62bcb01-ed4c-4ec9-8cfa-e86e7ccf7688',
    },
    // rETH https://arbiscan.io/address/0x8Eb270e296023E9D92081fdF967dDd7878724424 0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8
    reth: {
      positionAddress: '0x8Eb270e296023E9D92081fdF967dDd7878724424',
      underlyingToken: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
      pool: 'd4cdd2fb-54bd-40fe-8093-e691ea0b291a',
    },
    // USDC https://arbiscan.io/address/0x724dc807b04555b71ed48a6896b6F41593b8C637 0xaf88d065e77c8cC2239327C5EDb3A432268e5831
    usdc: {
      positionAddress: '0x724dc807b04555b71ed48a6896b6F41593b8C637',
      underlyingToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      pool: 'd9fa8e14-0447-4207-9ae8-7810199dfa1f',
    },
    // weETH https://arbiscan.io/address/0x8437d7C167dFB82ED4Cb79CD44B7a32A1dd95c77 0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe
    weeth: {
      positionAddress: '0x8437d7C167dFB82ED4Cb79CD44B7a32A1dd95c77',
      underlyingToken: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
      pool: '3df9ffeb-8c72-438c-a9ae-026488d8f2b2',
    },
    // ezETH https://arbiscan.io/address/0xEA1132120ddcDDA2F119e99Fa7A27a0d036F7Ac9 0x2416092f143378750bb29b79eD961ab195CcEea5
    ezeth: {
      positionAddress: '0xEA1132120ddcDDA2F119e99Fa7A27a0d036F7Ac9',
      underlyingToken: '0x2416092f143378750bb29b79eD961ab195CcEea5',
      pool: '21320dfc-69d0-40c7-a224-7bead1fb576e',
    },
  },
}
