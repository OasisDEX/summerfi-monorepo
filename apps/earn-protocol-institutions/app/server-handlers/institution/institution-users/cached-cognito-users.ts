import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { unstable_cache as unstableCache } from 'next/cache'

import { getAllUsersInGroup } from '@/app/server-handlers/institution/institution-users/helpers'
import { INSTITUTIONS_CACHE_TAGS } from '@/constants/revalidation'
import { COGNITO_USER_POOL_REGION } from '@/features/auth/constants'

export type CognitoGroupUser = {
  username?: string
  sub?: string
  email?: string
  name?: string
}

export const cognitoGroupTag = (groupName: string) =>
  `${INSTITUTIONS_CACHE_TAGS.INSTITUTION_INTERNAL_USERS}-${groupName}`

const fetchCognitoGroupUsers = async (groupName: string): Promise<CognitoGroupUser[]> => {
  const accessKeyId = process.env.INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY
  const secretAccessKey = process.env.INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY
  const userPoolId = process.env.INSTITUTIONS_COGNITO_USER_POOL_ID

  if (!userPoolId) throw new Error('INSTITUTIONS_COGNITO_USER_POOL_ID is not set')
  if (!accessKeyId || !secretAccessKey) throw new Error('Cognito admin credentials are not set')

  const client = new CognitoIdentityProviderClient({
    region: COGNITO_USER_POOL_REGION,
    credentials: { accessKeyId, secretAccessKey },
  })

  try {
    const users = await getAllUsersInGroup(client, userPoolId, groupName)

    // Normalise to a plain, serialisable shape (no Date fields) so it caches cleanly.
    return users.map((user) => ({
      username: user.Username,
      sub: user.Attributes?.find((attr) => attr.Name === 'sub')?.Value,
      email: user.Attributes?.find((attr) => attr.Name === 'email')?.Value,
      name: user.Attributes?.find((attr) => attr.Name === 'name')?.Value,
    }))
  } finally {
    client.destroy()
  }
}

// The full paged Cognito group scan is identical regardless of which institution is viewing it and
// is expensive (it pages the entire group on every call). Cache it by group name with a short TTL +
// a tag so the read paths stop re-scanning on every navigation and user mutations can invalidate it.
export const getCachedCognitoGroupUsers = (groupName: string): Promise<CognitoGroupUser[]> =>
  unstableCache(fetchCognitoGroupUsers, ['cognito-group-users', groupName], {
    revalidate: 60,
    tags: [cognitoGroupTag(groupName)],
  })(groupName)
