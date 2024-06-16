export const isSSR = () => {
  // eslint-disable-next-line no-console
  console.log('isSSR', typeof window === 'undefined')

  return typeof window === 'undefined'
}
