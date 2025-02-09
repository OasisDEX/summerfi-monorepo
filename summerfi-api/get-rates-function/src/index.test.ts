import { describe, it, expect, vi } from 'vitest'
import { handler } from './index'
import { getAllClients } from '@summerfi/summer-earn-rates-subgraph'

// Mock the getAllClients function
vi.mock('@summerfi/summer-earn-rates-subgraph', () => ({
  getAllClients: vi.fn().mockReturnValue({
    '1-test-product': {
      GetArkRates: vi.fn().mockResolvedValue({ rates: [] }),
      GetInterestRates: vi.fn().mockResolvedValue({ rates: [] }),
    },
  }),
}))

describe('rates handler', () => {
  it('should handle rates request', async () => {
    const event = {
      requestContext: {
        http: {
          path: '/api/rates/1',
        },
      },
      pathParameters: {
        chainId: '1',
      },
      queryStringParameters: {
        productId: 'test-product',
      },
    } as any

    const response = await handler(event)
    expect(response.statusCode).toBe(200)
  })

  it('should handle historical rates request', async () => {
    const event = {
      requestContext: {
        http: {
          path: '/api/historicalRates/1',
        },
      },
      pathParameters: {
        chainId: '1',
      },
      queryStringParameters: {
        productId: 'test-product',
      },
    } as any

    const response = await handler(event)
    expect(response.statusCode).toBe(200)
  })

  it('should handle missing chainId', async () => {
    const event = {
      requestContext: {
        http: {
          path: '/api/rates',
        },
      },
      queryStringParameters: {
        productId: 'test-product',
      },
    } as any

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({ error: 'chainId is required' })
  })

  it('should handle missing productId', async () => {
    const event = {
      requestContext: {
        http: {
          path: '/api/rates/1',
        },
      },
      pathParameters: {
        chainId: '1',
      },
      queryStringParameters: {},
    } as any

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({ error: 'productId is required' })
  })

  it('should handle invalid chainId-productId combination', async () => {
    const event = {
      requestContext: {
        http: {
          path: '/api/rates/999',
        },
      },
      pathParameters: {
        chainId: '999',
      },
      queryStringParameters: {
        productId: 'invalid-product',
      },
    } as any

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({ error: 'Invalid chainId or productId combination' })
  })

  it('should handle invalid endpoint', async () => {
    const event = {
      requestContext: {
        http: {
          path: '/api/invalid/1',
        },
      },
      pathParameters: {
        chainId: '1',
      },
      queryStringParameters: {
        productId: 'test-product',
      },
    } as any

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({ error: 'Invalid endpoint' })
  })
})
