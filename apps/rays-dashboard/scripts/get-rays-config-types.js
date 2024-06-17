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

const getInterfaces = (configObject = { products: {} }) => {
  try {
    const interfaces = JsonToTS(configObject)
      .map((typeInterface) => {
        console.log('typeInterface', typeInterface)
        if (typeInterface.includes('RootObject')) {
          return typeInterface.replace('interface RootObject', 'export interface AppRaysConfigType')
        }
        if (typeInterface.includes('Borrow;')) {
          return typeInterface.replaceAll('Borrow;', 'ProductsConfig;')
        }
        if (typeInterface.includes('Borrow')) {
          return typeInterface
            .replace('interface Borrow', 'export interface ProductsConfig')
            .replaceAll('Ethereum[];', 'ProductNetworkConfig[];')
        }
        if (typeInterface.includes('Ethereum')) {
          return typeInterface.replace(
            'interface Ethereum',
            'export interface ProductNetworkConfig',
          )
        }
        return typeInterface
      })
      .join('\n\n')

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
  const configPath = join(__dirname, '..', 'types', 'generated')
  const configPathExists = await readdir(configPath).catch(() => false)

  if (!configPathExists) {
    await mkdir(configPath)
      .catch(() => {
        console.error('Error creating types/generated directory')
      })
      .then(() => {
        console.info(`${configPath} directory created`)
      })
  }

  if (interfaces !== '') {
    writeFile(join(configPath, 'rays-types.ts'), interfaces)
      .then(() => {
        console.info('Config types generated')
      })
      .catch((error) => {
        console.error(`Error generating config types: ${error}`)
      })
  }
}

void main()
