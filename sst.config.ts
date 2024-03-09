import { SSTConfig } from 'sst'
import { API } from './stacks/summer-stack'
import { ExternalAPI } from './stacks/partners-stack'

const availableStage = ['dev', 'feature', 'staging', 'production']

export const sstConfig: SSTConfig = {
  config(_input) {
    if (_input.stage === undefined && process.env.SST_USER === undefined) {
      throw new Error('Please specify stage or set SST_USER env variable')
    }
    if (
      _input.stage &&
      !availableStage.includes(_input.stage) &&
      !_input.stage.startsWith('dev-')
    ) {
      throw new Error('Invalid stage, use one of: ' + availableStage.join(', '))
    }
    const stage = _input.stage ?? `dev-${process.env.SST_USER}`
    return {
      name: `summerfi-stack`,
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
      stage: stage,
    }
  },
  stacks(app) {
    if (app.stage !== 'production' && app.stage !== 'staging') {
      app.setDefaultRemovalPolicy('destroy')
    }
    app.stack(API)
    app.stack(ExternalAPI)
  },
}

export default sstConfig
