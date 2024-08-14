import type { PlopTypes } from '@turbo/gen'
import { setupNamesAction } from '../common'
import { createProtocolPluginDirectory } from './helpers/createProtocolPluginDirectory'

export function setupProtocolPluginGenerator(plop: PlopTypes.NodePlopAPI): void {
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
      setupNamesAction,
      createProtocolPluginDirectory,
      // ABIs directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/abis/{{namePascalCase}}ABIS.ts',
        templateFile: 'templates/abis/ABIS.hbs',
      },
      // Implementation directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}ProtocolPlugin.ts',
        templateFile: 'templates/implementation/ProtocolPlugin.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}LendingPool.ts',
        templateFile: 'templates/implementation/LendingPool.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}CollateralConfig.ts',
        templateFile: 'templates/implementation/CollateralConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}CollateralConfigMap.ts',
        templateFile: 'templates/implementation/CollateralConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}DebtConfig.ts',
        templateFile: 'templates/implementation/DebtConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/{{namePascalCase}}DebtConfigMap.ts',
        templateFile: 'templates/implementation/DebtConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/implementation/index.ts',
        templateFile: 'templates/implementation/index.hbs',
      },
      // Interfaces directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}CollateralConfig.ts',
        templateFile: 'templates/interfaces/ICollateralConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}CollateralConfigMap.ts',
        templateFile: 'templates/interfaces/ICollateralConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}DebtConfig.ts',
        templateFile: 'templates/interfaces/IDebtConfig.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}DebtConfigMap.ts',
        templateFile: 'templates/interfaces/IDebtConfigMap.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/I{{namePascalCase}}LendingPool.ts',
        templateFile: 'templates/interfaces/ILendingPool.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/interfaces/index.ts',
        templateFile: 'templates/interfaces/index.hbs',
      },
      // Types directory
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/types/index.ts',
        templateFile: 'templates/types/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/types/{{namePascalCase}}PoolId.ts',
        templateFile: 'templates/types/PoolId.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/types/{{namePascalCase}}AddressAbiMap.ts',
        templateFile: 'templates/types/AddressAbiMap.hbs',
      },
      // Plugin index
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/index.ts',
        templateFile: 'templates/index.hbs',
      },
      // Actions & Builders
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/builders/index.ts',
        templateFile: 'templates/builders/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/builders/{{namePascalCase}}PaybackWithdrawActionBuilder.ts',
        templateFile: 'templates/builders/PaybackWithdrawActionBuilder.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/builders/{{namePascalCase}}DepositBorrowActionBuilder.ts',
        templateFile: 'templates/builders/DepositBorrowActionBuilder.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/index.ts',
        templateFile: 'templates/actions/index.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}PaybackAction.ts',
        templateFile: 'templates/actions/PaybackAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}WithdrawAction.ts',
        templateFile: 'templates/actions/WithdrawAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}DepositAction.ts',
        templateFile: 'templates/actions/DepositAction.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/src/plugins/{{nameKebabCase}}/actions/{{namePascalCase}}BorrowAction.ts',
        templateFile: 'templates/actions/BorrowAction.hbs',
      },
      // Tests
      {
        type: 'add',
        path: 'sdk/protocol-plugins/tests/integration/{{namePascalCase}}ProtocolPlugin.spec.ts',
        templateFile: 'templates/tests/ProtocolPlugin.spec.integration.hbs',
      },
      {
        type: 'add',
        path: 'sdk/protocol-plugins/tests/unit/{{namePascalCase}}ProtocolPlugin.spec.ts',
        templateFile: 'templates/tests/ProtocolPlugin.spec.unit.hbs',
      },
    ],
  })
}
