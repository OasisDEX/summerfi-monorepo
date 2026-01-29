import { CACHE_TIMES } from '@/constants/revalidation'

export type TransakWidgetParams = { [key: string]: unknown }

export const getTransakWidgetUrl = async ({
  widgetParams,
}: {
  widgetParams: TransakWidgetParams
}): Promise<string | undefined> => {
  try {
    const referrerDomain = typeof window !== 'undefined' ? window.location.origin : undefined

    const response = await fetch('/earn/api/transak/create-widget-url', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ widgetParams, referrerDomain }),
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to create widget URL: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as { widgetUrl?: string }

    return data.widgetUrl
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create Transak widget URL', error)

    return undefined
  }
}
