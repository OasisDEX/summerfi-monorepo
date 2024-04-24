import path from 'path'
import fs from 'fs-extra'
import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('plugin', {
    description: 'Add a new protocol plugin',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: `name of the protocol (example: "MorphoBlue")`,
      },
    ],
    actions: [
      nameAction,
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
      // ABIs directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/abis/{{namePascalCase}}ABIS.ts',
        templateFile: 'templates/plugin/abis/ABIS.hbs',
      },
      // Implementation directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}ProtocolPlugin.ts',
        templateFile: 'templates/plugin/implementation/ProtocolPlugin.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}LendingPool.ts',
        templateFile: 'templates/plugin/implementation/LendingPool.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}CollateralConfig.ts',
        templateFile: 'templates/plugin/implementation/CollateralConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}CollateralConfigMap.ts',
        templateFile: 'templates/plugin/implementation/CollateralConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}DebtConfig.ts',
        templateFile: 'templates/plugin/implementation/DebtConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}DebtConfigMap.ts',
        templateFile: 'templates/plugin/implementation/DebtConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/index.ts',
        templateFile: 'templates/plugin/implementation/index.hbs',
      },
      // Interfaces directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}CollateralConfig.ts',
        templateFile: 'templates/plugin/interfaces/ICollateralConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}CollateralConfigMap.ts',
        templateFile: 'templates/plugin/interfaces/ICollateralConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}DebtConfig.ts',
        templateFile: 'templates/plugin/interfaces/IDebtConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}DebtConfigMap.ts',
        templateFile: 'templates/plugin/interfaces/IDebtConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}LendingPool.ts',
        templateFile: 'templates/plugin/interfaces/ILendingPool.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/index.ts',
        templateFile: 'templates/plugin/interfaces/index.hbs',
      },
      // Types directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/types/index.ts',
        templateFile: 'templates/plugin/types/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/types/{{namePascalCase}}PoolId.ts',
        templateFile: 'templates/plugin/types/PoolId.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/types/{{namePascalCase}}AddressAbiMap.ts',
        templateFile: 'templates/plugin/types/AddressAbiMap.hbs',
      },
      // Plugin index
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/index.ts',
        templateFile: 'templates/plugin/index.hbs',
      },
      // Actions & Builders
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/builders/index.ts',
        templateFile: 'templates/plugin/builders/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/builders/{{namePascalCase}}PaybackWithdrawActionBuilder.ts',
        templateFile: 'templates/plugin/builders/PaybackWithdrawActionBuilder.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/builders/{{namePascalCase}}DepositBorrowActionBuilder.ts',
        templateFile: 'templates/plugin/builders/DepositBorrowActionBuilder.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/index.ts',
        templateFile: 'templates/plugin/actions/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}PaybackAction.ts',
        templateFile: 'templates/plugin/actions/PaybackAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}WithdrawAction.ts',
        templateFile: 'templates/plugin/actions/WithdrawAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}DepositAction.ts',
        templateFile: 'templates/plugin/actions/DepositAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}BorrowAction.ts',
        templateFile: 'templates/plugin/actions/BorrowAction.hbs',
      },
      // Tests
      {
        type: 'add',
        path: 'sdk/protocol-plugins/tests/integration/{{namePascalCase}}ProtocolPlugin.spec.ts',
        templateFile: 'templates/plugin/tests/ProtocolPlugin.spec.integration.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/tests/unit/{{namePascalCase}}ProtocolPlugin.spec.ts',
        templateFile: 'templates/plugin/tests/ProtocolPlugin.spec.unit.hbs',
      },
    ],
  })
}

const nameAction: PlopTypes.CustomActionFunction = async (answers: {
  name: string
  namePascalCase?: string
  nameKebabCase?: string
  nameCamelCase?: string
  nameCapitalised?: string
}) => {
  const name = answers.name
  ;(answers.namePascalCase = toPascalCase(name)),
      (answers.nameKebabCase = toKebabCase(name)),
      (answers.nameCamelCase = toCamelCase(name)),
      (answers.nameCapitalised = name.toUpperCase())

  return 'Added casing variants'
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