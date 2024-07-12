import type { PlopTypes } from '@turbo/gen'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupNamesAction: PlopTypes.CustomActionFunction = async (answers: any) => {
  const name = answers.name
  ;(answers.namePascalCase = toPascalCase(name)),
    (answers.nameKebabCase = toKebabCase(name)),
    (answers.nameCamelCase = toCamelCase(name)),
    (answers.nameCapitalised = name.toUpperCase())

  return 'Added casing variants'
}

const toKebabCase = (str: string) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ''
      return index === 0 ? match.toLowerCase() : match.toUpperCase()
    })
    .replace(/-+/g, '')
    .replace(/_+/g, '')
}

const toPascalCase = (str: string) => {
  return str.replace(/(^\w|-\w)/g, clearAndUpper)
}

function clearAndUpper(text: string) {
  return text.replace(/-/, '').toUpperCase()
}
