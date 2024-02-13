export function toCamelCase(name: string, separator: string) {
  let camelCaseName = ''
  name.split(separator).forEach(function (el, idx) {
    const add = el.toLowerCase()
    camelCaseName += idx === 0 ? add : add[0].toUpperCase() + add.slice(1)
  })
  return camelCaseName
}
