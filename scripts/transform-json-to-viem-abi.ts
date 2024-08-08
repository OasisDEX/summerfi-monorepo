import fs from 'fs'
import path from 'path'

const pathToAbiFolder = path.resolve(__dirname, '../armada-protocol/abis/src')
// read all folders in the path with specific suffix name
const folderNameList = fs.readdirSync(pathToAbiFolder).filter((path) => path.endsWith('.sol'))

// iterate over all folders
folderNameList.forEach((folderName) => {
  // get the path to the folder
  const folderPath = path.resolve(pathToAbiFolder, folderName)
  // get filename list in the folder
  const fileNameList = fs.readdirSync(folderPath)
  // iterate over all files in the folder
  fileNameList.forEach((fileName) => {
    if (fileName.endsWith('.abi.ts') || fileName === 'index.ts') {
      return
    }
    // get the path to the json file
    const filePath = path.resolve(pathToAbiFolder, folderName, fileName)
    // read the file content as json
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const jsonContent = JSON.parse(fileContent).abi
    // create a new ts file with the json content assigned to a const
    const className = fileName.split('.')[0]
    const tsFileContent = `export const ${className}Abi = ${JSON.stringify(jsonContent)} as const`
    // write the file content to a new ts file with the same name and .ts suffix
    fs.writeFileSync(
      path.resolve(pathToAbiFolder, folderName, `${className}.abi.ts`),
      tsFileContent,
    )
  })
})
