import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.json',
  output: 'src/generated/client',
  client: 'fetch',
  lint: true,
  format: true,
  enums: 'typescript',
})
