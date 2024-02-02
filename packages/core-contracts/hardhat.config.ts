import dotenv from 'dotenv'
import { resolve } from 'path'

// WARNING: Do not move the loading of the .env as the import for `getHardhatConfig`
// needs the variables to be preloaded
dotenv.config({ path: resolve(__dirname, './.env') })

import { HardhatUserConfig } from 'hardhat/config'
import { getHardhatConfig } from '@summerfi/hardhat-utils'

// import './tasks/deploy'
// import './tasks/create-position'
// import './tasks/proxy'
// import './tasks/verify-earn'
// import './tasks/transfer-erc20'
// import './tasks/get-tokens'
// import './tasks/read-erc20-balance'
// import './tasks/user-dpm-proxies'
// import './tasks/transfer-dpm'
// import './tasks/deploy-ajna'
// import './tasks/get-hashes'
// import './tasks/verify-deployment'
// import './tasks/verify-operations'
// import './tasks/generate-op-tuple'
// import './tasks/get-action-name'
// import './tasks/service-registry'
// import './tasks/operations-registry'
// import './tasks/ownership-tool'
// import './tasks/validate-multisig-tx'
// import './tasks/refinance/list'
// import './tasks/refinance/get-definition'

const userConfig: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.4.21',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
      {
        version: '0.4.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
      {
        version: '0.5.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
      {
        version: '0.8.15',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
    ],
  },
}

export default getHardhatConfig(userConfig)
