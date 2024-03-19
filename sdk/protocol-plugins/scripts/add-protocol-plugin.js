const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const { promisify } = require('util')

const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const copyFile = promisify(fs.copyFile)
const writeFile = promisify(fs.writeFile)
const rename = promisify(fs.rename)

const toKebabCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ''
      return index === 0 ? match.toLowerCase() : match.toUpperCase()
    })
    .replace(/-+/g, '')
    .replace(/_+/g, '')
}

const toPascalCase = (str) => {
  return str.replace(/(^\w|-\w)/g, clearAndUpper)
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase()
}

const pluginsDirPath = path.join(__dirname, '../src')

const templateDirPath = path.join(__dirname, 'plugin-template')

async function processFileWithMustache(filePath, templateValues) {
  try {
    const fileContents = await readFile(filePath, 'utf8')
    const processedContents = mustache.render(fileContents, templateValues)
    await writeFile(filePath, processedContents, 'utf8')
  } catch (e) {
    console.error(`Failed to process file: ${filePath}`)
    throw e
  }
}

async function renameTemplateFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })

  for (let entry of entries) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await renameTemplateFiles(filePath)
    } else {
      if (filePath.endsWith('.mustache')) {
        const newFilePath = filePath.slice(0, -9)
        await rename(filePath, newFilePath)
      }
    }
  }
}

async function copyFilesRecursively(source, destination, templateValues) {
  const entries = await readdir(source, { withFileTypes: true })

  for (let entry of entries) {
    if (entry.name === '.DS_Store') continue
    const sourcePath = path.join(source, entry.name)
    let destinationPath = path.join(destination, mustache.render(entry.name, templateValues))

    if (entry.isDirectory()) {
      await mkdir(destinationPath)
      await copyFilesRecursively(sourcePath, destinationPath, templateValues)
    } else {
      await copyFile(sourcePath, destinationPath)
      await processFileWithMustache(destinationPath, templateValues)
    }
  }

  await renameTemplateFiles(destination)
}

async function createNewPlugin(pluginName) {
  const protocolName = process.argv[2]
  if (!protocolName) {
    console.error('Please provide a protocol name.')
    process.exit(1)
  }

  console.log('Provided name: ', pluginName)

  const templateValues = {
    name: toPascalCase(pluginName),
    namePascalCase: toPascalCase(pluginName),
    nameKebabCase: toKebabCase(pluginName),
    nameCamelCase: toCamelCase(pluginName),
  }

  console.log('Template values: ', templateValues)

  const newPluginPath = path.join(pluginsDirPath, templateValues.nameKebabCase)

  try {
    if (fs.existsSync(newPluginPath)) {
      console.error(`Plugin "${pluginName}" already exists.`)
      return
    }

    await mkdir(newPluginPath)
    await copyFilesRecursively(templateDirPath, newPluginPath, templateValues)

    console.log(`Plugin "${pluginName}" created successfully.`)
  } catch (error) {
    console.error(`Error creating plugin "${pluginName}": ${error.message}`)
  }
}

createNewPlugin(process.argv[2])
