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
  const response = await fetch(process.env.CONFIG_URL_EARN)
  return await response.json()
}

const getInterfaces = (configObject = { features: {} }) => {
  try {
    const interfaces = JsonToTS(configObject)
      .map((typeInterface) => {
        if (typeInterface.includes('RootObject')) {
          return typeInterface.replace('interface RootObject', 'export interface EarnAppConfigType')
        }
        return typeInterface
      })
      .join('\n\n')
    const importRisk = 'import { RiskType } from "../earn-protocol/risk";\n'
    const intarfacesMapped = interfaces
      .replaceAll('_0x', 'EarnAppFleetCustomConfigType')
      .replaceAll(
        'interface EarnAppFleetCustomConfigType',
        'export interface EarnAppFleetCustomConfigType',
      )
      .replaceAll('risk: string', 'risk: RiskType')
    return `${importRisk}${intarfacesMapped}`
  } catch (error) {
    console.error(`Earn Protocol Summer.fi: Error generating config types: ${error}`)
    return ''
  }
}

const main = async () => {
  if (!process.env.CONFIG_URL_EARN) {
    console.error('Earn Protocol Summer.fi: CONFIG_URL_EARN environment variable not set')
    return
  }
  const config = await getConfig()
  const interfaces = getInterfaces(config)
  const configPath = join(__dirname, '..', 'types', 'src', 'generated')
  const configPathExists = await readdir(configPath).catch(() => false)

  if (!configPathExists) {
    await mkdir(configPath)
      .catch(() => {
        console.error('Earn Protocol Summer.fi: Error creating types/generated directory')
      })
      .then(() => {
        console.info(`Earn Protocol Summer.fi: ${configPath} directory created`)
      })
  }

  if (interfaces !== '') {
    writeFile(join(configPath, 'earn-app-config.ts'), interfaces)
      .then(() => {
        console.info('Earn Protocol Summer.fi: Config types generated')
      })
      .catch((error) => {
        console.error(`Earn Protocol Summer.fi: Error generating config types: ${error}`)
      })
  }
}

void main()
