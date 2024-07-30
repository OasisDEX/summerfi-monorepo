import { SSTConfig } from 'sst'
import { NextjsSite } from 'sst/constructs'

export default {
  config(_input) {
    return {
      name: 'earn-protocol-dashboard',
      region: `${process.env.AWS_REGION}`,
      profile: `${process.env.AWS_PROFILE}`,
    }
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const EPdashboard = new NextjsSite(stack, 'earn-protocol-dashboard')

      stack.addOutputs({
        SiteUrl: EPdashboard.url,
      })
    })
  },
} satisfies SSTConfig
