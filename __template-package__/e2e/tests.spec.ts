import { handler } from '../src'

describe('e2e', () => {
  it('template', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await handler({} as any)
    expect(res).toEqual({
      body: '{"message":"Hello World!"}',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
    })
  })
})
