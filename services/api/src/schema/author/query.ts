import type { QueryBookArgs } from 'generated/graphql-resolvers-types'

import { getAuthor } from 'services/author/getAuthor/getAuthor'
import { getAuthors } from 'services/author/getAuthors/getAuthors'

import type { GraphqlContext } from '../types'

export default {
  Query: {
    author: async (_: unknown, args: QueryBookArgs, ctx: GraphqlContext) => {
      return { author: await getAuthor(ctx, args.id) }
    },
    authors: async (_: unknown, args: unknown, ctx: GraphqlContext) => {
      return getAuthors(ctx)
    },
  },
}
