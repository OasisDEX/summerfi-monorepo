import path from 'path'
import fs from 'fs-extra'
import type { PlopTypes } from '@turbo/gen'

const customAction: PlopTypes.CustomActionFunction = async (answers: {
  name?: string
  namePascalCase?: string
  nameKebabCase?: string
  nameCamelCase?: string
}) => {
  const name = answers.name
  ;(answers.namePascalCase = toPascalCase(name)),
    (answers.nameKebabCase = toKebabCase(name)),
    (answers.nameCamelCase = toCamelCase(name)),
    console.log('answers', answers)
  return 'Added casing variants'
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('plugin', {
    description: 'Add a new protocol plugin',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'name of the protocol (example: "Morpho")',
      },
    ],
    actions: [
      customAction,
      function createProtocolPluginDirectory(answers: { nameKebabCase?: string }) {
        if (!answers.nameKebabCase) {
          return 'no name provided, skipping plugin directory creation'
        }

        const directory = path.join(
          // resolves to the root of the current workspace
          plop.getDestBasePath(),
          'sdk/protocol-plugins/src/plugins',
          answers.nameKebabCase,
        )

        fs.mkdirSync(directory)
        // Make inner directories
        fs.mkdirSync(`${directory}/abis`)
        fs.mkdirSync(`${directory}/implementation`)
        fs.mkdirSync(`${directory}/interfaces`)
        fs.mkdirSync(`${directory}/types`)

        return `created empty ${directory} directory for protocol plugin`
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/{{namePascalCase}}ProtocolPlugin.ts',
        templateFile: 'templates/plugin/ProtocolPlugin.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/index.ts',
        templateFile: 'templates/plugin/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/abis.ts',
        templateFile: 'templates/plugin/abis.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/Types.ts',
        templateFile: 'templates/plugin/Types.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/builders/index.ts',
        templateFile: 'templates/plugin/builders/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/builders/{{namePascalCase}}PaybackWithdrawActionBuilder.ts',
        templateFile: 'templates/plugin/builders/PaybackWithdrawActionBuilder.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/builders/{{namePascalCase}}DepositBorrowActionBuilder.ts',
        templateFile: 'templates/plugin/builders/DepositBorrowActionBuilder.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/actions/index.ts',
        templateFile: 'templates/plugin/actions/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/actions/{{namePascalCase}}PaybackAction.ts',
        templateFile: 'templates/plugin/actions/PaybackAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/actions/{{namePascalCase}}WithdrawAction.ts',
        templateFile: 'templates/plugin/actions/WithdrawAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/actions/{{namePascalCase}}DepositAction.ts',
        templateFile: 'templates/plugin/actions/DepositAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/actions/{{namePascalCase}}BorrowAction.ts',
        templateFile: 'templates/plugin/actions/BorrowAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/sdk-common/src/protocols/interfaces/{{namePascalCase}}PoolId.ts',
        templateFile: 'templates/plugin/PoolId.hbs',
      },
        // TODO: Sort out imports here
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/{{namePascalCase}}/{{namePascalCase}}ProtocolPlugin.ts',
        templateFile: 'templates/plugin/index.hbs',
      },
    ],
  })
}

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
