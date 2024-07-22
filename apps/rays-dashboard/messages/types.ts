import { type getTranslations } from 'next-intl/server'

export type tNavType = Awaited<ReturnType<typeof getTranslations<'nav'>>>
