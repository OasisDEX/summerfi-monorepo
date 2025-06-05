// Mock graphql-request to avoid ES module issues
jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
  gql: jest.fn((strings) => strings[0]),
}))

// Mock database pool
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: jest.fn(),
    end: jest.fn(),
  })),
}))
