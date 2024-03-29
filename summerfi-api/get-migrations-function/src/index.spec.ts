import { ProtocolId } from '@summerfi/serverless-shared/domain-types'
import { serialize } from '@summerfi/serverless-shared/serialize'
import { handler } from './index'
import { APIGatewayProxyEventV2, Context } from 'aws-lambda'
import dotenv from 'dotenv'

dotenv.config({ path: '../../../.env' })

describe('handler', () => {
  it.skip('should run handler sucessfully', async () => {
    const ev: Partial<APIGatewayProxyEventV2> = {
      queryStringParameters: {
        address: '0x275f568287595D30E216b618da37897f4bbaB1B6',
      },
      stageVariables: {
        RPC_GATEWAY: process.env.RPC_GATEWAY,
      },
    }

    const result = (await handler(ev as APIGatewayProxyEventV2, {} as Context)) as unknown as {
      headers: Record<string, string>
      statusCode: number
      body: string
    }

    const expected = {
      headers: { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
      statusCode: 200,
      body: serialize({
        migrations: [
          {
            chainId: 'sepolia',
            protocolId: ProtocolId.AAVE3,
            debtAsset: {
              symbol: 'USDC',
              balanceDecimals: 6n,
              price: 100000000n,
              priceDecimals: 8n,
              usdValue: 55008.759919,
            },
            collateralAsset: {
              symbol: 'WBTC',
              balanceDecimals: 8n,
              price: 6000000000000n,
              priceDecimals: 8n,
              usdValue: 90000.0006,
            },
          },
        ],
      }),
    }

    expect(result.headers).toEqual(expected.headers)
    expect(result.statusCode).toEqual(expected.statusCode)
    expect(result.body).toMatch(/"migrations":/)
  })

  it('should handle missing address', async () => {
    const ev: Partial<APIGatewayProxyEventV2> = {
      queryStringParameters: {},
      stageVariables: {
        RPC_GATEWAY: process.env.RPC_GATEWAY,
      },
    }

    const result = (await handler(ev as APIGatewayProxyEventV2, {} as Context)) as unknown as {
      headers: Record<string, string>
      statusCode: number
      body: string
    }

    const expected = {
      headers: { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
      statusCode: 400,
      body: serialize({}),
    }

    expect(result.headers).toEqual(expected.headers)
    expect(result.statusCode).toEqual(expected.statusCode)
    expect(JSON.parse(result.body).message).toMatch(/"message": "Invalid address format"/)
  })

  it('should handle invalid address', async () => {
    const ev: Partial<APIGatewayProxyEventV2> = {
      queryStringParameters: {
        address: 'shts',
      },
      stageVariables: {
        RPC_GATEWAY: process.env.RPC_GATEWAY,
      },
    }

    const result = (await handler(ev as APIGatewayProxyEventV2, {} as Context)) as unknown as {
      headers: Record<string, string>
      statusCode: number
      body: string
    }

    const expected = {
      headers: { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
      statusCode: 400,
      body: serialize({}),
    }

    expect(result.headers).toEqual(expected.headers)
    expect(result.statusCode).toEqual(expected.statusCode)
    expect(JSON.parse(result.body).message).toMatch(/"message": "Invalid address format"/)
  })
})
