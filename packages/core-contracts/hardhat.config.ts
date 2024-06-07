import { default as dotenv } from 'dotenv'
import { resolve } from 'path'

// WARNING: Do not move the loading of the .env as the import for `getHardhatConfig`
// needs the variables to be preloaded
dotenv.config({ path: resolve(__dirname, './.env') })

import { HardhatUserConfig } from 'hardhat/config'
import { getHardhatConfig } from '@summerfi/hardhat-utils'

const userConfig: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.25',
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
