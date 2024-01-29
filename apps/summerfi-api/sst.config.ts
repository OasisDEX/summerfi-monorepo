import { SSTConfig } from 'sst'
import { API } from './stacks/summer-stack'

export const sstConfig: SSTConfig = {
  config(_input) {
    if (!['', 'feature', 'staging', 'production'].includes(_input.stage ?? '')) {
      throw new Error('Invalid stage')
    }
    return {
      name: 'summerfi-stack',
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
      stage: `${_input.stage ?? 'dev'}`,
    }
  },
  stacks(app) {
    if (app.stage !== 'production' && app.stage !== 'staging') {
      app.setDefaultRemovalPolicy('destroy')
    }
    app.stack(API)
  },
}

export default sstConfig
