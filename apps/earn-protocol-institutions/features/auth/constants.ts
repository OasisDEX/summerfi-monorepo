import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export const COGNITO_USER_POOL_REGION = 'eu-central-1'

export const cognitoClient = new CognitoIdentityProviderClient({
  region: COGNITO_USER_POOL_REGION,
})
