import { getSdk } from '../generated/client'

export interface PaginatedResult<T> {
  roles: T[]
}

export interface PaginationParams {
  lastID?: string
}

/**
 * Generic pagination helper for role queries
 * @param queryFn - The GraphQL query function to execute
 * @param params - Parameters for the query (excluding lastID)
 * @param client - The GraphQL client
 * @returns Array of all paginated results
 */
export async function paginateRoles<TParams, TResult extends PaginatedResult<any>>(
  queryFn: (
    client: ReturnType<typeof getSdk>,
    params: TParams & { lastID: string },
  ) => Promise<TResult>,
  params: TParams,
  client: ReturnType<typeof getSdk>,
): Promise<TResult['roles']> {
  const allRoles: TResult['roles'] = []
  let lastID = ''

  while (true) {
    const result = await queryFn(client, { ...params, lastID } as TParams & { lastID: string })

    if (result.roles.length === 0) {
      break
    }

    allRoles.push(...result.roles)

    // If we got less than 1000 results, we've reached the end
    if (result.roles.length < 1000) {
      break
    }

    // Set lastID for next iteration
    lastID = result.roles[result.roles.length - 1].id
  }

  return allRoles
}
