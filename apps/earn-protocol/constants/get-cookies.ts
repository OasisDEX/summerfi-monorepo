export const getCookies = (cookiename: string) => {
  if (typeof document === 'undefined') {
    return ''
  }
  const cookiestring = RegExp(`${cookiename}=[^;]+`, 'u').exec(document.cookie)

  return decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./u, '') : '')
}
