import {
  type CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
  type UserType,
} from '@aws-sdk/client-cognito-identity-provider'

// Cognito ListUsers Filter values are wrapped in double quotes; escape backslashes and quotes so a
// user-supplied value (e.g. an email) can't break out of the filter clause and match a different
// user than intended.
export const escapeCognitoFilterValue = (value: string): string =>
  value.replace(/\\/gu, '\\\\').replace(/"/gu, '\\"')

export const getAllUsersInGroup = async (
  cognitoAdminClient: CognitoIdentityProviderClient,
  userPoolId: string,
  groupName: string,
) => {
  let allUsers: UserType[] = []
  let nextToken: string | undefined

  do {
    const response = await cognitoAdminClient.send(
      new ListUsersInGroupCommand({
        UserPoolId: userPoolId,
        GroupName: groupName,
        ...(nextToken && { NextToken: nextToken }),
      }),
    )

    allUsers = [...allUsers, ...(response.Users ?? [])]
    nextToken = response.NextToken
  } while (nextToken)

  return allUsers
}
