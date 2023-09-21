import path from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'

export const getResolvers = () => {
  const queryResolverArray = loadFilesSync(path.join(import.meta.dir, './**/query.*'))
  // console.info(queryResolverArray)
  const Query = mergeResolvers(queryResolverArray).Query
  // console.info(Query)

  const mutationResolverArray = loadFilesSync(path.join(import.meta.dir, './**/mutation.*'))
  const Mutation = mergeResolvers(mutationResolverArray).Mutation

  const resolverResolverArray = loadFilesSync(path.join(import.meta.dir, './**/resolver.*'))
  const types = mergeResolvers(resolverResolverArray)

  return {
    Query,
    Mutation,
    ...types,
  }
}
