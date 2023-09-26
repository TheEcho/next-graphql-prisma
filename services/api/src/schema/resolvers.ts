import path from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'

export const getResolvers = () => {
  const queryResolverArray = loadFilesSync(path.join(__dirname, './**/query.*'))
  const Query = mergeResolvers(queryResolverArray).Query

  const mutationResolverArray = loadFilesSync(path.join(__dirname, './**/mutation.*'))
  const Mutation = mergeResolvers(mutationResolverArray).Mutation

  const resolverResolverArray = loadFilesSync(path.join(__dirname, './**/resolver.*'))
  const types = mergeResolvers(resolverResolverArray)

  return {
    Query,
    Mutation,
    ...types,
  }
}
