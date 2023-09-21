import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/generated/schema.graphql',
  generates: {
    './src/generated/graphql-resolvers-types.ts': {
      config: {
        useIndexSignature: true,
        enumsAsConst: true,
        maybeValue: 'T | undefined',
        scalars: {
          Void: 'void',
        },
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}

export default config
