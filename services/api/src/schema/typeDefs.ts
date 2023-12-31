import path from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

export const getTypeDefs = () =>
  mergeTypeDefs(loadFilesSync(path.join(__dirname, './**/*.graphql')))
