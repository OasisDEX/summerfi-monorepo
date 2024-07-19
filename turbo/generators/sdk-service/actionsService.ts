import { PlopTypes } from '@turbo/gen'

export const ActionsService: PlopTypes.ActionType[] = [
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/tsconfig.test.json',
    templateFile: 'sdk-service/templates/service/tsconfig.test.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/tsconfig.json',
    templateFile: 'sdk-service/templates/service/tsconfig.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/tsconfig.build.json',
    templateFile: 'sdk-service/templates/service/tsconfig.build.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/package.json',
    templateFile: 'sdk-service/templates/service/package.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/jest.config.js',
    templateFile: 'sdk-service/templates/service/jest.config.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/.eslintrc.cjs',
    templateFile: 'sdk-service/templates/service/.eslintrc.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/src/index.ts',
    templateFile: 'sdk-service/templates/service/src/index.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/src/enums/index.ts',
    templateFile: 'sdk-service/templates/service/src/enums/index.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/src/interfaces/index.ts',
    templateFile: 'sdk-service/templates/service/src/interfaces/index.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/src/implementation/{{namePascalCase}}.ts',
    templateFile: 'sdk-service/templates/service/src/implementation/Service.hbs',
  },
  {
    type: 'add',
    path: 'sdk/{{nameKebabCase}}-service/src/implementation/{{namePascalCase}}Factory.ts',
    templateFile: 'sdk-service/templates/service/src/implementation/ServiceFactory.hbs',
  },
]
