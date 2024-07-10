const dotenv = require('dotenv')
const { mkdir, readdir, writeFile } = require('fs/promises')
const JsonToTS = require('json-to-ts')
const fetch = require('node-fetch')
const { join } = require('path')

dotenv.config({
  path: '.env',
})
dotenv.config({
  path: '.env.local',
})

const getConfig = async () => {
  const response = await fetch(process.env.CONFIG_URL_RAYS)
  return await response.json()
}

const getInterfaces = (_) => {
  try {
    const interfaces = [
      'export interface AppRaysConfigType {\n  products: Products;\n}',
      'export interface Products {\n' +
        '  borrow: ProductsConfig;\n' +
        '  multiply: ProductsConfig;\n' +
        '  earn: ProductsConfig;\n' +
        '}',
      'export interface ProductsConfig {\n' +
        '  ethereum: ProductNetworkConfig[];\n' +
        '  base: ProductNetworkConfig[];\n' +
        '  arbitrum: ProductNetworkConfig[];\n' +
        '  optimism: ProductNetworkConfig[];\n' +
        '}',
      'export interface ProductNetworkConfig {\n' +
        '  label: string;\n' +
        '  link: string;\n' +
        '  protocol: string;\n' +
        '}',
    ].join('\n\n')

    const emptyConfig = `export const emptyConfig = {
    products: {},
} as AppRaysConfigType & {
  error?: string
}`
    return `${interfaces}\n${emptyConfig}`
  } catch (error) {
    console.error(`Error generating config types: ${error}`)
    return ''
  }
}

const main = async () => {
  if (!process.env.CONFIG_URL_RAYS) {
    console.error('CONFIG_URL_RAYS environment variable not set')
    return
  }
  const config = await getConfig()
  const interfaces = getInterfaces(config)
  const configPath = join(__dirname, '..', 'types', 'src', 'generated')
  const configPathExists = await readdir(configPath).catch(() => false)

  if (!configPathExists) {
    await mkdir(configPath)
      .catch(() => {
        console.error('Error creating rays types/generated directory')
      })
      .then(() => {
        console.info(`Rays ${configPath} directory created`)
      })
  }

  if (interfaces !== '') {
    writeFile(join(configPath, 'rays-config.ts'), interfaces)
      .then(() => {
        console.info('Rays Config types generated')
      })
      .catch((error) => {
        console.error(`Error generating rays config types: ${error}`)
      })
  }
}

void main()
