import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../api/src/generated/schema.graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    './src/generated/api-graphql.ts': {
      config: {
        typesPrefix: 'I',
        operationResultSuffix: 'Data',
        enumsAsConst: true,
      },
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    }
  },
  ignoreNoDocuments: true,
};


export default config;
