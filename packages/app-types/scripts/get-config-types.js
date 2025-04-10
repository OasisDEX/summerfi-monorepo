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
  const response = await fetch(process.env.CONFIG_URL)
  return await response.json()
}

const getInterfaces = (configObject = { features: {} }) => {
  try {
    const interfaces = JsonToTS(configObject)
      .map((typeInterface) => {
        if (typeInterface.includes('RootObject')) {
          return typeInterface.replace('interface RootObject', 'export interface AppConfigType')
        }
        return typeInterface
      })
      .join('\n\n')
    const featuresList = Object.keys(configObject.features || {})
    const featuresEnum = `export enum FeaturesEnum {
${featuresList.map((feature) => `  ${feature} = '${feature}',`).join('\n')}
}`
    const emptyConfig = `export const emptyConfig = {
  features: ${JSON.stringify(configObject.features, null, 4)
    .split('\n')
    .map((line) => line.replace('true', 'false'))
    .join('\n')},
    parameters: {},
    navigation: {},
    rpcConfig: {},
} as AppConfigType & {
  error?: string
}`
    return `${interfaces}\n${featuresEnum}\n${emptyConfig}`
  } catch (error) {
    console.error(`Main Summer.fi: Error generating config types: ${error}`)
    return ''
  }
}

const main = async () => {
  if (!process.env.CONFIG_URL) {
    console.error('Main Summer.fi: CONFIG_URL environment variable not set')
    return
  }
  const config = await getConfig()
  const interfaces = getInterfaces(config)
  const configPath = join(__dirname, '..', 'types', 'src', 'generated')
  const configPathExists = await readdir(configPath).catch(() => false)

  if (!configPathExists) {
    await mkdir(configPath)
      .catch(() => {
        console.error('Main Summer.fi: Error creating types/generated directory')
      })
      .then(() => {
        console.info(`Main Summer.fi: ${configPath} directory created`)
      })
  }

  if (interfaces !== '') {
    writeFile(join(configPath, 'main-config.ts'), interfaces)
      .then(() => {
        console.info('Main Summer.fi: Config types generated')
      })
      .catch((error) => {
        console.error(`Main Summer.fi: Error generating config types: ${error}`)
      })
  }
}

void main()
