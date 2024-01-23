import { SSTConfig } from 'sst'
import { API } from './stacks/triggers-stack'

export const sstConfig: SSTConfig = {
  config(_input) {
    // if (!['dev', 'staging', 'production'].includes(_input.stage ?? '')) {
    //   throw new Error('Invalid stage')
    // }
    return {
      name: 'summerfi-api',
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
      stage: `${_input.stage}`,
    }
  },
  stacks(app) {
    app.stack(API)
  },
}

export default sstConfig
