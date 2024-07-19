export const getCookies = (cookiename: string) => {
  const cookiestring = RegExp(`${cookiename}=[^;]+`, 'u').exec(document.cookie)

  return decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./u, '') : '')
}
