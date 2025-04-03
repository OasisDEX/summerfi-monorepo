import type { Context, EventBridgeEvent } from 'aws-lambda'
import process from 'node:process'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'update-product-hub-cron-function' })

export const handler = async (
  event: EventBridgeEvent<'Scheduled Event', never>,
  context: Context,
): Promise<void> => {
  logger.addContext(context)

  const { NODE_ENV, SUMMER_PRO_PRODUCT_HUB_KEY } = process.env

  if (!NODE_ENV) {
    logger.error('NODE_ENV is not set')
    return
  }

  if (!SUMMER_PRO_PRODUCT_HUB_KEY) {
    logger.error('SUMMER_PRO_PRODUCT_HUB_KEY is not set')
    return
  }

  const isProd = NODE_ENV === 'production'

  const startTime = Date.now()

  try {
    const res = await fetch(
      `${isProd ? 'https://pro.summer.fi' : 'https://pro.oasisapp.dev'}/api/product-hub`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          protocols: ['ajna', 'aavev2', 'aavev3', 'maker', 'sparkv3', 'morphoblue', 'erc-4626'],
        }),
        headers: {
          'Content-Type': 'application/json',
          authorization: `${SUMMER_PRO_PRODUCT_HUB_KEY}`,
        },
      },
    )

    if (!res.ok) {
      throw new Error(`Failed to update product hub: ${res.status} ${res.statusText}`)
    }

    const endTime = Date.now()
    const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

    logger.info('Product hub updated', { duration })
  } catch (error) {
    logger.error('Failed to update product hub', { error })
  }
}

export default handler
