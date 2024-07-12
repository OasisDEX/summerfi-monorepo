import { PlopTypes } from '@turbo/gen'

export const ActionsCommon: PlopTypes.ActionType[] = [
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/tsconfig.test.json',
    templateFile: 'sdk-service/templates/common/tsconfig.test.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/tsconfig.json',
    templateFile: 'sdk-service/templates/common/tsconfig.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/tsconfig.build.json',
    templateFile: 'sdk-service/templates/common/tsconfig.build.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/package.json',
    templateFile: 'sdk-service/templates/common/package.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/jest.config.js',
    templateFile: 'sdk-service/templates/common/jest.config.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/.eslintrc.cjs',
    templateFile: 'sdk-service/templates/common/.eslintrc.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/src/index.ts',
    templateFile: 'sdk-service/templates/common/src/index.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/src/enums/index.ts',
    templateFile: 'sdk-service/templates/common/src/enums/index.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/src/interfaces/index.ts',
    templateFile: 'sdk-service/templates/common/src/interfaces/index.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-common/src/interfaces/I{{namePascalCase}}.ts',
    templateFile: 'sdk-service/templates/common/src/interfaces/IServiceInterface.hbs',
  },
]
