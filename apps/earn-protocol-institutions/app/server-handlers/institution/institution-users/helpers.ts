import {
  type CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
  type UserType,
} from '@aws-sdk/client-cognito-identity-provider'

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
